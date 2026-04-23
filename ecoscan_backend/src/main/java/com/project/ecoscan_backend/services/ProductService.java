package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;

import java.util.List;

public interface ProductService {
    SustainabilityReportDTO analyzeProduct(Product product);
    List<ProductHistoryItemDTO> getHistory(int limit);
    SustainabilityReportDTO getReportByProductId(Long productId);
}
