package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class SustainabilityIndexServiceImpl implements SustainabilityIndexService {

    private static final double CARBON_WEIGHT = 2.0;
    private static final double WATER_WEIGHT = 0.0002;
    private static final double ENERGY_WEIGHT = 0.1;
    private static final double TRANSPORT_WEIGHT = 0.05;

    @Override
    public int calculateOverallScore(double carbon,
                                     double water,
                                     double energy,
                                     double transport,
                                     int recyclingScore) {

        double carbonPenalty = carbon * CARBON_WEIGHT;
        double waterPenalty = water * WATER_WEIGHT;
        double energyPenalty = energy * ENERGY_WEIGHT;
        double transportPenalty = transport * TRANSPORT_WEIGHT;

        double rawScore = 100 - (carbonPenalty + waterPenalty + energyPenalty + transportPenalty);

        double finalScore = (rawScore + recyclingScore) / 2;

        return (int) Math.max(0, Math.min(100, finalScore));
    }
}
