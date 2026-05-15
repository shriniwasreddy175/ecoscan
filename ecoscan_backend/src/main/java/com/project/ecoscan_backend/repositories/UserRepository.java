package com.project.ecoscan_backend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.ecoscan_backend.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    List<User> findAllByOrderByEcoPointsDesc(Pageable pageable);
}