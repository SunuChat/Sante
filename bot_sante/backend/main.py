from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from tts import generate_speech
from traduction_wo_fr import translate_wo_fr
from asr import transcribe_audio
from rag import ask_kb
from traduction_fr_wo import translate_fr_wo
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

@app.post("/chatbot")
async def chatbot(audio: UploadFile = File(...)):
    try:
        audio_bytes = await audio.read()
        transcription = transcribe_audio(audio_bytes)
        traduction = translate_wo_fr(transcription)
        reponse_rag, sources = ask_kb(traduction)
        reponse_finale = translate_fr_wo(reponse_rag)

        # Génération de la synthèse vocale
        audio = generate_speech(reponse_finale)

        audio_path = generate_speech(reponse_finale)

        if not audio_path:
            raise HTTPException(status_code=500, detail="Erreur lors de la génération de la synthèse vocale")

        return FileResponse(audio_path, media_type="audio/wav", headers={"Content-Disposition": "attachment; filename=generated_speech.wav"})

        """ return JSONResponse(content={
            "transcription_wolof": transcription,
            "traduction_francais": traduction,
            "reponse_rag": reponse_rag,
            "reponse_trad_wolof": reponse_finale, 
            # "sources": [src.page_content for src in sources]
        }) """

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=4000)