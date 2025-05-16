import json
import requests
import datetime
from traduction_fr_wo import translate_fr_wo
from traduction_wo_fr import translate_wo_fr
#from main import communication_endpoint
from asr import transcribe_audio
import torchaudio
import tempfile
import os
from tts import generate_speech
from fastapi.responses import StreamingResponse
from pydub import AudioSegment
from rag import ask_kb
import subprocess



class ultraChatBot():    
    def __init__(self, json):
        self.json = json
        self.dict_messages = json['data']
        self.ultraAPIUrl = 'https://api.ultramsg.com/instance119982/'
        self.token = 'i7sdv77w4rdpojq1'

   
    def send_requests(self, type, data):
        try:
            # Créer l'URL
            url = f"{self.ultraAPIUrl}{type}?token={self.token}"
            
            # Définir les headers
            headers = {'Content-type': 'application/json'}
            
            # Effectuer la requête POST
            response = requests.post(url, data=json.dumps(data), headers=headers)
            
            # Vérifier le code de statut de la réponse
            response.raise_for_status()  # Lève une exception pour les codes d'erreur HTTP (400, 500, etc.)
            
            # Retourner la réponse en JSON
            return response.json()
        
        except requests.exceptions.HTTPError as http_err:
            # Gestion des erreurs HTTP (ex. 404, 500, etc.)
            print(f"Erreur HTTP: {http_err}")
            return {"error": "Erreur HTTP", "details": str(http_err)}
        
        except requests.exceptions.RequestException as req_err:
            # Gestion des autres erreurs de requête (timeout, etc.)
            print(f"Erreur de requête: {req_err}")
            return {"error": "Erreur de requête", "details": str(req_err)}
        
        except json.JSONDecodeError as json_err:
            # Gestion des erreurs liées au parsing JSON
            print(f"Erreur de parsing JSON: {json_err}")
            return {"error": "Erreur de parsing JSON", "details": str(json_err)}
        
        except Exception as err:
            # Gestion de toutes autres erreurs inattendues
            print(f"Erreur inattendue: {err}")
            return {"error": "Erreur inattendue", "details": str(err)}

    def send_message(self, chatID, text):
        data = {"to" : chatID,
                "body" : text}  
        answer = self.send_requests('messages/chat', data)
        return answer

    def send_image(self, chatID):
        data = {"to" : chatID,
                "image" : "https://file-example.s3-accelerate.amazonaws.com/images/test.jpeg"}  
        answer = self.send_requests('messages/image', data)
        return answer

    def send_video(self, chatID):
        data = {"to" : chatID,
                "video" : "https://file-example.s3-accelerate.amazonaws.com/video/test.mp4"}  
        answer = self.send_requests('messages/video', data)
        return answer

    def send_audio(self, chatID):
        data = {"to" : chatID,
                "audio" : "https://file-example.s3-accelerate.amazonaws.com/audio/2.mp3"}  
        answer = self.send_requests('messages/audio', data)
        return answer


    def send_voice(self, chatID, audioPath):
        data = {"to" : chatID,
                "audio" :audioPath}  
        answer = self.send_requests('messages/voice', data)
        print("Réponse de l'API :", answer)
        return answer
    def send_voice2(self, chatID,audio):
        data = {"to" : chatID,
                "audio" : audio}  
        answer = self.send_requests('messages/voice', data)
        print("Réponse de l'API :", answer)
        return answer

    def send_contact(self, chatID):
        data = {"to" : chatID,
                "contact" : "14000000001@c.us"}  
        answer = self.send_requests('messages/contact', data)
        return answer
    def send_translation(self, chatID, translation):
        data = {"to" : chatID,
                "body" : translation}  
        answer = self.send_requests('messages/chat', data)
        return answer
    def send_document(self, chatID, docUrl):
        try:
            # Télécharger le fichier audio depuis l'URL
            response = requests.get(docUrl)
            
            # Vérifier si le téléchargement est réussi
            if response.status_code == 200:
                # Créer un fichier temporaire pour stocker l'audio
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
                    temp_audio.write(response.content)
                    temp_audio_path = temp_audio.name

                # Transcrire le fichier audio
                transcription = transcribe_audio(temp_audio_path)
                print('Transcription:', transcription)

                # Supprimer le fichier temporaire après transcription
                os.remove(temp_audio_path)
                translation = translate_wo_fr(transcription)
            else:
                transcription = "Erreur lors du téléchargement du fichier audio"

            # Envoyer la transcription en tant que message
            data = {"to": chatID, "body": translation}
            answer = self.send_requests('messages/chat', data)
            return answer
        
        except Exception as e:
            print(f"Erreur lors de l'envoi du document: {e}")
            return {"error": "Erreur lors de l'envoi du document", "details": str(e)}
    def generate(text):
    
        
        audio_buffer = generate_speech(text)
        return StreamingResponse(audio_buffer, media_type="audio/wav", headers={"Content-Disposition": "attachment; filename=output.wav"})
      

    def time(self, chatID):
        t = datetime.datetime.now()
        time = t.strftime('%Y-%m-%d %H:%M:%S')
        return self.send_message(chatID, time)


    def welcome(self,chatID, noWelcome = False):
        welcome_string = ''
        if (noWelcome == False):
            welcome_string = "Bienvenue à Sunuchat"
        else:
            welcome_string = """wrong command
Please type one of these commands:
*hi* : Saluting
*time* : show server time
*image* : I will send you a picture
*video* : I will send you a Video
*audio* : I will send you a audio file
*voice* : I will send you a ppt audio recording
*contact* : I will send you a contact
"""
        return self.send_message(chatID, welcome_string)
    
    def get_direct_download_url(self, view_url: str) -> str:
        """
        Transforme un lien HTML de tmpfiles.org en lien direct de téléchargement.
        """
        if "/dl/" in view_url:
            return view_url  # C'est déjà un lien direct
        parts = view_url.split('/')
        if len(parts) >= 5:
            return f"https://tmpfiles.org/dl/{parts[3]}/{parts[4]}"
        else:
            raise ValueError("Lien tmpfiles invalide")


    def convert_to_ogg(self, input_path):
        output_path = os.path.splitext(input_path)[0] + ".ogg"

        try:
            # Utilisation explicite de libopus
            subprocess.run([
                "ffmpeg",
                "-i", input_path,
                "-c:a", "libopus",
                "-b:a", "64k",
                output_path
            ], check=True)
            return output_path
        except subprocess.CalledProcessError as e:
            print("Erreur de conversion avec ffmpeg :", e)
            return None

    def upload_audio(self, file_path):
        # 🔁 Convertir le fichier en .ogg avant l'upload
        ogg_path = self.convert_to_ogg(file_path)

        with open(ogg_path, 'rb') as f:
            files = {'file': f}
            response = requests.post('https://tmpfiles.org/api/v1/upload', files=files)

        print("Code:", response.status_code)
        print("Texte brut:", response.text)

        if response.status_code == 200:
            data = response.json()
            print('data', data['data']['url'].replace("tmpfiles.org/", "tmpfiles.org/dl/"))

            # Nettoyage du fichier .ogg temporaire si besoin
            os.remove(ogg_path)

            return self.get_direct_download_url(data['data']['url'].replace("tmpfiles.org/", "tmpfiles.org/dl/"))
        else:
            os.remove(ogg_path)
            raise Exception("Échec de l'upload")


    def Processingـincomingـmessages(self):
        if self.dict_messages != []:
            message =self.dict_messages
            print("Message", message)
            print("Self",self)
            text = message['body'].split()
            
            if not message['fromMe']:
                chatID  = message['from'] 
                """
                if text and text[0].lower() == 'hi':
                    return self.welcome(chatID)
                elif text and text[0].lower() == 'time':
                    return self.time(chatID)
                elif text and text[0].lower() == 'image':
                    return self.send_image(chatID)
                elif text and text[0].lower() == 'video':
                    return self.send_video(chatID)
                elif text and text[0].lower() == 'audio':
                    return self.send_audio(chatID)
                
                elif  text and text[0].lower() == 'voice':
                    return self.send_voice(chatID, "https://file-example.s3-accelerate.amazonaws.com/voice/oog_example.ogg")
                elif text and text[0].lower() == 'contact':
                    return self.send_contact(chatID)
                elif text and text[0].lower() == 'tradfr':
                    translation = translate_wo_fr(message['body'].replace("tradfr ", "", 1))
                    return self.send_translation(chatID,translation )
                elif text and text[0].lower() == 'tts':
                    audio = transcribe_audio(message['body'].replace("tts ", "", 1))
                    return self.send_voice2(chatID, audio)
                elif text and text[0].lower() == 'tradwo':
                    translation = translate_wo_fr(message['body'].replace("tradwo ", "", 1))
                    return self.send_translation(chatID,translation )
                
                elif message['type'] == 'document' :
                    fileUrl = message['media']
                    return self.send_document(chatID, fileUrl)
                """
                
                if message['type'] == 'chat' :
                    print("texte :", text)
                    reponse_rag, sources = ask_kb(message['body'])
                    return self.send_message(chatID, reponse_rag)
                    
                elif message['type'] == 'ptt' :
                    
                    audio = requests.get(message['media'])
                    print('audio :', audio)
                    
                        
                    audio_bytes = audio.content
                    temp_audio_path = "temp_audio.ogg"  # ou .mp3 selon le format
                    with open(temp_audio_path, "wb") as f:
                        f.write(audio_bytes)
                    audio_segment = AudioSegment.from_file(temp_audio_path)
                    audio_duration_sec = len(audio_segment) / 1000  # Durée en ms → secondes
                    os.remove(temp_audio_path)

                    transcription = transcribe_audio(audio_bytes)
                    print('transcription : ', transcription)
                    # 🔁 Traduction de la transcription du wolof vers le français
                    traduction = translate_wo_fr(transcription)
                    print('Traduction :', traduction)

                    # 🤖 Question posée au modèle RAG à partir du texte français
                    reponse_rag, sources = ask_kb(traduction)
                    print('réponse rag : ', reponse_rag)

                    # 🔁 Traduction de la réponse du modèle du français vers le wolof
                    reponse_finale = translate_fr_wo(reponse_rag)
                    print("Réponse finale :", reponse_finale)
                    output_audio_path = generate_speech(reponse_finale)
                    with open(output_audio_path, "rb") as f:
                        returnedAudio_bytes = f.read() 
                    print("output audio :", output_audio_path)  
                        
                    

                    uploaded_audio_url = self.upload_audio(output_audio_path)
                    
                    return self.send_voice(chatID,uploaded_audio_url)

                
                else:
                    print("Message", message)
                    return self.welcome(chatID, True)
                
                    
            else: return 'NoCommand'