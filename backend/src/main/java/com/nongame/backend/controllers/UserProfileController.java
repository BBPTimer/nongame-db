package com.nongame.backend.controllers;

import com.nongame.backend.dto.request.PwChangeRequestDTO;
import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.UserProfileRepository;
import com.nongame.backend.services.UserProfileServiceImpl;
import com.nongame.backend.utils.GetUserFromToken;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {
    private final ModelMapper modelMapper = new ModelMapper();

    @Autowired
    private UserProfileServiceImpl userProfileService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private GetUserFromToken getUserFromToken;

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Optional<UserProfile> opt = getUserFromToken.getUserFromToken(token);
        // Can't find user in DB
        if (opt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            UserProfile userProfile = opt.get();
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        }
    }

    @PutMapping(value = "/pwChange", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> passwordChange(@Valid @RequestBody PwChangeRequestDTO pwChangeRequestDTO, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Optional<UserProfile> opt = getUserFromToken.getUserFromToken(token);
        // Can't find user in DB
        if (opt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            // Get UserProfile object from Optional
            UserProfile userProfile = opt.get();
            // Update password to newPassword from request body
            userProfile.setPassword(userProfileService.encodePassword(pwChangeRequestDTO.getNewPassword()));
            // Update DB
            userProfileRepository.save(userProfile);
            return new ResponseEntity<>(HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity<?> deleteUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        Optional<UserProfile> opt = getUserFromToken.getUserFromToken(token);
        // Can't find user in DB
        if (opt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            userProfileRepository.deleteById(Math.toIntExact(opt.get().getId()));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
}
