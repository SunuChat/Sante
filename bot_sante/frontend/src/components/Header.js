import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { keyframes } from "@emotion/react";
import logo from "../assets/logoSunuchat.png";

// Définir l'animation de dégradé
const gradientAnimation = keyframes`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`;

const Header = () => {
    return (
        <AppBar
            position="static"
            sx={{
                background: "linear-gradient(270deg, #4caf50, #03a9f4, #606060 )", // Couleurs dégradées
                backgroundSize: "400% 400%", // Nécessaire pour l'animation fluide
                animation: `${gradientAnimation} 8s ease infinite`, // Appliquer l'animation
                boxShadow: "none",
            }}
        >
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {/*<img
                        height="70px"
                        src={logo}
                        alt="SunuChat Logo"
                        style={{ marginRight: "10px" }}
                    />*/}
                </Typography>
                <Box>
                    <Button
                        sx={{
                            color: "#ffffff",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#03a9f4",
                                color: "#ffffff",
                            },
                            fontFamily: "Poppins"
                        }}
                        href="/"
                    >
                        Accueil
                    </Button>
                    <Button
                        sx={{
                            color: "#ffffff",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#4caf50",
                                color: "#ffffff",
                            },
                            fontFamily: "Poppins"
                        }}
                        href="/chat"
                    >
                        Chat
                    </Button>
                    <Button
                        sx={{
                            color: "#ffffff",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "#03a9f4",
                                color: "#ffffff",
                            },
                            fontFamily: "Poppins"
                        }}
                        href="/about"
                    >
                        À propos
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
