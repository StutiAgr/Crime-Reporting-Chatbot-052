import speech_recognition as sr
import requests
import json

# Configuration
RASA_URL = "http://localhost:5005/webhooks/rest/webhook"

def listen_to_microphone(mic_index=None):
    """Capture voice from microphone and convert to text"""
    recognizer = sr.Recognizer()
    
    # Better settings for recognition
    recognizer.energy_threshold = 300  # Lower threshold for quieter speech
    recognizer.dynamic_energy_threshold = True
    recognizer.pause_threshold = 1.0
    
    # Use specific microphone if provided
    if mic_index is not None:
        microphone = sr.Microphone(device_index=mic_index)
    else:
        microphone = sr.Microphone()
    
    with microphone as source:
        print("\n🎤 Adjusting for background noise (speak after beep)...")
        recognizer.adjust_for_ambient_noise(source, duration=2)
        print(f"   (Energy threshold: {recognizer.energy_threshold})")
        
        print("\n🔴 RECORDING... Speak NOW (clearly and loudly)!")
        
        try:
            # Listen for audio
            audio = recognizer.listen(source, timeout=8, phrase_time_limit=15)
            print("✅ Recording complete! Processing...")
            
            # Try multiple language options
            language_options = [
                ('en-US', 'English (US)'),
                ('en-IN', 'English (India)'),
                ('hi-IN', 'Hindi (India)'),
            ]
            
            for lang_code, lang_name in language_options:
                try:
                    print(f"   🔍 Trying {lang_name}...")
                    text = recognizer.recognize_google(audio, language=lang_code, show_all=False)
                    print(f"\n✅ SUCCESS! Recognized as: '{text}'")
                    return text
                except sr.UnknownValueError:
                    print(f"   ✗ Could not understand in {lang_name}")
                    continue
                except sr.RequestError as e:
                    print(f"   ✗ API Error in {lang_name}: {e}")
                    continue
            
            # If all languages fail
            print("\n❌ Could not recognize speech in any supported language")
            print("💡 Tips:")
            print("   • Speak louder and more clearly")
            print("   • Move closer to microphone")
            print("   • Reduce background noise")
            print("   • Check internet connection")
            return None
            
        except sr.WaitTimeoutError:
            print("❌ Timeout: No speech detected within 8 seconds")
            print("💡 Tip: Start speaking immediately after you see 'RECORDING...'")
            return None
        except sr.RequestError as e:
            print(f"❌ Network/API Error: {e}")
            print("💡 Check your internet connection!")
            return None
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return None

def send_to_rasa(message):
    """Send message to Rasa chatbot"""
    try:
        payload = {
            "sender": "user",
            "message": message
        }
        
        response = requests.post(RASA_URL, json=payload, timeout=10)
        
        if response.status_code == 200:
            bot_responses = response.json()
            return bot_responses
        else:
            print(f"❌ Rasa Error: Server returned status {response.status_code}")
            return None
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Cannot connect to Rasa")
        print("💡 Make sure Rasa is running: rasa run --enable-api")
        return None
    except requests.exceptions.Timeout:
        print("❌ Timeout: Rasa took too long to respond")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def list_microphones():
    """List all available microphones"""
    print("\n" + "=" * 60)
    print("📋 AVAILABLE MICROPHONES:")
    print("=" * 60)
    for index, name in enumerate(sr.Microphone.list_microphone_names()):
        print(f"   [{index}] {name}")
    print("=" * 60)

def main():
    """Main voice chatbot loop"""
    print("=" * 60)
    print("🎤 VOICE-ENABLED CRIME COMPLAINT CHATBOT")
    print("=" * 60)
    
    # Show available microphones
    list_microphones()
    
    # Ask user to select microphone
    mic_choice = input("\nSelect microphone number (or press Enter for default): ").strip()
    mic_index = int(mic_choice) if mic_choice.isdigit() else None
    
    print("\n" + "=" * 60)
    print("INSTRUCTIONS:")
    print("=" * 60)
    print("1. Press Enter when ready to speak")
    print("2. Wait for 'RECORDING...' message")
    print("3. Speak CLEARLY and LOUDLY")
    print("4. Type 'quit' to exit")
    print("5. Type 'list' to see microphones again")
    print("=" * 60)
    
    while True:
        user_input = input("\n👉 Press Enter to speak (or 'quit'/'list'): ").strip().lower()
        
        if user_input == 'quit':
            print("\n👋 Goodbye! Stay safe.")
            break
        
        if user_input == 'list':
            list_microphones()
            continue
        
        # Capture voice input
        text = listen_to_microphone(mic_index)
        
        if text:
            # Send to Rasa
            print(f"\n📤 Sending to chatbot...")
            responses = send_to_rasa(text)
            
            if responses:
                print("\n" + "=" * 60)
                print("🤖 BOT RESPONSE:")
                print("=" * 60)
                for response in responses:
                    if 'text' in response:
                        print(f"{response['text']}\n")
                print("=" * 60)
            else:
                print("❌ No response from bot")
        else:
            print("❌ No text recognized. Try again.")

if __name__ == "__main__":
    main()