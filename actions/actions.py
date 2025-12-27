from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker, FormValidationAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
from rasa_sdk.types import DomainDict
import json
import os
import random
import re
from datetime import datetime
from textblob import TextBlob
import requests

class ValidateComplaintForm(FormValidationAction):
    """Validates the complaint form slots"""
    
    def name(self) -> Text:
        return "validate_complaint_form"

    def validate_description(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate description with improved checks"""
        if not slot_value:
            dispatcher.utter_message(text="Please provide a description of what happened.")
            return {"description": None}
        
        # Clean the input
        cleaned_value = slot_value.strip()
        
        # Check minimum length
        if len(cleaned_value) < 10:
            dispatcher.utter_message(
                text="Please provide a more detailed description (at least 10 characters). "
                     "Include details like what happened, who was involved, and what was taken or damaged."
            )
            return {"description": None}
        
        # Check if it's just repeated characters (like "aaaaaaaaaa")
        if len(set(cleaned_value.replace(" ", ""))) < 3:
            dispatcher.utter_message(
                text="Please provide a meaningful description of the incident."
            )
            return {"description": None}
        
        # Check if it's a very short word repeated (like "ok ok ok ok ok ok")
        words = cleaned_value.split()
        if len(words) > 3 and len(set(words)) == 1:
            dispatcher.utter_message(
                text="Please provide a proper description of what happened."
            )
            return {"description": None}
        
        return {"description": cleaned_value}

    def validate_location(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate location with improved checks"""
        if not slot_value:
            dispatcher.utter_message(text="Please provide the location where the incident occurred.")
            return {"location": None}
        
        # Clean the input
        cleaned_value = slot_value.strip()
        
        # Check minimum length
        if len(cleaned_value) < 3:
            dispatcher.utter_message(
                text="Please provide a complete location (at least 3 characters). "
                     "Include area name, landmark, or address."
            )
            return {"location": None}
        
        # Check if it's just numbers (invalid location)
        if cleaned_value.replace(" ", "").isdigit():
            dispatcher.utter_message(
                text="Please provide a proper location name, not just numbers."
            )
            return {"location": None}
        
        return {"location": cleaned_value}

    def validate_date(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate date"""
        if not slot_value:
            dispatcher.utter_message(text="Please provide a date.")
            return {"date": None}
            
        slot_value_lower = slot_value.lower().strip()
        
        # Extended list of acceptable relative dates and time phrases
        valid_relative = [
            "today", "yesterday", "tonight", "right now", "just now",
            "last night", "this morning", "this afternoon", "this evening",
            "yesterday morning", "yesterday afternoon", "yesterday evening", "yesterday night",
            "last week", "last month", "last year",
            "this week", "this month", "last friday", "last monday", 
            "last tuesday", "last wednesday", "last thursday", 
            "last saturday", "last sunday",
            "few days ago", "few hours ago", "some time ago", "recently",
            "2 days ago", "3 days ago", "4 days ago", "5 days ago",
            "a week ago", "two weeks ago", "a month ago"
        ]
        
        # Check if the input matches any valid relative date
        if slot_value_lower in valid_relative:
            return {"date": slot_value}
        
        # Check if input contains valid relative patterns (partial matching)
        relative_patterns = [
            "today", "yesterday", "last night", "this morning", "ago",
            "last week", "last month", "recently", "just now"
        ]
        
        for pattern in relative_patterns:
            if pattern in slot_value_lower:
                return {"date": slot_value}
        
        # Try to parse date patterns (DD/MM/YYYY, DD-MM-YYYY, etc.)
        date_patterns = [
            r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',  # DD/MM/YYYY or DD-MM-YYYY
            r'\d{4}[/-]\d{1,2}[/-]\d{1,2}',    # YYYY/MM/DD or YYYY-MM-DD
            r'\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)',  # 15 Jan, 20 March
            r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}',  # Jan 15, March 20
        ]
        
        for pattern in date_patterns:
            if re.search(pattern, slot_value_lower):
                return {"date": slot_value}
        
        # If nothing matches, ask for a valid date
        dispatcher.utter_message(
            text="Please provide a valid date. You can say things like:\n"
                 "• 'yesterday', 'today', 'last night'\n"
                 "• '2 days ago', 'last week'\n"
                 "• Or a specific date like '25/09/2024'"
        )
        return {"date": None}


class ActionSaveComplaint(Action):
    """Saves the complaint to Backend API and JSON file"""
    
    def name(self) -> Text:
        return "action_save_complaint"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:

        description = tracker.get_slot("description")
        location = tracker.get_slot("location")
        date = tracker.get_slot("date")
        
        # Get sentiment data
        sentiment = tracker.get_slot("sentiment")
        sentiment_score = tracker.get_slot("sentiment_score")
        emotion = tracker.get_slot("emotion")
        urgency_level = tracker.get_slot("urgency_level")
        urgency_score = tracker.get_slot("urgency_score")

        # Generate complaint ID
        complaint_id = str(random.randint(10000, 99999))

        # Prepare complaint data
        complaint = {
            "complaintId": complaint_id,
            "description": description,
            "location": location,
            "date": date,
            "status": "Registered",
            "timestamp": datetime.now().isoformat(),
            "sentimentAnalysis": {
                "sentiment": sentiment or "NEUTRAL",
                "sentimentScore": sentiment_score or 0.0,
                "emotion": emotion or "NEUTRAL",
                "urgencyLevel": urgency_level or "MEDIUM",
                "urgencyScore": urgency_score or 5
            }
        }

        # Save to local JSON file (backup)
        self.save_to_json(complaint)
        
        # Send to Backend API
        api_success = self.send_to_backend(complaint)
        
        # Prepare response message
        if api_success:
            message = (
                f"✅ Thank you! Your complaint has been registered successfully.\n\n"
                f"📋 Complaint ID: {complaint_id}\n"
                f"📍 Location: {location}\n"
                f"📅 Date: {date}\n"
                f"🚨 Urgency: {urgency_level}\n\n"
                f"Your complaint has been saved to the database.\n"
                f"Please save this ID to check your complaint status later."
            )
        else:
            message = (
                f"✅ Your complaint has been registered locally.\n\n"
                f"📋 Complaint ID: {complaint_id}\n"
                f"📍 Location: {location}\n"
                f"📅 Date: {date}\n\n"
                f"⚠️ Note: Could not connect to server. Your complaint is saved locally.\n"
                f"Please save this ID."
            )
        
        dispatcher.utter_message(text=message)
        
        return [
            SlotSet("complaint_id", complaint_id),
            SlotSet("description", None),
            SlotSet("location", None),
            SlotSet("date", None),
            SlotSet("sentiment", None),
            SlotSet("sentiment_score", None),
            SlotSet("emotion", None),
            SlotSet("urgency_level", None),
            SlotSet("urgency_score", None)
        ]
    
    def save_to_json(self, complaint: Dict) -> None:
        """Save complaint to local JSON file as backup"""
        file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "complaints.json")
        try:
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            else:
                data = []
        except Exception:
            data = []

        data.append(complaint)
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Complaint saved to local JSON file")
    
    def send_to_backend(self, complaint: Dict) -> bool:
        """Send complaint data to Backend API"""
        # TODO: Your teammate will provide the actual API URL
        # For now, we'll use a placeholder
        BACKEND_API_URL = "http://localhost:3000/api/complaints"
        
        try:
            print(f"\n📤 Sending complaint to backend API...")
            print(f"URL: {BACKEND_API_URL}")
            print(f"Data: {json.dumps(complaint, indent=2)}")
            
            response = requests.post(
                BACKEND_API_URL,
                json=complaint,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Successfully sent to backend! Status: {response.status_code}")
                return True
            else:
                print(f"⚠️ Backend returned status code: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except requests.exceptions.ConnectionError:
            print(f"❌ Could not connect to backend API at {BACKEND_API_URL}")
            print(f"   Make sure backend server is running!")
            return False
        except requests.exceptions.Timeout:
            print(f"❌ Backend API request timed out")
            return False
        except Exception as e:
            print(f"❌ Error sending to backend: {e}")
            return False

class ActionDetectSentiment(Action):
    """Detects sentiment and urgency in user messages"""
    
    def name(self) -> Text:
        return "action_detect_sentiment"
    
    def detect_urgency(self, text: str) -> Dict[str, Any]:
        """Detect urgency level based on keywords"""
        text_lower = text.lower()
        
        # Emergency keywords
        emergency_keywords = [
            'emergency', 'urgent', 'immediately', 'right now', 'help',
            'asap', 'critical', 'serious', 'danger', 'threatening',
            'attacked', 'attack', 'murder', 'kidnap', 'rape', 'assault'
        ]
        
        # High urgency keywords
        high_urgency_keywords = [
            'stolen', 'robbed', 'robbery', 'theft', 'lost', 'missing',
            'fraud', 'scam', 'cheated', 'injured', 'hurt', 'bleeding',
            'violence', 'domestic violence', 'harassment', 'stalking'
        ]
        
        # Medium urgency keywords
        medium_urgency_keywords = [
            'complaint', 'report', 'incident', 'happened', 'occurred',
            'issue', 'problem', 'concern', 'yesterday', 'last night'
        ]
        
        # Check for emergency
        for keyword in emergency_keywords:
            if keyword in text_lower:
                return {
                    'urgency_level': 'EMERGENCY',
                    'urgency_score': 10,
                    'reason': f'Emergency keyword detected: {keyword}'
                }
        
        # Check for high urgency
        for keyword in high_urgency_keywords:
            if keyword in text_lower:
                return {
                    'urgency_level': 'HIGH',
                    'urgency_score': 7,
                    'reason': f'High urgency keyword detected: {keyword}'
                }
        
        # Check for medium urgency
        for keyword in medium_urgency_keywords:
            if keyword in text_lower:
                return {
                    'urgency_level': 'MEDIUM',
                    'urgency_score': 5,
                    'reason': f'Medium urgency keyword detected: {keyword}'
                }
        
        # Default to low
        return {
            'urgency_level': 'LOW',
            'urgency_score': 2,
            'reason': 'No urgency indicators found'
        }
    
    def detect_emotion(self, text: str, sentiment_score: float) -> str:
        """Detect emotion based on sentiment score and keywords"""
        text_lower = text.lower()
        
        # Check for distress keywords
        distress_keywords = ['help', 'please', 'scared', 'afraid', 'worried', 
                            'panic', 'terrified', 'desperate']
        
        # Check for anger keywords
        anger_keywords = ['angry', 'furious', 'outraged', 'frustrated', 
                         'disgusted', 'fed up', 'annoyed']
        
        # Check for sadness keywords
        sad_keywords = ['sad', 'upset', 'crying', 'depressed', 'hopeless',
                       'devastated', 'heartbroken']
        
        # Priority: Check keywords first
        for keyword in distress_keywords:
            if keyword in text_lower:
                return 'DISTRESSED'
        
        for keyword in anger_keywords:
            if keyword in text_lower:
                return 'ANGRY'
        
        for keyword in sad_keywords:
            if keyword in text_lower:
                return 'SAD'
        
        # Use sentiment score
        if sentiment_score < -0.5:
            return 'ANGRY'
        elif sentiment_score < -0.2:
            return 'DISTRESSED'
        elif sentiment_score < 0.2:
            return 'NEUTRAL'
        else:
            return 'CALM'
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]
    ) -> List[Dict[Text, Any]]:
        
        # Get user's latest message
        user_message = tracker.latest_message.get('text', '')
        
        if not user_message:
            return []
        
        # Analyze sentiment using TextBlob
        blob = TextBlob(user_message)
        sentiment_polarity = blob.sentiment.polarity  # -1 (negative) to +1 (positive)
        sentiment_subjectivity = blob.sentiment.subjectivity  # 0 (objective) to 1 (subjective)
        
        # Detect urgency
        urgency_data = self.detect_urgency(user_message)
        
        # Detect emotion
        emotion = self.detect_emotion(user_message, sentiment_polarity)
        
        # Determine overall sentiment
        if sentiment_polarity > 0.1:
            sentiment = 'POSITIVE'
        elif sentiment_polarity < -0.1:
            sentiment = 'NEGATIVE'
        else:
            sentiment = 'NEUTRAL'
        
        # Create sentiment analysis result
        analysis = {
            'text': user_message,
            'sentiment': sentiment,
            'sentiment_score': round(sentiment_polarity, 3),
            'subjectivity': round(sentiment_subjectivity, 3),
            'emotion': emotion,
            'urgency_level': urgency_data['urgency_level'],
            'urgency_score': urgency_data['urgency_score'],
            'urgency_reason': urgency_data['reason']
        }
        
        # Log analysis (for debugging)
        print("\n" + "="*60)
        print("🧠 SENTIMENT ANALYSIS:")
        print("="*60)
        print(f"Message: {user_message}")
        print(f"Sentiment: {sentiment} ({sentiment_polarity:.3f})")
        print(f"Emotion: {emotion}")
        print(f"Urgency: {urgency_data['urgency_level']} (Score: {urgency_data['urgency_score']})")
        print(f"Reason: {urgency_data['reason']}")
        print("="*60 + "\n")
        
        # Add empathetic response based on emotion
        if emotion in ['DISTRESSED', 'ANGRY', 'SAD']:
            if urgency_data['urgency_level'] == 'EMERGENCY':
                dispatcher.utter_message(
                    text="I understand this is an emergency situation. Let me help you file this complaint immediately."
                )
            elif emotion == 'DISTRESSED':
                dispatcher.utter_message(
                    text="I understand you're going through a difficult time. I'm here to help. Let's get your complaint registered."
                )
            elif emotion == 'ANGRY':
                dispatcher.utter_message(
                    text="I understand your frustration. Let me help you file this complaint properly so it gets the attention it deserves."
                )
            elif emotion == 'SAD':
                dispatcher.utter_message(
                    text="I'm sorry this happened to you. Let's work together to get your complaint registered."
                )
        
        # Store sentiment data in slots for later use
        return [
            SlotSet("sentiment", sentiment),
            SlotSet("sentiment_score", sentiment_polarity),
            SlotSet("emotion", emotion),
            SlotSet("urgency_level", urgency_data['urgency_level']),
            SlotSet("urgency_score", urgency_data['urgency_score'])
        ]