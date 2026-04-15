package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class EnergyConsumptionServiceImpl implements EnergyConsumptionService {

    @Override
    public double calculateEnergy(double weight) {
        return weight * 15; // kWh per kg assumption
    }
}
