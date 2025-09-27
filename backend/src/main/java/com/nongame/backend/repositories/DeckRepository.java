package com.nongame.backend.repositories;

import com.nongame.backend.models.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeckRepository extends JpaRepository<Deck, Integer> {
}
