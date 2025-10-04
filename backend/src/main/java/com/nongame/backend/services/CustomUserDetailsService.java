package com.nongame.backend.services;

import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.UserProfileRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserProfileRepository userProfileRepository;

    public CustomUserDetailsService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    // Customization allows us to use an email for login instead of the default username

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserProfile userProfile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Profile not found for the email " + email));
        return new User(userProfile.getEmail(), userProfile.getPassword(), new ArrayList<>());
    }
}