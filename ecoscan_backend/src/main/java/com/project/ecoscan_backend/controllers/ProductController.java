package com.project.ecoscan_backend.controllers;

import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.services.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ecoscan/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/analyze")
    public SustainabilityReportDTO analyze(@RequestBody Product product) {
        return productService.analyzeProduct(product);
    }
}
