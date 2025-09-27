package com.nongame.backend.models;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Objects;

public class Prompt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String promptText;

    public Prompt(String promptText) {
        this.promptText = promptText;
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
