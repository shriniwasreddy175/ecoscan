package com.project.ecoscan_backend.services;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.project.ecoscan_backend.dtos.RecommendationDTO;

@Service
public class RecommendationService {

    public List<RecommendationDTO> generateRecommendations(
            double carbon,
            double water,
            double energy,
            double transport,
            int recyclingScore,
            String material,
            double transportDistance,
            int ecoScore
    ) {
        List<RecommendationDTO> recommendations = new ArrayList<>();

        if (carbon >= 8) {
            recommendations.add(new RecommendationDTO(
                    "Switch to lower-emission material",
                    "High",
                    "Carbon footprint is " + round(carbon) + " kg CO2e, which is a major impact driver.",
                    "Can reduce direct product emissions significantly and improve climate impact (SDG 13).",
                    14,
                    List.of(
                            "Evaluate recycled or bio-based alternatives for " + safe(material) + ".",
                            "Pilot one low-carbon material variant for the same product.",
                            "Re-run EcoScan analysis and compare before/after carbon metrics."
                    )
            ));
        }

        if (transport >= 3 || transportDistance >= 200) {
            recommendations.add(new RecommendationDTO(
                    "Reduce transport distance and optimize logistics",
                    "High",
                    "Transport emission is " + round(transport) + " kg CO2e with distance " + round(transportDistance) + " km.",
                    "Can lower logistics emissions and improve overall sustainability score quickly.",
                    12,
                    List.of(
                            "Prefer regional suppliers where feasible.",
                            "Consolidate shipments to reduce partial-load transport.",
                            "Choose lower-emission freight options for routine deliveries."
                    )
            ));
        }

        if (recyclingScore <= 40) {
            recommendations.add(new RecommendationDTO(
                    "Improve recyclability and end-of-life design",
                    "High",
                    "Recycling score is " + recyclingScore + ", indicating poor recovery potential.",
                    "Improves circularity performance and SDG 12 alignment.",
                    10,
                    List.of(
                            "Use mono-material or easily separable components.",
                            "Avoid mixed composites where possible.",
                            "Add clear recycling instructions on packaging and product pages."
                    )
            ));
        }

        if (energy >= 10) {
            recommendations.add(new RecommendationDTO(
                    "Lower manufacturing energy intensity",
                    "Medium",
                    "Energy consumption is " + round(energy) + " kWh for this product profile.",
                    "Can reduce operational footprint and long-term production cost.",
                    8,
                    List.of(
                            "Review process steps with highest energy draw.",
                            "Prioritize efficiency upgrades for high-usage equipment.",
                            "Track energy per unit and set monthly reduction targets."
                    )
            ));
        }

        if (water >= 1000) {
            recommendations.add(new RecommendationDTO(
                    "Adopt water-saving process improvements",
                    "Medium",
                    "Water footprint is " + round(water) + " L, which is above efficient benchmarks.",
                    "Reduces water stress impact and supports stronger sustainability compliance.",
                    7,
                    List.of(
                            "Audit water-intensive steps in material processing.",
                            "Introduce reuse/recirculation where possible.",
                            "Set water KPI per unit and review weekly."
                    )
            ));
        }

        if (ecoScore < 60) {
            recommendations.add(new RecommendationDTO(
                    "Run an eco-score recovery plan",
                    "Medium",
                    "Eco score is " + ecoScore + ", signaling room for balanced improvements.",
                    "Raises baseline sustainability quality across multiple metrics.",
                    9,
                    List.of(
                            "Prioritize top two high-impact fixes from this list.",
                            "Track score improvement after each change.",
                            "Publish internal target: +10 eco points in next revision cycle."
                    )
            ));
        }

        if (recommendations.isEmpty()) {
            recommendations.add(new RecommendationDTO(
                    "Maintain current design and monitor trend",
                    "Low",
                    "Current profile is relatively balanced across core metrics.",
                    "Helps preserve performance while preventing regressions over time.",
                    4,
                    List.of(
                            "Set quarterly re-analysis reminders.",
                            "Validate suppliers against sustainability commitments.",
                            "Keep tracking carbon and recyclability for new batches."
                    )
            ));
        }

        return recommendations.stream()
                .sorted(Comparator.comparingInt(RecommendationDTO::getPotentialScoreGain).reversed())
                .limit(3)
                .toList();
    }

    private static String round(double value) {
        return String.format("%.2f", value);
    }

    private static String safe(String material) {
        return (material == null || material.isBlank()) ? "current material" : material;
    }
}
