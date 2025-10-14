import { use, useRef, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import { shuffle } from "./common/utils";
import Header from "./components/Header";
import Instructions from "./components/Instructions";
import Main from "./components/Main";
import CustomDeck from "./components/Main/CustomDeck";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import { AuthContext } from "./contexts/AuthContext";
import { GameContext } from "./contexts/GameContext";

function App() {
  const { auth } = use(AuthContext);

  // Initialize state variables
  const [isNewGame, setIsNewGame] = useState(true);
  const [promptTypes, setPromptTypes] = useState({});
  const [players, setPlayers] = useState([]);
  const [numberOfPlayers, setNumberOfPlayers] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState();
  const [isGameComplete, setIsGameComplete] = useState();
  const [prompts, setPrompts] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [roll, setRoll] = useState(null);
  const [activeSpace, setActiveSpace] = useState(null);
  const [totalTurns, setTotalTurns] = useState(null);

  const unusedPrompts = useRef([]);
  const feelings = useRef([]);

  // Initialize new game
  const initializeGame = () => {
    // Define Player class
    class Player {
      constructor(id, name, emoji) {
        this.id = id;
        this.isActive = false;
        this.name = name;
        this.emoji = emoji;
        this.sumOfRolls = 0;
        this.space = 0;
        this.laps = 0;
      }
    }

    // Define emojis
    const emojis = ["🐻", "🐲", "🦊", "🐸", "🦁", "🐵"];
    // Randomize emoji order
    shuffle(emojis);

    // Create empty array to store Player objects
    let playersArray = [];

    // Populate players array
    for (let i = 0; i < 6; i++) {
      playersArray.push(new Player(i + 1, "Player " + (i + 1), emojis[i]));
    }

    // Set Player 1 to active
    playersArray[0].isActive = true;

    // Initialize state variables with default values
    setIsNewGame(false);
    setPromptTypes({
      feelings: true,
      questionComment: true,
    });
    setPlayers(playersArray);
    setNumberOfPlayers(1);
    setIsSetupComplete(false);
    setIsGameComplete(false);
    // Set default LS deck
    if (!localStorage.getItem("deck")) {
      localStorage.setItem("deck", 1);
    }
    setPrompts([]);
    setPrompt("");
    setRoll(1);
    setActiveSpace(0);
    setTotalTurns(0);
  };

  // Call newGame function if isNewGame is true
  isNewGame && initializeGame();

  return (
    <GameContext.Provider
      value={{
        isNewGame,
        setIsNewGame,
        promptTypes,
        setPromptTypes,
        players,
        setPlayers,
        numberOfPlayers,
        setNumberOfPlayers,
        isSetupComplete,
        setIsSetupComplete,
        isGameComplete,
        setIsGameComplete,
        prompts,
        setPrompts,
        prompt,
        setPrompt,
        roll,
        setRoll,
        activeSpace,
        setActiveSpace,
        totalTurns,
        setTotalTurns,
        unusedPrompts,
        feelings,
      }}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          {auth.isAuthenticated && (
            <Route path="/custom" element={<CustomDeck />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <br />
      <footer className="white-bg gray-hover">
        &copy; {new Date().getFullYear()} Greg Weseloh LLC
      </footer>
    </GameContext.Provider>
  );
}

export default App;
