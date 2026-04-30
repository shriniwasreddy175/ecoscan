package com.project.ecoscan_backend.dtos;

import java.util.List;

public class ComparisonRequestDTO {
    private List<Long> productIds;

    public ComparisonRequestDTO() {}

    public ComparisonRequestDTO(List<Long> productIds) {
        this.productIds = productIds;
    }

    public List<Long> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }
}