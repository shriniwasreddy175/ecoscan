package com.project.ecoscan_backend.services;

public interface SDGImpactService {
    String calculateSDG13(double carbon);
    String calculateSDG12(int ecoScore);
    String calculateSDG9(double shadowCost);
}
