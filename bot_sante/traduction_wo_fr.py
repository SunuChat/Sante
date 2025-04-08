from dotenv import load_dotenv
import os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Charger les variables d'environnement
load_dotenv()
token = os.getenv("HG_TOKEN")

# Charger le tokenizer et le modèle de traduction
tokenizer = AutoTokenizer.from_pretrained("AYI-TEKK/m2m100_wo_fr_1", token=token)
model = AutoModelForSeq2SeqLM.from_pretrained("AYI-TEKK/m2m100_wo_fr_1", token=token)

def translate_wo_fr(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    translated = model.generate(**inputs)
    translated_text = tokenizer.decode(translated[0], skip_special_tokens=True)
    return translated_text
