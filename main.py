import sounddevice as sd
import wavio
from whisper import transcribe
import whisper

# Define recording parameters
duration = 5  # Recording duration in seconds
fs = 44100  # Sampling rate
filename = "my_recording.wav"

# Record audio
def record_audio():
  print("Recording...")
  myrecording = sd.rec(int(duration * fs), samplerate=fs, channels=2)
  sd.wait()
  print("Recording finished!")
  return myrecording

# Convert recording to WAV format and save
def save_to_wav(audio, filename):
  wavio.write(filename, audio, fs, sampwidth=2)  # 2 for 16-bit audio

# Load and transcribe audio using Whisper
def transcribe_audio(filename):
  model = whisper.load_model("base")  # Choose a Whisper model (base, small, etc.)
  text = model.transcribe(filename)
  return text

# Main program flow
recording = record_audio()
save_to_wav(recording, filename)
text = transcribe_audio(filename)

print(f"Transcribed text: {text}")


# import pyttsx3

# engine = pyttsx3.init('sapi5')  # Use 'sapi5' as the default engine
# voices = engine.getProperty('voices')
# engine.setProperty('voice', voices[1].id)  # Index 1 corresponds to Flite voice
# text = "Zerostat is taken twice a day"
# engine.say(text)
# engine.runAndWait()
