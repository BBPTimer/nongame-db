package com.nongame.backend.controllers;

import com.nongame.backend.dto.PromptDTO;
import com.nongame.backend.models.Deck;
import com.nongame.backend.models.Prompt;
import com.nongame.backend.models.User;
import com.nongame.backend.repositories.DeckRepository;
import com.nongame.backend.repositories.PromptRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/prompts")
public class PromptController {
    @Autowired
    PromptRepository promptRepository;

    @Autowired
    DeckRepository deckRepository;

    @GetMapping("")
    public ResponseEntity<?> getAllPrompts() {
        List<Prompt> allPrompts = promptRepository.findAll();
        return new ResponseEntity<>(allPrompts, HttpStatus.OK);
    }

    @GetMapping(value = "/details/{promptId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPromptByID(@PathVariable int promptId) {
        Prompt prompt = promptRepository.findById(promptId).orElse(null);
        if (prompt == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(prompt, HttpStatus.OK);
        }
    }

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addNewPrompt(@Valid @RequestBody PromptDTO promptData) {
        Deck deck = deckRepository.findById(promptData.getDeckId()).orElse(null);
        if (deck == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            Prompt prompt = new Prompt(promptData.getPromptText(), deck);
            promptRepository.save(prompt);
            return new ResponseEntity<>(prompt, HttpStatus.CREATED);
        }
    }

    @PutMapping(value = "/update/{promptId}", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePrompt(@PathVariable int promptId, @Valid @RequestBody PromptDTO promptData) {
        Prompt prompt = promptRepository.findById(promptId).orElse(null);
        if (prompt == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            prompt.setPromptText(promptData.getPromptText());
            promptRepository.save(prompt);
            return new ResponseEntity<>(prompt, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/delete/{promptId}")
    public ResponseEntity<?> deletePrompt(@PathVariable int promptId) {
        Prompt prompt = promptRepository.findById(promptId).orElse(null);
        if (prompt == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            promptRepository.deleteById(promptId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
}
