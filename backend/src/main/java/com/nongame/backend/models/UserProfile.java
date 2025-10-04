package com.nongame.backend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL)
    @JsonManagedReference
    private final List<Deck> decks = new ArrayList<>();

    public UserProfile() {
    }

    public UserProfile(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Deck> getDecks() {
        return decks;
    }

    @Override
    public String toString() {
        return email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserProfile userProfile = (UserProfile) o;
        return id == userProfile.id;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
