package com.nongame.backend.controllers;

import com.nongame.backend.dto.request.DeckDTO;
import com.nongame.backend.models.Deck;
import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.DeckRepository;
import com.nongame.backend.repositories.UserProfileRepository;
import com.nongame.backend.utils.JwtTokenUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    @Autowired
    DeckRepository deckRepository;

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addNewDeck(@Valid @RequestBody DeckDTO deckData, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Optional<UserProfile> opt =
                // Look up user in DB
                userProfileRepository.findByEmail(
                        // Get email from token
                        jwtTokenUtil.getUsernameFromToken(
                                // Remove Bearer prefix from token
                                token.substring(7)));
        // Can't find user in DB
        if (opt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            Deck deck = new Deck(deckData.getDeckName(), opt.get());
            deckRepository.save(deck);
            return new ResponseEntity<>(deck.getDeckName(), HttpStatus.CREATED);
        }
    }

    @PutMapping(value = "/update/{deckId}", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateDeck(@PathVariable int deckId, @Valid @RequestBody DeckDTO deckData, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Deck deck = deckRepository.findById(deckId).orElse(null);
        // Can't find deck in DB
        if (deck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            // Get UserProfile from DB belonging to email found in token
            Optional<UserProfile> opt = userProfileRepository.findByEmail(jwtTokenUtil.getUsernameFromToken(token.substring(7)));
            // Can't find user in DB
            if (opt.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            // User Id from token doesn't match User Id from deck
            else if (!Objects.equals(opt.get().getId(), deck.getUser().getId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            } else {
                deck.setDeckName(deckData.getDeckName());
                deckRepository.save(deck);
                return new ResponseEntity<>(deck.getDeckName(), HttpStatus.OK);
            }
        }
    }

    @DeleteMapping(value = "/delete/{deckId}")
    public ResponseEntity<?> deleteDeck(@PathVariable int deckId, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Deck deck = deckRepository.findById(deckId).orElse(null);
        // Can't find deck in DB
        if (deck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            // Get UserProfile from DB belonging to email found in token
            Optional<UserProfile> opt = userProfileRepository.findByEmail(jwtTokenUtil.getUsernameFromToken(token.substring(7)));
            // Can't find user in DB
            if (opt.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            // User Id from token doesn't match User Id from deck
            else if (!Objects.equals(opt.get().getId(), deck.getUser().getId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            } else {
                deckRepository.deleteById(deckId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
        }
    }
}
