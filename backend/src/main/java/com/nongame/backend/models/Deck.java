package com.nongame.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Size;

import java.util.Objects;

@Entity
public class Deck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Size(min=1, max=25, message="Deck name must be 1-25 characters long.")
    private String deckName;

    public Deck(String deckName) {
        this.deckName = deckName;
    }

    public Deck() {
    }

    public int getId() {
        return id;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    @Override
    public String toString() {
        return deckName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Deck deck = (Deck) o;
        return id == deck.id;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
