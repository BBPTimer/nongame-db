package com.nongame.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.util.Objects;

@Entity
public class Prompt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String promptText;

    @ManyToOne
    @JsonBackReference
    private Deck deck;

    public Prompt(String promptText, Deck deck) {
        this.promptText = promptText;
        this.deck = deck;
    }

    public Prompt() {
    }

    public int getId() {
        return id;
    }

    public String getPromptText() {
        return promptText;
    }

    public void setPromptText(String promptText) {
        this.promptText = promptText;
    }

    public Deck getDeck() {
        return deck;
    }

    public void setDeck(Deck deck) {
        this.deck = deck;
    }

    @Override
    public String toString() {
        return promptText;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Prompt prompt = (Prompt) o;
        return id == prompt.id;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
