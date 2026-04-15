package com.project.ecoscan_backend.services;

public interface SustainabilityIndexService {
    int calculateOverallScore(double carbon,
                              double water,
                              double energy,
                              double transport,
                              int recyclingScore);
}
