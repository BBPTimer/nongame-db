package com.nongame.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class DeckDTO {
    @NotBlank(message="Deck name is required.")
    @Size(min=1, max=25, message="Deck name must be 1-25 characters long.")
    private String deckName;

    public DeckDTO(String deckName, int userId) {
        this.deckName = deckName;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }
}
