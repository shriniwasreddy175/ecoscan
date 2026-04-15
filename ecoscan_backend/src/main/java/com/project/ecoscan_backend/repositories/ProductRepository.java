package com.project.ecoscan_backend.repositories;

import com.project.ecoscan_backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}