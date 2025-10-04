package com.nongame.backend.dto.response;

import com.nongame.backend.models.Deck;

import java.util.ArrayList;
import java.util.List;

public class UserProfileNoPwDTO {
    private Long id;
    private String email;
    private List<Deck> decks = new ArrayList<>();

    public UserProfileNoPwDTO() {
    }

    public UserProfileNoPwDTO(List<Deck> decks, String email, Long id) {
        this.decks = decks;
        this.email = email;
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Deck> getDecks() {
        return decks;
    }

    public void setDecks(List<Deck> decks) {
        this.decks = decks;
    }
}
