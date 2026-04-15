package com.project.ecoscan_backend.repositories;

import com.project.ecoscan_backend.entities.CarbonFactor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarbonFactorRepository extends JpaRepository<CarbonFactor, Long> {

    Optional<CarbonFactor> findByMaterial(String material);

}
