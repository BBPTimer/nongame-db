import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { DeckContextProvider } from "./contexts/DeckContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <DeckContextProvider>
        <App />
      </DeckContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
