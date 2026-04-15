package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class TransportImpactServiceImpl implements TransportImpactService {

    @Override
    public double calculateTransportEmission(double distance) {
        return distance * 0.12; // kg CO2 per km
    }
}
