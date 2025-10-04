package com.nongame.backend.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.Objects;

@Entity
public class Deck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String deckName;

    @ManyToOne
    @JsonBackReference
    private UserProfile userProfile;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Prompt> prompts;

    public Deck() {
    }

    public Deck(String deckName, UserProfile userProfile) {
        this.deckName = deckName;
        this.userProfile = userProfile;
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

    public UserProfile getUser() {
        return userProfile;
    }

    public void setUser(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public List<Prompt> getPrompts() {
        return prompts;
    }

    public void setPrompts(List<Prompt> prompts) {
        this.prompts = prompts;
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
