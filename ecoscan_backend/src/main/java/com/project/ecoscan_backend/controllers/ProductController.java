package com.project.ecoscan_backend.controllers;

import com.project.ecoscan_backend.dtos.ComparisonRequestDTO;
import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.services.ProductService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<List<ProductHistoryItemDTO>> getHistory(
            @RequestParam(defaultValue = "30") int limit) {
        return ResponseEntity.ok(productService.getHistory(limit));
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
