package com.nongame.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PromptDTO {
    @NotBlank(message="Prompt text is required.")
    @Size(min=1, max=130, message="Prompt text must be 1-130 characters long.")
    private String promptText;

    @NotNull(message = "Deck is required.")
    private int deckId;

    public PromptDTO(String promptText, int deckId) {
        this.promptText = promptText;
        this.deckId = deckId;
    }

    public String getPromptText() {
        return promptText;
    }

    public void setPromptText(String promptText) {
        this.promptText = promptText;
    }

    public int getDeckId() {
        return deckId;
    }

    public void setDeckId(int deckId) {
        this.deckId = deckId;
    }
}
