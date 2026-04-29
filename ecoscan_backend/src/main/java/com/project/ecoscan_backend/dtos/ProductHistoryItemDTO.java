package com.project.ecoscan_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductHistoryItemDTO {
    private Long productId;
    private String productName;
    private String category;
    private LocalDateTime createdAt;
    private Integer overallSustainabilityScore;
    private Integer ecoScore;
    private Double carbonFootprint;
}