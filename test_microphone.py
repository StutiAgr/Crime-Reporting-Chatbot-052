import speech_recognition as sr

def test_microphone():
    """Test if microphone is working"""
    recognizer = sr.Recognizer()
    
    print("=" * 60)
    print("🎤 MICROPHONE TEST")
    print("=" * 60)
    
    # List available microphones
    print("\n📋 Available microphones:")
    for index, name in enumerate(sr.Microphone.list_microphone_names()):
        print(f"   {index}: {name}")
    
    print("\n" + "=" * 60)
    
    # Test with default microphone
    mic_index = input("\nEnter microphone number to test (or press Enter for default): ").strip()
    
    try:
        if mic_index:
            mic = sr.Microphone(device_index=int(mic_index))
        else:
            mic = sr.Microphone()
            
        with mic as source:
            print("\n🔧 Calibrating for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=3)
            print(f"   Energy threshold set to: {recognizer.energy_threshold}")
            
            print("\n🎤 Say something (like 'hello' or 'testing')...")
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=10)
            
            print("✅ Audio captured successfully!")
            print(f"   Audio duration: ~{len(audio.frame_data) / (audio.sample_rate * audio.sample_width):.2f} seconds")
            
            print("\n🔄 Attempting recognition...")
            
            # Try different languages
            languages = [
                ('en-US', 'English (US)'),
                ('en-IN', 'English (India)'),
                ('en-GB', 'English (UK)'),
            ]
            
            for lang_code, lang_name in languages:
                try:
                    text = recognizer.recognize_google(audio, language=lang_code)
                    print(f"\n✅ SUCCESS with {lang_name}!")
                    print(f"   Recognized text: '{text}'")
                    return
                except sr.UnknownValueError:
                    print(f"   ❌ {lang_name}: Could not understand")
                except sr.RequestError as e:
                    print(f"   ❌ {lang_name}: API error - {e}")
            
            print("\n❌ Could not recognize speech in any language")
            print("\nTroubleshooting tips:")
            print("1. Speak louder and more clearly")
            print("2. Get closer to the microphone")
            print("3. Reduce background noise")
            print("4. Check your internet connection")
            print("5. Try a different microphone")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    test_microphone()