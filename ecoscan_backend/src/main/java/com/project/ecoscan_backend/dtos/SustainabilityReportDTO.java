package com.project.ecoscan_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SustainabilityReportDTO {

    private Long productId;
    private String productName;

    private double carbonFootprint;
    private double shadowCost;
    private int ecoScore;

    private double waterFootprint;
    private double energyConsumption;
    private double transportEmission;
    private int recyclingScore;

    private int overallSustainabilityScore;

    private String sdg12Impact;
    private String sdg13Impact;
    private String sdg9Impact;

}
