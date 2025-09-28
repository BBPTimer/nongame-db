package com.nongame.backend.controllers;

import com.nongame.backend.dto.DeckDTO;
import com.nongame.backend.models.Deck;
import com.nongame.backend.models.User;
import com.nongame.backend.repositories.DeckRepository;
import com.nongame.backend.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    @Autowired
    DeckRepository deckRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<?> getAllDecks() {
        List<Deck> allDecks = deckRepository.findAll();
        return new ResponseEntity<>(allDecks, HttpStatus.OK);
    }

    @GetMapping(value = "/details/{deckId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getDeckByID(@PathVariable int deckId) {
        Deck deck = deckRepository.findById(deckId).orElse(null);
        if (deck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(deck, HttpStatus.OK);
        }
    }

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addNewDeck(@Valid @RequestBody DeckDTO deckData) {
        User user = userRepository.findById(deckData.getUserId()).orElse(null);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            Deck deck = new Deck(deckData.getDeckName(), user);
            deckRepository.save(deck);
            return new ResponseEntity<>(deck, HttpStatus.CREATED);
        }
    }

    @PutMapping(value = "/update/{deckId}", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateDeck(@PathVariable int deckId, @Valid @RequestBody DeckDTO deckData) {
        Deck deck = deckRepository.findById(deckId).orElse(null);
        if (deck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            deck.setDeckName(deckData.getDeckName());
            deckRepository.save(deck);
            return new ResponseEntity<>(deck, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/delete/{deckId}")
    public ResponseEntity<?> deleteDeck(@PathVariable int deckId) {
        Deck deck = deckRepository.findById(deckId).orElse(null);
        if (deck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            deckRepository.deleteById(deckId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
}
