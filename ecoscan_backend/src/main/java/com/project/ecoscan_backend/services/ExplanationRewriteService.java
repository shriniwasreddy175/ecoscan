package com.project.ecoscan_backend.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.ecoscan_backend.dtos.RecommendationDTO;

@Service
public class ExplanationRewriteService {

    public void rewriteRecommendations(List<RecommendationDTO> recommendations) {
        if (recommendations == null) return;

        for (RecommendationDTO r : recommendations) {
            StringBuilder sb = new StringBuilder();
            sb.append(r.getTitle()).append(". ");
            if (r.getBecause() != null && !r.getBecause().isBlank()) {
                sb.append("In short: ").append(r.getBecause()).append(" ");
            }
            if (r.getExpectedImpact() != null && !r.getExpectedImpact().isBlank()) {
                sb.append("Expected impact: ").append(r.getExpectedImpact()).append(" ");
            }
            if (r.getActionSteps() != null && !r.getActionSteps().isEmpty()) {
                sb.append("Suggested steps: ");
                for (int i = 0; i < Math.min(3, r.getActionSteps().size()); i++) {
                    sb.append(r.getActionSteps().get(i));
                    if (i < Math.min(3, r.getActionSteps().size()) - 1) sb.append("; ");
                }
                sb.append(".");
            }

            r.setRewrittenExplanation(sb.toString().trim());
        }
    }
}
