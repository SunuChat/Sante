import torch
import soundfile as sf
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer
import uuid
import os

device = "cuda" if torch.cuda.is_available() else "cpu"
model = ParlerTTSForConditionalGeneration.from_pretrained("CONCREE/Adia_TTS").to(device)
tokenizer = AutoTokenizer.from_pretrained("CONCREE/Adia_TTS")

def generate_speech(text: str) -> str:
    try:
        #voix pro
        #description = "A professional, clear and composed voice, perfect for formal presentations"
        #voix pour éducation
        #description = "A clear and educational voice, with a flow adapted to learning"
         #voix naturelle
        description = "A clear and educational voice, with a flow adapted to learning"
        input_ids = tokenizer(description, return_tensors="pt").input_ids.to(device)
        prompt_ids = tokenizer(text, return_tensors="pt").input_ids.to(device)

        audio = model.generate(
            input_ids=input_ids,
            prompt_input_ids=prompt_ids,
        )

        output_file = f"output_{uuid.uuid4().hex}.wav"
        sf.write(output_file, audio.cpu().numpy().squeeze(), model.config.sampling_rate)

        return output_file

    except Exception as e:
        print(f"Erreur dans generate_speech: {e}")
        return None
