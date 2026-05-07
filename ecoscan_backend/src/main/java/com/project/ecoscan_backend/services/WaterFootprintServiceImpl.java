package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class WaterFootprintServiceImpl implements WaterFootprintService {

    @Override
    public double calculateWaterFootprint(double weight, String material) {

        double waterPerKg = switch (material.toLowerCase()) {
            case "cotton"    -> 10000;
            case "polyester" -> 1000;
            default          -> 2000;
        };

        return weight * waterPerKg;
    }
}
