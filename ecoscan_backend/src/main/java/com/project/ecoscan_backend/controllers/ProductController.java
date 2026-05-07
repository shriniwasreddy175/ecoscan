package com.project.ecoscan_backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.ecoscan_backend.dtos.ComparisonRequestDTO;
import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.services.ProductService;

@RestController
@RequestMapping("/ecoscan/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/analyze")
    public SustainabilityReportDTO analyze(@RequestBody Product product,
            @RequestParam(required = false) String userId) {
        return productService.analyzeProduct(product, userId);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ProductHistoryItemDTO>> getHistory(
            @RequestParam(defaultValue = "30") int limit, @RequestParam(required = false) String userId) {
        return ResponseEntity.ok(productService.getHistory(limit, userId));
    }

    @GetMapping("/{id}/report")
    public ResponseEntity<SustainabilityReportDTO> getProductReport(@PathVariable("id") Long id) {
        return ResponseEntity.ok(productService.getReportByProductId(id));
    }

    @PostMapping("/compare")
    public ResponseEntity<List<SustainabilityReportDTO>> compareProducts(
            @RequestBody ComparisonRequestDTO request) {
        return ResponseEntity.ok(productService.compareProducts(request.getProductIds()));
    }
}
