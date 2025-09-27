package com.nongame.backend.repositories;

import com.nongame.backend.models.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromptRepository extends JpaRepository<Prompt, Integer> {
}
