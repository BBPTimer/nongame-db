package com.nongame.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DeckDTO {
    @NotBlank(message="Deck name is required.")
    @Size(min=1, max=25, message="Deck name must be 1-25 characters long.")
    private String deckName;

    @NotNull(message = "User is required.")
    private int userId;

    public DeckDTO(String deckName, int userId) {
        this.deckName = deckName;
        this.userId = userId;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}
