package com.nongame.backend.controllers;

import com.nongame.backend.dto.request.PromptDTO;
import com.nongame.backend.models.Deck;
import com.nongame.backend.models.Prompt;
import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.DeckRepository;
import com.nongame.backend.repositories.PromptRepository;
import com.nongame.backend.utils.GetUserFromToken;
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
@RequestMapping("/api/prompts")
public class PromptController {
    @Autowired
    private PromptRepository promptRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private GetUserFromToken getUserFromToken;

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addNewPrompt(@Valid @RequestBody PromptDTO promptData, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Deck deck = deckRepository.findById(promptData.getDeckId()).orElse(null);
        // Can't find deck in DB
        if (deck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            Optional<UserProfile> opt = getUserFromToken.getUserFromToken(token);
            // Can't find user in DB
            if (opt.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            // User Id from token doesn't match User Id from deck
            else if (!Objects.equals(opt.get().getId(), deck.getUserProfile().getId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            } else {
                Prompt prompt = new Prompt(promptData.getPromptText(), deck);
                promptRepository.save(prompt);
                return new ResponseEntity<>(prompt, HttpStatus.CREATED);
            }
        }
    }

    @PutMapping(value = "/update/{promptId}", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePrompt(@PathVariable int promptId, @Valid @RequestBody PromptDTO promptData, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Prompt prompt = promptRepository.findById(promptId).orElse(null);
        // Can't find prompt in DB
        if (prompt == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Optional<UserProfile> opt = getUserFromToken.getUserFromToken(token);
        // Can't find user in DB
        if (opt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // User Id from token doesn't match User Id from prompt
        else if (!Objects.equals(opt.get().getId(), prompt.getDeck().getUserProfile().getId())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            prompt.setPromptText(promptData.getPromptText());
            promptRepository.save(prompt);
            return new ResponseEntity<>(prompt, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/delete/{promptId}")
    public ResponseEntity<?> deletePrompt(@PathVariable int promptId, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Prompt prompt = promptRepository.findById(promptId).orElse(null);
        // Can't find prompt in DB
        if (prompt == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Optional<UserProfile> opt = getUserFromToken.getUserFromToken(token);
        // Can't find user in DB
        if (opt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // User Id from token doesn't match User Id from prompt
        else if (!Objects.equals(opt.get().getId(), prompt.getDeck().getUserProfile().getId())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            promptRepository.deleteById(promptId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
}
