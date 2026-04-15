package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;

public interface ProductService {
    SustainabilityReportDTO analyzeProduct(Product product);
}
