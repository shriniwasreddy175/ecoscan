package com.project.ecoscan_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProductHistoryItemDTO {
    private Long productId;
    private String productName;
    private String category;
    private String material;
    private Integer ecoScore;
    private Integer overallSustainabilityScore;
    private LocalDateTime createdAt;
}
