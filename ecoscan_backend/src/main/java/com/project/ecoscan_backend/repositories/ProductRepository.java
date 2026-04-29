package com.project.ecoscan_backend.repositories;

import com.project.ecoscan_backend.entities.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Product> findAllByOrderByIdDesc(Pageable pageable);
}