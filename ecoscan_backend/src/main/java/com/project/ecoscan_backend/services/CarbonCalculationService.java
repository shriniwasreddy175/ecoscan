package com.project.ecoscan_backend.services;

public interface CarbonCalculationService {
    double calculateCarbon(double weight, double emissionFactor);
    double calculateShadowCost(double carbon);
    int calculateEcoScore(double carbon);
}
