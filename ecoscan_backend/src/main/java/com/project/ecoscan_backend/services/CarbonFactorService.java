package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.entities.CarbonFactor;

import java.util.Optional;

public interface CarbonFactorService {
    Optional<CarbonFactor> getByMaterial(String material);
}
