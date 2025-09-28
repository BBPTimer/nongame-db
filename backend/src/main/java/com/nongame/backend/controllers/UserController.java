package com.nongame.backend.controllers;

import com.nongame.backend.models.User;
import com.nongame.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/details/{userId}")
    public User getUserByID(@PathVariable int userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @PostMapping("/add")
    public String addNewUser(@RequestParam String username, String password) {
        User newUser = new User(username, password);
        userRepository.save(newUser);
        return "User added: " + newUser;
    }
}
