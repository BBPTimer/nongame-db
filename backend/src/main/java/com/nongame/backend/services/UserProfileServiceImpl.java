package com.nongame.backend.services;

import com.nongame.backend.dto.request.UserProfileRequestDTO;
import com.nongame.backend.models.UserProfile;
import com.nongame.backend.repositories.UserProfileRepository;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserProfileServiceImpl implements  UserProfileService {

    private final ModelMapper modelMapper;
    private final UserProfileRepository userProfileRepository;
    private final PasswordEncoder encoder;

    public UserProfileServiceImpl(ModelMapper modelMapper, UserProfileRepository userProfileRepository, PasswordEncoder encoder) {
        this.modelMapper = modelMapper;
        this.userProfileRepository = userProfileRepository;
        this.encoder = encoder;
    }

    @Override
    public UserProfileRequestDTO createUserProfile (UserProfileRequestDTO userProfileRequestDTO) throws Exception {
        if (userProfileRepository.existsByEmail(userProfileRequestDTO.getEmail())) {
            throw new Exception("Profile already exists for " + userProfileRequestDTO.getEmail());
        }
        userProfileRequestDTO.setPassword(encoder.encode(userProfileRequestDTO.getPassword()));
        UserProfile userProfile = mapToProfileEntity(userProfileRequestDTO);
        userProfile = userProfileRepository.save(userProfile); // returns saved object with generated id
        return mapToProfileDTO(userProfile);
    }

    // Map values from entity to DTO
    private UserProfileRequestDTO mapToProfileDTO(UserProfile profileEntity) {
        return modelMapper.map(profileEntity, UserProfileRequestDTO.class);
    }

    // Map values from DTO to entity
    private UserProfile mapToProfileEntity(UserProfileRequestDTO userProfileRequestDTO) {
        return modelMapper.map(userProfileRequestDTO, UserProfile.class);
    }
}