import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Slide } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import MicIcon from "@mui/icons-material/Mic";
import Header from "../components/Header";
import chatbotMascot from "../assets/mascotteSunuchat.png";
import axios from "axios";

const WelcomeAnim1 = () => (
  <Box height={"200px"}>
    <DotLottieReact
      src="https://lottie.host/7421ef45-db15-4822-91c2-6d753c732e14/dN40dVw0jE.lottie"
      loop
      autoplay
    />
  </Box>
);

const RecordingAnim = () => (
  <DotLottieReact
    src="https://lottie.host/58d2c46a-716a-4902-b310-a0a10bd11628/hAm1qDLX4Z.lottie"
    loop
    autoplay
  />
);
function ChatBotPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("demo");
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const messagesEndRef = useRef(null); // Ref pour le conteneur des messages
  // Fonction pour défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // Effet pour défiler automatiquement à chaque ajout de message
  useEffect(() => {
    scrollToBottom();
  }, [chat]);
  function isValidURL(text) {
    const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(text);
  }
  // Fonction pour envoyer un message au backend FastAPI
  const sendMessage = async () => {
    if (!audioFile) {
      alert("Veuillez sélectionner un fichier audio.");
      return;
    }
    console.log("audio", audioFile);
    setChat((prevChat) => [
      ...prevChat,
      {
        sender: "Vous ",
        message: "Audio envoyé",
        type: "audio",
        audioUrl: "",
      },
    ]);
    const formData = new FormData();
    formData.append("audio", audioFile);
    console.log("formData", formData);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/chatbot",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      // Créer un URL local pour le fichier reçu
      const audioBlob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioFile(audioBlob);
      setAudioUrl(audioUrl);
      // Ajouter dans le chat un message avec ce nouvel audio
      setChat((prevChat) => [
        ...prevChat,
        {
          sender: "Sunuchat ",
          message: "", // pas besoin de texte ici
          type: "audio",
          audioUrl: audioUrl, // on stocke le lien
        },
      ]);

      console.log("responsdhkdqkhqde", response);
    } catch (error) {
      console.error("Erreur:", error);
      setChat((prevChat) => [
        ...prevChat,
        { sender: "Sunuchat ", message: "Erreur lors de la transcription." },
      ]);
    } finally {
      setIsLoading(false);
      setAudioFile(null); // Réinitialiser audioFile après l'envoi
    }
  };
  // Gestion de l'entrée vocale

  const handleFileChange = (event) => {
    console.log("bachir", event.target.files);
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };
  const { transcript, listening } = useSpeechRecognition();

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "fr-FR" });
  };
  const stopListening = () => {
    SpeechRecognition.stopListening();
  };
  const handlePlayPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };
  useEffect(() => {
    if (mode === "demo") setMessage(transcript);
  }, [transcript, mode]);
  return (
    <Box>
      <Header />
      <Container
        sx={{ padding: "20px", marginTop: 4, height: "auto" }}
        height={"70%"}
      >
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper elevation={3} sx={{ padding: 4, borderRadius: 3 }}>
            <Box sx={{ textAlign: "center", marginBottom: 3 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                fontFamily={"Nunito"}
                gutterBottom
              >
                SunuChat
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="Poppins"
              >
                Discute avec Sunuchat !
              </Typography>
            </Box>

            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                padding: 2,
                minHeight: "300px",
                maxHeight: "400px",
                overflowY: "auto",
                backgroundColor: "#f1faff",
                marginBottom: 3,
              }}
            >
              {chat.length == 0 && <WelcomeAnim1 />}
              <TransitionGroup>
                {chat.map((entry, index) => (
                  <CSSTransition key={index} timeout={300} classNames="message">
                    <Box
                      sx={{
                        marginBottom: 2,
                        textAlign: entry.sender === "Vous " ? "right" : "left",
                      }}
                    >
                      <Box>
                        {entry.sender === "Sunuchat " && (
                          <div>
                            <img
                              src={chatbotMascot}
                              alt="chatbot icon"
                              height={"50px"}
                            />
                          </div>
                        )}
                        {entry.type === "text" ? (
                          <Typography
                            variant="body1"
                            sx={{
                              display: "inline-block",
                              padding: 1.5,
                              borderRadius: "25px",
                              backgroundColor:
                                entry.sender === "Vous "
                                  ? "#1E90FF"
                                  : "#28A745",
                              color: "#fff",
                              fontFamily: "Poppins",
                            }}
                          >
                            {entry.message}
                          </Typography>
                        ) : (
                          <audio controls>
                            <source src={audioUrl} type={audioFile?.type} />
                            Votre navigateur ne supporte pas l'élément audio.
                          </audio>
                        )}
                      </Box>
                    </Box>
                  </CSSTransition>
                ))}
              </TransitionGroup>
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ marginBottom: 2 }}>
              <input type="file" accept="audio/*" onChange={handleFileChange} />
              {audio && (
                <button onClick={() => audio.play()}>Play Audio</button>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {mode !== "transcription" && mode !== "communication" && (
                <TextField
                  fullWidth
                  placeholder="Ton message à SunuChat"
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 1,
                  }}
                />
              )}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1E90FF",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#007ACC" },
                  fontFamily: "Poppins",
                  padding: "25px",
                }}
                onClick={sendMessage}
                disabled={isLoading}
              >
                Envoyer
              </Button>

              {mode === "demo" && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: listening ? "#28A745" : "#1E90FF",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: listening ? "#218838" : "#007ACC",
                    },
                  }}
                  onClick={listening ? stopListening : startListening}
                >
                  {listening ? <RecordingAnim /> : <MicIcon />}
                </Button>
              )}
            </Box>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
}

export default ChatBotPage;
