import { useEffect, useRef, useState } from "react";
import Deck from "../../../classes/Deck";
import Modal from "../../common/Modal";
import { readFormData } from "../../../common/utils";

const CustomDeck = () => {
  const [selectedUser, setSelectedUser] = useState(1);

  // Utility functions
  const closeOtherForms = (callback) => {
    setIsAddingDeck(false);
    setIsEditingDeckName(false);
    setIsAddingPrompt(false);
    setIsEditingPrompt(false);
    callback(true);
  };

  // Fetch
  const [isLoading, setIsLoading] = useState(true);
  const [allDecks, setAllDecks] = useState(null);

  // Deck name if user has 0 decks
  const firstDeckName = "My First Deck";

  const fetchDecks = async (userId) => {
    const decks = [];

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/details/" + userId
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "ERROR - Status " + response.status
        );
      } else {
        const data = await response.json();

        data.decks.forEach((deck) => {
          let newDeck = new Deck(deck.id, deck.deckName, deck.prompts);
          decks.push(newDeck);
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      // Add deck if user has 0 decks
      if (!decks.length) {
        // POST request
        await fetch("http://localhost:8080/api/decks/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deckName: firstDeckName,
            userId: selectedUser,
          }),
        });
        // Re-fetch data now that user has first deck
        fetchDecks(selectedUser);
      }

      setAllDecks(decks);
    }
  };

  // Fetch on page load
  useEffect(() => {
    fetchDecks(selectedUser);
  }, []);

  // Render page after fetch populates allDecks
  useEffect(() => {
    if (allDecks !== null) {
      setIsLoading(false);
    }
  }, [allDecks]);

  // Add deck
  const [isAddingDeck, setIsAddingDeck] = useState(false);

  const handleAddDeck = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const formJson = readFormData(event);
    // POST request
    await fetch("http://localhost:8080/api/decks/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deckName: formJson.newDeck,
        userId: selectedUser,
      }),
    });
    setIsAddingDeck(false);
    fetchDecks(selectedUser);
    // Display newly-created deck
    setSelectedDeckIndex(allDecks.length);
  };

  // Select deck
  const [selectedDeckIndex, setSelectedDeckIndex] = useState(0);

  // Edit deck name
  const [isEditingDeckName, setIsEditingDeckName] = useState(false);

  const handleEditDeckName = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const formJson = readFormData(event);
    // POST request
    await fetch(
      "http://localhost:8080/api/decks/update/" +
        allDecks[selectedDeckIndex].id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deckName: formJson.updatedDeckName,
          userId: selectedUser,
        }),
      }
    );
    setIsEditingDeckName(false);
    fetchDecks(selectedUser);
  };

  // Delete deck
  const handleDeleteDeck = async (deckId) => {
    if (confirm("Are you sure that you want to delete this deck?")) {
      // DELETE request
      await fetch("http://localhost:8080/api/decks/delete/" + deckId, {
        method: "DELETE",
      });
      fetchDecks(selectedUser);
      // Display first deck
      setSelectedDeckIndex(0);
    }
  };

  // Add prompt
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);

  const handleAddPromptClick = () => {
    closeOtherForms(setIsAddingPrompt);
    addEditPromptRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddPrompt = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const formJson = readFormData(event);
    // POST request
    await fetch("http://localhost:8080/api/prompts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promptText: formJson.newPromptText,
        deckId: allDecks[selectedDeckIndex].id,
      }),
    });
    setIsAddingPrompt(false);
    fetchDecks(selectedUser);
  };

  // Edit prompt
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const addEditPromptRef = useRef(null);

  const handleEditPromptClick = (prompt) => {
    closeOtherForms(setIsEditingPrompt);
    // Populate textarea with selected prompt text
    setCurrentPrompt(prompt);
    addEditPromptRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleEditPrompt = async (event) => {
    // Prevent form submission
    event.preventDefault();
    // Read form data
    const formJson = readFormData(event);
    // POST request
    await fetch(
      "http://localhost:8080/api/prompts/update/" + currentPrompt.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptText: formJson.updatedPromptText,
        }),
      }
    );
    setIsEditingPrompt(false);
    // Clean up current prompt variable
    setCurrentPrompt(null);
    fetchDecks(selectedUser);
  };

  const handleCancelPromptClick = () => {
    setIsEditingPrompt(false);
    setCurrentPrompt(null);
  };

  // Delete prompt
  const handleDeletePrompt = async (promptId) => {
    if (confirm("Are you sure that you want to delete this prompt?")) {
      // DELETE request
      await fetch("http://localhost:8080/api/prompts/delete/" + promptId, {
        method: "DELETE",
      });
      fetchDecks(selectedUser);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        <Modal
          modalContent={
            <>
              <p>
                Create your custom deck! First, give your custom deck a name.
                Deck names are limited to 25 characters to keep the Game Setup
                form from stretching too far.
              </p>
              <p>
                Next, add in your prompts! Prompts are limited to 130 characters
                to avoid the game board stretching too far.
              </p>
              <p>
                As long as your custom deck has at least 1 prompt, it will show
                up as a deck option in the Game Setup form. We recommend adding
                20-30 prompts to your custom deck.
              </p>
              <table id="icon-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="material-symbols-outlined">
                        library_add
                      </span>
                    </td>
                    <td>Add a new deck</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="material-symbols-outlined">edit</span>
                    </td>
                    <td>Edit a deck or prompt</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="material-symbols-outlined">delete</span>
                    </td>
                    <td>Delete a deck or prompt</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="material-symbols-outlined">
                        add_comment
                      </span>
                    </td>
                    <td>Add a new prompt</td>
                  </tr>
                </tbody>
              </table>
            </>
          }
        />{" "}
        {/* Edit deck name */}
        <h1>
          {isEditingDeckName ? (
            <form onSubmit={handleEditDeckName} className="inline-form">
              <input
                type="text"
                name="updatedDeckName"
                defaultValue={allDecks[selectedDeckIndex].deckName}
                maxLength={"25"}
                required
              ></input>
              <button type="submit" className="pulsate">
                Save
              </button>
              <button type="button" onClick={() => setIsEditingDeckName(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <span
                onClick={() => closeOtherForms(setIsAddingDeck)}
                className="material-symbols-outlined shake"
                title="Add New Deck"
              >
                library_add
              </span>{" "}
              {allDecks[selectedDeckIndex]
                ? allDecks[selectedDeckIndex].deckName
                : firstDeckName}{" "}
              <span
                onClick={() => closeOtherForms(setIsEditingDeckName)}
                className="material-symbols-outlined shake"
                title="Edit Deck Name"
              >
                edit
              </span>
              <span
                onClick={() => handleDeleteDeck(allDecks[selectedDeckIndex].id)}
                className="material-symbols-outlined shake"
                title="Delete Deck"
              >
                delete
              </span>
            </>
          )}
        </h1>
        <br />
        {/* Add deck */}
        {isAddingDeck && (
          <>
            <div className="white-bg gray-hover">
              <form onSubmit={handleAddDeck} className="inline-form">
                <label htmlFor="new-deck">Deck name: </label>
                <input
                  id="new-deck"
                  name="newDeck"
                  type="text"
                  maxLength={"25"}
                  required
                ></input>
                <button type="submit" className="pulsate">
                  Add
                </button>
                <button type="button" onClick={() => setIsAddingDeck(false)}>
                  Cancel
                </button>
              </form>
            </div>
            <br />
          </>
        )}
        {/* Select deck */}
        {!isEditingDeckName && (
          <>
            <select
              onChange={(event) => setSelectedDeckIndex(event.target.value)}
              value={selectedDeckIndex}
            >
              {allDecks.map((deck, index) => {
                return (
                  <option key={deck.id} value={index}>
                    {deck.deckName}
                  </option>
                );
              })}
            </select>
            <br />
            <br />
          </>
        )}
        {/* Add/Edit prompt */}
        <div ref={addEditPromptRef}>
          {(isAddingPrompt || isEditingPrompt) && <br />}
          {/* Add Prompt */}
          {isAddingPrompt && (
            <>
              <form onSubmit={handleAddPrompt} className="white-bg gray-hover">
                <label htmlFor="new-prompt">Add Prompt:</label>
                <br />
                <textarea
                  id="new-prompt"
                  name="newPromptText"
                  rows="4"
                  cols="40"
                  maxLength="130"
                  required
                ></textarea>
                <br />
                <button type="submit" className="pulsate">
                  Add
                </button>
                <button type="button" onClick={() => setIsAddingPrompt(false)}>
                  Cancel
                </button>
              </form>
              <br />
            </>
          )}
          {/* Edit Prompt */}
          {isEditingPrompt && (
            <>
              <form onSubmit={handleEditPrompt} className="white-bg gray-hover">
                <label htmlFor="edit-prompt">Edit Prompt:</label>
                <br />
                <textarea
                  id="edit-prompt"
                  name="updatedPromptText"
                  defaultValue={currentPrompt.promptText}
                  rows="4"
                  cols="40"
                  maxLength="130"
                  required
                ></textarea>
                <br />
                <button type="submit" className="pulsate">
                  Save
                </button>
                <button type="button" onClick={handleCancelPromptClick}>
                  Cancel
                </button>
              </form>
              <br />
            </>
          )}
        </div>
        {/* Prompts list */}
        <div className="white-bg">
          <table className="left-align">
            <tbody>
              <tr>
                <td width={"100%"}>
                  <em>Add a new prompt!</em>
                </td>
                <td>
                  <span
                    onClick={handleAddPromptClick}
                    className="material-symbols-outlined shake"
                    title="Add New Prompt"
                  >
                    add_comment
                  </span>
                </td>
                <td></td>
              </tr>
              {allDecks[selectedDeckIndex] &&
                allDecks[selectedDeckIndex].prompts.map((prompt) => {
                  return (
                    <tr key={prompt.id}>
                      <td className="custom-deck-list-item" width={"100%"}>
                        {prompt.promptText}
                      </td>
                      <td>
                        <span
                          onClick={() => handleEditPromptClick(prompt)}
                          className="material-symbols-outlined shake"
                          title="Edit Prompt"
                        >
                          edit
                        </span>
                      </td>
                      <td>
                        <span
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="material-symbols-outlined shake"
                          title="Delete Prompt"
                        >
                          delete
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
};

export default CustomDeck;
