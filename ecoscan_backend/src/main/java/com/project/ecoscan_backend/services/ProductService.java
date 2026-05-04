package com.project.ecoscan_backend.services;

import java.util.List;

import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;

public interface ProductService {
    SustainabilityReportDTO analyzeProduct(Product product, Long userId);
    List<ProductHistoryItemDTO> getHistory(int limit, Long userId);
    SustainabilityReportDTO getReportByProductId(Long productId);
    List<SustainabilityReportDTO> compareProducts(List<Long> productIds);
}
