from pydub import AudioSegment
from io import BytesIO
import torch
from transformers import pipeline
from dotenv import load_dotenv
import os

load_dotenv()
token = os.getenv("HG_TOKEN")

model_id = "AYI-TEKK/asr-v2"
device = 0 if torch.cuda.is_available() else -1
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

pipe = pipeline(
    task="automatic-speech-recognition",
    model=model_id,
    processor=model_id,
    device=device,
    torch_dtype=torch_dtype,
    framework="pt",
    token=token
)

def convert_audio_to_mono(audio_bytes):
    audio = AudioSegment.from_file(BytesIO(audio_bytes))  
    audio = audio.set_channels(1).set_frame_rate(16000) 
    buffer = BytesIO()
    audio.export(buffer, format="wav")  
    return buffer.getvalue()

def transcribe_audio(audio_bytes):
    mono_audio = convert_audio_to_mono(audio_bytes) 
    result = pipe(mono_audio)
    return result['text']
