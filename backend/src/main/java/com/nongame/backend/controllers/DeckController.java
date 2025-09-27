package com.nongame.backend.controllers;

import com.nongame.backend.repositories.DeckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    @Autowired
    DeckRepository deckRepository;
}
