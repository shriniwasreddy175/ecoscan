package com.project.ecoscan_backend.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDTO {
    private String title;
    private String priority;
    private String because;
    private String expectedImpact;
    private int potentialScoreGain;
    private List<String> actionSteps;
}
