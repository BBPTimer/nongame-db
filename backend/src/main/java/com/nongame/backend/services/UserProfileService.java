package com.nongame.backend.services;

import com.nongame.backend.dto.request.UserProfileRequestDTO;

public interface UserProfileService {

    UserProfileRequestDTO createUserProfile(UserProfileRequestDTO userProfileRequestDTO) throws Exception;
}