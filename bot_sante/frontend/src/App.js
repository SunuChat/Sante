import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatBotPage from "./pages/NewChatBotPage";
import TestAudio from "./pages/TestAudio";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatBotPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/test" element={<TestAudio />} />
      </Routes>
    </Router>
  );
}

export default App;
