package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class RecyclingImpactServiceImpl implements RecyclingImpactService {

    @Override
    public int calculateRecyclingScore(String material) {

        if (material.equalsIgnoreCase("steel")) return 90;
        if (material.equalsIgnoreCase("cotton")) return 70;
        if (material.equalsIgnoreCase("plastic")) return 40;

        return 50;
    }
}
