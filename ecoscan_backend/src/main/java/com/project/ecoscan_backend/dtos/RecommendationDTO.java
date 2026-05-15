package com.project.ecoscan_backend.dtos;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
public class RecommendationDTO {
    private String title;
    private String priority;
    private String because;
    private String expectedImpact;
    private int potentialScoreGain;
    private List<String> actionSteps;

    @Setter
    private String rewrittenExplanation;

    public RecommendationDTO(String title, String priority, String because, String expectedImpact, int potentialScoreGain, List<String> actionSteps) {
        this.title = title;
        this.priority = priority;
        this.because = because;
        this.expectedImpact = expectedImpact;
        this.potentialScoreGain = potentialScoreGain;
        this.actionSteps = actionSteps;
    }
}
