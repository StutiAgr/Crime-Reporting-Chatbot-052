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
        """Validate description"""
        if slot_value and len(slot_value.strip()) >= 10:
            return {"description": slot_value}
        else:
            dispatcher.utter_message(
                text="Please provide a more detailed description (at least 10 characters)."
            )
            return {"description": None}

    def validate_location(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate location"""
        if slot_value and len(slot_value.strip()) >= 3:
            return {"location": slot_value}
        else:
            dispatcher.utter_message(
                text="Please provide a valid location (at least 3 characters)."
            )
            return {"location": None}

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
        
        # Accept relative dates
        valid_relative = ["today", "yesterday", "last night", "this morning", 
                         "this evening", "last week", "last month"]
        if slot_value_lower in valid_relative:
            return {"date": slot_value}
        
        # Try to parse date patterns
        date_patterns = [
            r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',  # DD/MM/YYYY
            r'\d{4}[/-]\d{1,2}[/-]\d{1,2}',    # YYYY/MM/DD
        ]
        
        for pattern in date_patterns:
            if re.search(pattern, slot_value):
                return {"date": slot_value}
        
        dispatcher.utter_message(
            text="Please provide a valid date (e.g., 'yesterday', 'today', or '25/09/2024')."
        )
        return {"date": None}


class ActionSaveComplaint(Action):
    """Saves the complaint to JSON file"""
    
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

        # Generate complaint ID
        complaint_id = str(random.randint(10000, 99999))

        complaint = {
            "id": complaint_id,
            "description": description,
            "location": location,
            "date": date,
            "status": "Registered",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        # Save to JSON file
        file_path = os.path.join(os.getcwd(), "complaints.json")
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

        # Send confirmation message
        message = (
            f"✅ Thank you! Your complaint has been registered successfully.\n\n"
            f"📋 Complaint ID: {complaint_id}\n"
            f"📍 Location: {location}\n"
            f"📅 Date: {date}\n\n"
            f"Please save this ID to check your complaint status later."
        )
        
        dispatcher.utter_message(text=message)
        
        return [
            SlotSet("complaint_id", complaint_id),
            SlotSet("description", None),
            SlotSet("location", None),
            SlotSet("date", None)
        ]