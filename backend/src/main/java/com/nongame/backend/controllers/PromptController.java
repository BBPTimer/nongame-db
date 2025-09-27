package com.nongame.backend.controllers;

import com.nongame.backend.repositories.PromptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prompts")
public class PromptController {
    @Autowired
    PromptRepository promptRepository;
}
