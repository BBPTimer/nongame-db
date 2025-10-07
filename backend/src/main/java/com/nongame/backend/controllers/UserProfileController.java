package com.nongame.backend.controllers;

import com.nongame.backend.dto.request.PwChangeRequestDTO;
import com.nongame.backend.dto.response.UserProfileNoPwDTO;
import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.UserProfileRepository;
import com.nongame.backend.services.UserProfileServiceImpl;
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
    private final ModelMapper modelMapper = new ModelMapper();

    @Autowired
    private UserProfileServiceImpl userProfileService;

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

    @PutMapping(value = "/pwChange", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> passwordChange(@Valid @RequestBody PwChangeRequestDTO pwChangeRequestDTO, @RequestHeader(HttpHeaders.AUTHORIZATION) String token) {
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
            // Get UserProfile object from Optional
            UserProfile userProfile = opt.get();
            // Update password to newPassword from request body
            userProfile.setPassword(userProfileService.encodePassword(pwChangeRequestDTO.getNewPassword()));
            // Update DB
            userProfileRepository.save(userProfile);
            return new ResponseEntity<>(HttpStatus.OK);
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
