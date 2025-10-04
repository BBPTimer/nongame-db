package com.nongame.backend.controllers;

import com.nongame.backend.dto.UserProfileDTO;
import com.nongame.backend.dto.response.UserProfileNoPwDTO;
import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.UserProfileRepository;
import com.nongame.backend.utils.JwtTokenUtil;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {
    ModelMapper modelMapper = new ModelMapper();

    @Autowired
    UserProfileRepository userProfileRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

//    @GetMapping("")
//    public ResponseEntity<?> getAllUsers() {
//        List<UserProfile> allUserProfiles = userProfileRepository.findAll();
//        return new ResponseEntity<>(allUserProfiles, HttpStatus.OK);
//    }

    @GetMapping(value = "/details/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getUserByID(@PathVariable int userId, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
        UserProfile userProfile = userProfileRepository.findById(userId).orElse(null);
        if (userProfile == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            // Remove Bearer prefix from token
            token = token.substring(7);
            // Compare username from token to username from request
            if (!Objects.equals(jwtTokenUtil.getUsernameFromToken(token), userProfile.getEmail())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            } else {
                UserProfileNoPwDTO userProfileNoPwDTO = modelMapper.map(userProfile, UserProfileNoPwDTO.class);
                return new ResponseEntity<>(userProfileNoPwDTO, HttpStatus.OK);
            }
        }
    }

//    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> addNewUser(@Valid @RequestBody UserProfileDTO userData) {
//        UserProfile userProfile = new UserProfile(userData.getEmail(), userData.getPassword());
//        userProfileRepository.save(userProfile);
//        return new ResponseEntity<>(userProfile, HttpStatus.CREATED);
//    }

    @PutMapping(value = "/updatePW/{userId}", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updatePW(@PathVariable int userId, @Valid @RequestBody UserProfileDTO userData) {
        UserProfile userProfile = userProfileRepository.findById(userId).orElse(null);
        if (userProfile == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        else {
            userProfile.setPassword(userData.getPassword());
            userProfileRepository.save(userProfile);
            return new ResponseEntity<>(userProfile, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        UserProfile userProfile = userProfileRepository.findById(userId).orElse(null);
        if (userProfile == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            userProfileRepository.deleteById(userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
}
