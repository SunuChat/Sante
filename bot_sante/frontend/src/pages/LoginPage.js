import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username: email,
        password: password,
      });
      console.log(response.data);
      navigate("/");
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1500&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Fade in timeout={600}>
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            width: 350,
            borderRadius: 3,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Bienvenue 👋
          </Typography>

          <Typography
            variant="body2"
            align="center"
            gutterBottom
            sx={{ color: "#666" }}
          >
            Connecte-toi pour accéder à ton espace
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "16px",
                borderRadius: "10px",
                padding: "10px 0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                ":hover": {
                  background: "linear-gradient(to right, #5c0ed1, #1d60f4)",
                },
              }}
            >
              Se connecter
            </Button>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;
