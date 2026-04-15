package com.project.ecoscan_backend.services;

import org.springframework.stereotype.Service;

@Service
public class SDGImpactServiceImpl implements SDGImpactService {

    @Override
    public String calculateSDG13(double carbon) {
        if (carbon < 3) return "Strong Climate Positive";
        if (carbon < 10) return "Moderate Impact";
        return "High Climate Risk";
    }

    @Override
    public String calculateSDG12(int ecoScore) {
        if (ecoScore > 80) return "Responsible Consumption";
        if (ecoScore > 50) return "Needs Optimization";
        return "Unsustainable Production";
    }

    @Override
    public String calculateSDG9(double shadowCost) {
        if (shadowCost < 1) return "Efficient Industry";
        return "Carbon Intensive Industry";
    }
}
