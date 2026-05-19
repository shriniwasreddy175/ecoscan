package com.project.ecoscan_backend.dtos;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Full sustainability report returned by /analyze and /report endpoints.
 *
 * weight, material, and transportDistance are the raw product inputs —
 * they are included so the frontend What-if Simulator can initialise
 * its controls with the actual values that were submitted, rather than
 * falling back to defaults.
 */
@Getter
@NoArgsConstructor
public class SustainabilityReportDTO {

    private Long productId;
    private String productName;
    private String category;

    // Raw product inputs — needed by the What-if Simulator
    @Setter private Double weight;
    @Setter private String material;
    @Setter private Double transportDistance;

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

    @Setter private List<RecommendationDTO> recommendations;

    // -------------------------------------------------------------------------
    // Full constructor used by ProductServiceImpl
    // -------------------------------------------------------------------------

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
            String sdg9Impact,
            List<RecommendationDTO> recommendations
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
        this.recommendations = recommendations != null ? recommendations : List.of();
    }

    // -------------------------------------------------------------------------
    // Legacy constructor (no recommendations) — kept for backward compatibility
    // -------------------------------------------------------------------------

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
        this(productId, productName, category,
                carbonFootprint, shadowCost, ecoScore,
                waterFootprint, energyConsumption, transportEmission,
                recyclingScore, overallSustainabilityScore,
                sdg12Impact, sdg13Impact, sdg9Impact,
                List.of());
    }
}
