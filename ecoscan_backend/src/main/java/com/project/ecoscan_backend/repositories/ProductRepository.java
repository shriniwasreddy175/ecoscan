package com.project.ecoscan_backend.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.project.ecoscan_backend.entities.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Product> findAllByOrderByIdDesc(Pageable pageable);
    List<Product> findAllByUserUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    List<Product> findAllByUserUserIdOrderByIdDesc(String userId, Pageable pageable);
}