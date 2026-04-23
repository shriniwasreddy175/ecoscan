package com.project.ecoscan_backend.controllers;

import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.services.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/history")
    public List<ProductHistoryItemDTO> history(@RequestParam(defaultValue = "30") int limit) {
        return productService.getHistory(limit);
    }

    @GetMapping("/{productId}/report")
    public SustainabilityReportDTO report(@PathVariable Long productId) {
        return productService.getReportByProductId(productId);
    }
}
