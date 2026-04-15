package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.entities.CarbonFactor;
import com.project.ecoscan_backend.repositories.CarbonFactorRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarbonFactorServiceImpl implements CarbonFactorService {

    private final CarbonFactorRepository repository;

    public CarbonFactorServiceImpl(CarbonFactorRepository repository) {
        this.repository = repository;
    }

    @Override
    public Optional<CarbonFactor> getByMaterial(String material) {
        return repository.findByMaterial(material);
    }
}
