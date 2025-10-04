package com.nongame.backend.repositories;

import com.nongame.backend.models.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {
    Optional<UserProfile> findByEmail(String email);
    Boolean existsByEmail(String email);
}
