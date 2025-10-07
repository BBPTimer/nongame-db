package com.nongame.backend.controllers;

import com.nongame.backend.dto.UserProfileDTO;
import com.nongame.backend.dto.response.UserProfileNoPwDTO;
import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.UserProfileRepository;
import com.nongame.backend.utils.JwtTokenUtil;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {
    ModelMapper modelMapper = new ModelMapper();

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @GetMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
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
            return new ResponseEntity<>(
                    // Map UserProfile object to UserProfileNoPwDTO object for return
                    modelMapper.map(
                            // Get UserProfile object from Optional
                            opt.get()
                            , UserProfileNoPwDTO.class),
                    HttpStatus.OK);
        }
    }

    @PutMapping(value = "/updatePW/{userId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePW(@PathVariable int userId, @Valid @RequestBody UserProfileDTO userData) {
        UserProfile userProfile = userProfileRepository.findById(userId).orElse(null);
        if (userProfile == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            userProfile.setPassword(userData.getPassword());
            userProfileRepository.save(userProfile);
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        }
    }

//    @DeleteMapping(value = "/delete/{userId}")
//    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
//        UserProfile userProfile = userProfileRepository.findById(userId).orElse(null);
//        if (userProfile == null) {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        } else {
//            userProfileRepository.deleteById(userId);
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        }
//    }
}
