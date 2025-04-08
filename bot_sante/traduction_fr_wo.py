from transformers import pipeline
from dotenv import load_dotenv
import os

load_dotenv()
token = os.getenv("HG_TOKEN")

pipe = pipeline("text2text-generation", model="AYI-TEKK/translate-fr-wo-v2", token=token)

def translate_fr_wo(text):
    result = pipe(text)
    return result[0]['generated_text']
