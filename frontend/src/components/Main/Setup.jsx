import { use, useState } from "react";
import { GameContext } from "../../contexts/GameContext";
import { DeckContext } from "../../contexts/DeckContext";
import Modal from "../common/Modal";
import PlayerForms from "./Setup/PlayerForms";
import NewGameButton from "../common/NewGameButton";
import { shuffle } from "../../common/utils";

const Setup = () => {
  const {
    promptTypes,
    setPromptTypes,
    players,
    setPlayers,
    numberOfPlayers,
    setNumberOfPlayers,
    setIsSetupComplete,
  } = use(GameContext);

  const { allDecks, selectedDeckId, setSelectedDeckId } = use(DeckContext);

  // useState to re-render Modal component when deck changes
  const [promptModalText, setPromptModalText] = useState("");

  // Function to get modal content
  const getPromptModalText = () => {
    // Early return if no decks
    if (allDecks.length === 0) {
      return;
    }

    let promptsArray = [];
    // Find deck in allDecks whose Id matches selectedDeckId, loop through prompts and push to promptsArray
    for (let prompt of allDecks.find((deck) => deck.id == selectedDeckId)
      .prompts) {
      promptsArray.push(prompt.promptText);
    }
    
    // Join promptsArray into single string with new line between elements
    setPromptModalText(promptsArray.join("\n"));
  };

  const handleNumberOfPlayersChange = (event) => {
    // Update number of players state
    setNumberOfPlayers(event.target.value);

    // Update players array with active players
    setPlayers(
      players.map((player) =>
        player.id - 1 < event.target.value
          ? { ...player, isActive: true }
          : { ...player, isActive: false, name: "Player " + player.id }
      )
    );
  };

  // Render deck options
  const deckOptions = allDecks.map((deck) => {
    return (
      // Return option only if deck contains at least 1 prompt
      deck.prompts.length && (
        <option key={deck.id} value={deck.id}>
          {deck.deckName}
        </option>
      )
    );
  });

  const handleDeckChange = (event) => {
    setSelectedDeckId(event.target.value);
    localStorage.setItem("deck", event.target.value);
  };

  // Render number of player options
  const numberOfPlayerOptions = [];
  for (let i = 1; i <= 6; i++) {
    numberOfPlayerOptions.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  const handleSubmit = (event) => {
    // Prevent page reload
    event.preventDefault();

    // Pass only active players to Play component, and shuffle the array
    setPlayers(shuffle(players.filter((player) => player.isActive)));

    setIsSetupComplete(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1>Game Setup</h1>{" "}
        <Modal
          modalContent={
            <>
              <p>
                Welcome to The Nongame!, a conversation game! "Compete" to
                complete laps around the board by answering prompts.
              </p>
              <p>
                The game begins with this Setup form. First, choose which
                prompts you would like to appear in the game. Click the info
                icon to preview prompts from the selected deck. Next, select
                your number of players, and type in their names! Click the Play!
                button to begin the game.
              </p>
              <p>
                <i>
                  Tip: if you have more than 6 players, we recommend choosing 1
                  player and competing as a group to complete laps around the
                  board.
                </i>
              </p>
              <p>
                The first player will begin the game by clicking the dice. That
                player's emoji pawn moves to the appropriate space, and a prompt
                appears in the center of the board. Other players should remain
                quiet when a player responds to a prompt! After a player
                responds, the next player rolls the dice, and play continues.
              </p>
              <p>
                As players make their way around the board, each player's lap
                counter will increase. 45 minutes to 1 hour makes for a great
                game length. See which player completes the most laps by the end
                of the game!
              </p>
            </>
          }
        />
        <div className="white-bg gray-hover">
          <label htmlFor="deck">Prompt deck: </label>
          <select
            name="deck"
            value={selectedDeckId}
            onChange={handleDeckChange}
            required
          >
            {deckOptions}
          </select>{" "}
          <Modal
            modalContent={promptModalText}
            modalFunction={getPromptModalText}
          />
        </div>
        <br />
        <div className="white-bg gray-hover">
          <label>Prompt types: </label>
          <input type="checkbox" id="deck" checked disabled />
          <label htmlFor="deck">
            <span
              className="material-symbols-outlined"
              style={{ color: "LightSkyBlue" }}
            >
              playing_cards
            </span>
          </label>{" "}
          <input
            type="checkbox"
            id="questionComment"
            checked={promptTypes.questionComment}
            onChange={() =>
              setPromptTypes({
                ...promptTypes,
                questionComment: !promptTypes.questionComment,
              })
            }
          />
          <label htmlFor="questionComment">
            <span
              className="material-symbols-outlined"
              style={{ color: "LightGreen" }}
            >
              question_exchange
            </span>
          </label>{" "}
          <input
            type="checkbox"
            id="feelings"
            checked={promptTypes.feelings}
            onChange={() =>
              setPromptTypes({
                ...promptTypes,
                feelings: !promptTypes.feelings,
              })
            }
          />
          <label htmlFor="feelings">
            <span
              className="material-symbols-outlined"
              style={{ color: "LightPink" }}
            >
              comedy_mask
            </span>
          </label>{" "}
          <Modal
            modalContent={
              <ol>
                <li>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "LightSkyBlue" }}
                  >
                    playing_cards
                  </span>
                  : A random prompt is displayed from the previously-selected
                  prompt deck.
                </li>
                <br />
                <li>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "LightGreen" }}
                  >
                    question_exchange
                  </span>
                  : Ask someone a question OR comment on any subject. This gives
                  players an opportunity to engage with each other and discuss
                  whatever's on the mind!
                </li>
                <br />
                <li>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "LightPink" }}
                  >
                    comedy_mask
                  </span>
                  : Players will talk about a time when they felt a certain
                  emotion.
                </li>
              </ol>
            }
          />
        </div>
        <br />
        <div className="white-bg gray-hover">
          <label htmlFor="numberOfPlayers"># of players: </label>
          <select
            name="numberOfPlayers"
            onChange={handleNumberOfPlayersChange}
            value={numberOfPlayers}
            required
          >
            {numberOfPlayerOptions}
          </select>
        </div>
        <br />
        <div id="player-forms" className="white-bg gray-hover">
          <PlayerForms />
        </div>
        <br />
        <button className="pulsate">Play!</button>
        <NewGameButton buttonText="Reset" />
      </form>
    </>
  );
};

export default Setup;
