package com.nongame.backend.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Objects;

public class Deck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

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
