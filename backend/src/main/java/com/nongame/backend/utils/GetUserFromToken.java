package com.nongame.backend.utils;

import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class GetUserFromToken {
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public Optional<UserProfile> getUserFromToken (String token) {
        // Look up user in DB
        return userProfileRepository.findByEmail(
                // Get email from token
                jwtTokenUtil.getUsernameFromToken(
                        // Remove Bearer prefix from token
                        token.substring(7)));
    }
}
