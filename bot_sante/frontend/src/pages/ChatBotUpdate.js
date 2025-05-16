import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  TextField,
  Paper,
  CircularProgress,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import chatbotMascot from "../assets/mascotteSunuchat.png";

function ChatBotPage() {
  const [chat, setChat] = useState([]);
  const [recording, setRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    streamRef.current = stream;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };
    mediaRecorder.onstop = handleSendAudio;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const cancelRecording = () => {
    mediaRecorderRef.current.onstop = null;
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  const handleSendAudio = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
    const localAudioUrl = URL.createObjectURL(audioBlob);
    setChat((prev) => [
      ...prev,
      {
        sender: "user",
        type: "audio",
        audioUrl: localAudioUrl,
        timestamp: new Date(),
      },
    ]);

    const formData = new FormData();
    formData.append("audio", audioBlob);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/chatbot",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
        }
      );
      const botBlob = new Blob([response.data], { type: "audio/wav" });
      const botAudioUrl = URL.createObjectURL(botBlob);
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "audio",
          audioUrl: botAudioUrl,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          message: "Erreur lors de la réponse.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = async () => {
    if (!userInput.trim()) return;
    const newMessage = {
      sender: "user",
      type: "text",
      message: userInput.trim(),
      timestamp: new Date(),
    };
    setChat((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/chatbotext", {
        text: newMessage.message,
      });
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          message: response.data.reponse,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          message: "Erreur lors de la réponse.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (entry, index) => (
    <CSSTransition key={index} timeout={300} classNames="fade">
      <Box
        sx={{
          display: "flex",
          flexDirection: entry.sender === "user" ? "row-reverse" : "row",
          gap: 2,
          mb: 2,
          alignItems: "flex-end",
          position: "relative",
          "&:hover .bubble": {
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            transform: "scale(1.01)",
          },
        }}
      >
        <Avatar src={entry.sender === "user" ? undefined : chatbotMascot} />
        <Paper
          elevation={3}
          className="bubble"
          sx={{
            position: "relative",
            p: 2,
            borderRadius: "18px",
            backgroundColor: entry.sender === "user" ? "#cfe8ff" : "#defade",
            maxWidth: "75%",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 10,
              width: 0,
              height: 0,
              border: "8px solid transparent",
              [entry.sender === "user" ? "right" : "left"]: "-16px",
              borderRightColor:
                entry.sender === "user" ? "#cfe8ff" : "transparent",
              borderLeftColor:
                entry.sender !== "user" ? "#defade" : "transparent",
            },
          }}
        >
          <Tooltip
            title={new Date(entry.timestamp).toLocaleTimeString()}
            arrow
            placement={entry.sender === "user" ? "left" : "right"}
          >
            <Box>
              {entry.type === "text" ? (
                <Typography fontSize="16px" lineHeight={1.6}>
                  {entry.message}
                </Typography>
              ) : (
                <Box sx={{ width: "200px" }}>
                  <audio
                    controls
                    src={entry.audioUrl}
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>
          </Tooltip>
        </Paper>
      </Box>
    </CSSTransition>
  );

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1500&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          height: "95vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            textAlign: "center",
            py: 3,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#f9fbfc",
          }}
        >
          <Avatar
            src={chatbotMascot}
            sx={{ width: 72, height: 72, mx: "auto", mb: 1 }}
          />
          <Typography variant="h5" fontWeight={800} color="primary">
            SunuChat
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Assistant vocal intelligent multilingue 🌍
          </Typography>
        </Box>

        {/* CHAT AREA */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 2,
            backgroundColor: "#fff",
          }}
        >
          <TransitionGroup>{chat.map(renderMessage)}</TransitionGroup>
          <div ref={messagesEndRef} />
        </Box>

        {/* INPUT AREA */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <TextField
            fullWidth
            placeholder="Écrivez un message..."
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            disabled={isLoading || recording}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ gap: 1 }}>
                  <Tooltip title={recording ? "Arrêter" : "Parler"}>
                    <IconButton
                      onClick={recording ? stopRecording : startRecording}
                      disabled={isLoading}
                      sx={{
                        animation: recording ? "pulse 2s infinite" : "none",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.2)",
                        },
                      }}
                    >
                      {recording ? (
                        <StopIcon color="error" />
                      ) : (
                        <MicIcon color="primary" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Envoyer">
                    <IconButton
                      onClick={handleSendText}
                      disabled={isLoading || !userInput.trim() || recording}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <SendIcon color="primary" />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          {recording && (
            <Box
              sx={{
                mt: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography color="error" fontWeight={600}>
                🎙️ Enregistrement en cours...
              </Typography>
              <Button
                onClick={cancelRecording}
                startIcon={<CloseIcon />}
                color="error"
                size="small"
              >
                Annuler
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(25, 118, 210, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25, 118, 210, 0); }
          }

          .fade-enter {
            opacity: 0.01;
            transform: translateY(20px);
          }

          .fade-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: all 300ms ease-in;
          }
        `}
      </style>
    </Box>
  );
}

export default ChatBotPage;
