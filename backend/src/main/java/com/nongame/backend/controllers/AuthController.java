package com.nongame.backend.controllers;

import com.nongame.backend.dto.request.AuthRequestDTO;
import com.nongame.backend.dto.request.TokenValidationRequestDTO;
import com.nongame.backend.dto.request.UserProfileRequestDTO;
import com.nongame.backend.dto.response.AuthResponseDTO;
import com.nongame.backend.dto.response.UserProfileResponseDTO;
import com.nongame.backend.services.CustomUserDetailsService;
import com.nongame.backend.services.TokenBlacklistService;
import com.nongame.backend.services.UserProfileService;
import com.nongame.backend.utils.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class AuthController {

    private final ModelMapper modelMapper;
    private final UserProfileService userProfileService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    public AuthController(UserProfileService userProfileService, AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil, CustomUserDetailsService userDetailsService, TokenBlacklistService tokenBlacklistService, ModelMapper modelMapper) {
        this.userProfileService = userProfileService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.modelMapper = modelMapper;
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public UserProfileResponseDTO createUserProfile(@Valid @RequestBody UserProfileRequestDTO userProfileRequest) throws Exception {
        UserProfileRequestDTO userProfileRequestDTO = mapToUserProfileDTO(userProfileRequest);
        userProfileRequestDTO = userProfileService.createUserProfile(userProfileRequestDTO);
        return mapToUserProfileResponse(userProfileRequestDTO);
    }

    @PostMapping("/login")
    public AuthResponseDTO authenticateUserProfile(@RequestBody AuthRequestDTO authRequest) throws Exception {
        authenticate(authRequest);
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String token = jwtTokenUtil.generateToken(userDetails);
        return new AuthResponseDTO(token, authRequest.getEmail());
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping("/logout")
    public void logOut(HttpServletRequest request) {
        String jwtToken = extractJwtTokenFromRequest(request);
        if (jwtToken != null) {
            tokenBlacklistService.addTokenToBlacklist(jwtToken);
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<String> checkTokenValidity(@RequestBody TokenValidationRequestDTO tokenValidationRequest) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(tokenValidationRequest.getEmail());
        if (jwtTokenUtil.validateToken(tokenValidationRequest.getToken(), userDetails)) {
            return new ResponseEntity<>("Token is valid", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
        }
    }

    private String extractJwtTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private void authenticate(AuthRequestDTO authRequest) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        } catch (DisabledException ex) {
            throw new Exception("Profile disabled");
        }
    }

    // Mapper method to map values from request to DTO
    private UserProfileRequestDTO mapToUserProfileDTO(UserProfileRequestDTO userProfileRequest) {
        return modelMapper.map(userProfileRequest, UserProfileRequestDTO.class);
    }

    // Mapper method to map values from DTO to response
    private UserProfileResponseDTO mapToUserProfileResponse(UserProfileRequestDTO userProfileRequestDTO) {
        return modelMapper.map(userProfileRequestDTO, UserProfileResponseDTO.class);
    }
}