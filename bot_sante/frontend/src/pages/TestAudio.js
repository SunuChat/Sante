import React, { useState } from "react";
import axios from "axios";

const TestAudio = () => {
    const [text, setText] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);

    const handleGenerateSpeech = async () => {
        if (!text) return alert("Veuillez entrer du texte");

        try {
            const response = await axios.post(
                "http://localhost:8000/generateSpeech",
                { text },
                { responseType: "blob" } // Important pour récupérer le blob audio
            );

            const blob = response.data;
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (error) {
            console.error("Erreur :", error);
            alert("Impossible de générer l'audio.");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Entrez du texte"
            />
            <button onClick={handleGenerateSpeech}>Générer et Jouer</button>
            {audioUrl && (
                <audio controls autoPlay>
                    <source src={audioUrl} type="audio/wav" />
                    Votre navigateur ne supporte pas l'élément audio.
                </audio>
            )}
        </div>
    );
};

export default TestAudio;
