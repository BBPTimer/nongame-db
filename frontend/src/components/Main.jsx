import { use } from "react";
import { GameContext } from "../contexts/GameContext";
import Setup from "./Main/Setup";
import Play from "./Main/Play";
import Results from "./Main/Results";

const Main = () => {
  const { isSetupComplete, isGameComplete } = use(GameContext);

  if (!isSetupComplete) {
    return <Setup />;
  } else if (isGameComplete) {
    return <Results />;
  } else {
    return <Play />;
  }
};

export default Main;
