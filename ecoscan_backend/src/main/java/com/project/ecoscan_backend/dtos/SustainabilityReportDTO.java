package com.project.ecoscan_backend.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SustainabilityReportDTO {

    private Long productId;
    private String productName;
    private String category;

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

    private List<RecommendationDTO> recommendations;

    public SustainabilityReportDTO(
            Long productId,
            String productName,
            String category,
            double carbonFootprint,
            double shadowCost,
            int ecoScore,
            double waterFootprint,
            double energyConsumption,
            double transportEmission,
            int recyclingScore,
            int overallSustainabilityScore,
            String sdg12Impact,
            String sdg13Impact,
            String sdg9Impact
    ) {
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.carbonFootprint = carbonFootprint;
        this.shadowCost = shadowCost;
        this.ecoScore = ecoScore;
        this.waterFootprint = waterFootprint;
        this.energyConsumption = energyConsumption;
        this.transportEmission = transportEmission;
        this.recyclingScore = recyclingScore;
        this.overallSustainabilityScore = overallSustainabilityScore;
        this.sdg12Impact = sdg12Impact;
        this.sdg13Impact = sdg13Impact;
        this.sdg9Impact = sdg9Impact;
        this.recommendations = List.of();
    }

}
