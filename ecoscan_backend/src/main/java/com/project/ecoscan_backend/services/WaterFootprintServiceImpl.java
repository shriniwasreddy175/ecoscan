package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class WaterFootprintServiceImpl implements WaterFootprintService {

    @Override
    public double calculateWaterFootprint(double weight, String material) {

        double waterPerKg;

        switch (material.toLowerCase()) {
            case "cotton":
                waterPerKg = 10000;
                break;
            case "polyester":
                waterPerKg = 1000;
                break;
            default:
                waterPerKg = 2000;
        }

        return weight * waterPerKg;
    }
}
