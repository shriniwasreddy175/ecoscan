package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class CarbonCalculationServiceImpl implements CarbonCalculationService {

    @Override
    public double calculateCarbon(double weight, double emissionFactor) {
        return weight * emissionFactor;
    }

    @Override
    public double calculateShadowCost(double carbon) {
        return carbon * 0.05;
    }

    @Override
    public int calculateEcoScore(double carbon) {
        return (int) Math.max(0, 100 - (carbon * 2));
    }
}
