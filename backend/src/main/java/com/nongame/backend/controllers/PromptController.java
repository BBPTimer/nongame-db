package com.nongame.backend.controllers;

import com.nongame.backend.models.Prompt;
import com.nongame.backend.repositories.PromptRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {
    @Autowired
    PromptRepository promptRepository;

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
    public ResponseEntity<?> addNewPrompt(@Valid @RequestBody Prompt prompt) {
        promptRepository.save(prompt);
        return new ResponseEntity<>(prompt, HttpStatus.CREATED);
    }

    @PutMapping(value = "/update/{promptId}", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePrompt(@PathVariable int promptId, @Valid @RequestBody Prompt prompt) {
        Prompt updatedPrompt = promptRepository.findById(promptId).orElse(null);
        if (updatedPrompt == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            updatedPrompt.setPromptText(prompt.getPromptText());
            promptRepository.save(updatedPrompt);
            return new ResponseEntity<>(updatedPrompt, HttpStatus.OK);
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
