from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from tts import generate_speech
from traduction_wo_fr import translate_wo_fr
from asr import transcribe_audio
from rag import ask_kb
from traduction_fr_wo import translate_fr_wo
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from db import users_collection
from models import UserCreate, UserLogin
from auth import hash_password, verify_password, create_access_token
from bson import ObjectId
from datetime import datetime



app = FastAPI()

@app.post("/signup")
async def signup(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    user_data = user.dict()
    user_data["password"] = hash_password(user.password)
    user_data["signup_date"] = datetime.utcnow()
    user_data["settings"] = {"notifications_enabled": True}

    result = await users_collection.insert_one(user_data)
    user_id = str(result.inserted_id)

    return {"message": "Utilisateur inscrit avec succès", "user_id": user_id}


@app.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Identifiants invalides")

    token = create_access_token(data={"user_id": str(db_user["_id"])})
    return {"access_token": token, "token_type": "bearer"}

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