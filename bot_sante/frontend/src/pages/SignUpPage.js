import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4000/signup", {
        email: email,
        password: password,
        firstname: firstName,
        lastname: lastName,
        phone: phoneNumber,
      });
      console.log(response.data);
      navigate("/login");
    } catch (err) {
      console.log("erreur", err);
      setError("L'inscription a échoué.");
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
            width: 420,
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
            Création de compte 🚀
          </Typography>

          <Typography
            variant="body2"
            align="center"
            gutterBottom
            sx={{ color: "#666" }}
          >
            Remplis les champs pour t’inscrire
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Prénom"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Nom"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Téléphone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
            <TextField
              label="Confirmer le mot de passe"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              S'inscrire
            </Button>

            {/* Lien vers la connexion */}
            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, color: "#555" }}
            >
              Tu as déjà un compte ?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/login")}
                sx={{ fontWeight: "bold", color: "#2575fc" }}
              >
                Connecte-toi ici
              </Link>
            </Typography>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
};

export default SignUpPage;
