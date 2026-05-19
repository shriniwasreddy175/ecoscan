package com.project.ecoscan_backend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
import com.project.ecoscan_backend.dtos.ScannedProductDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.services.ProductLookupService;
import com.project.ecoscan_backend.services.ProductService;

@RestController
@RequestMapping("/ecoscan/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;
    private final ProductLookupService productLookupService;

    public ProductController(ProductService productService,
                             ProductLookupService productLookupService) {
        this.productService = productService;
        this.productLookupService = productLookupService;
    }

    @PostMapping("/analyze")
    public SustainabilityReportDTO analyze(@RequestBody Product product,
            Authentication authentication) {
        String userId = null;
        if (authentication != null) {
            userId = authentication.getName();
        }
        return productService.analyzeProduct(product, userId);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ProductHistoryItemDTO>> getHistory(
            @RequestParam(defaultValue = "30") int limit,
            Authentication authentication) {
        String userId = null;
        if (authentication != null) {
            userId = authentication.getName();
        }
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

    /**
     * Lookup endpoint for barcode scan or product name search.
     *
     * Usage:
     *   GET /ecoscan/api/products/lookup?barcode=5449000000996
     *   GET /ecoscan/api/products/lookup?name=coca+cola
     *
     * Returns a pre-filled ScannedProductDTO (barcode) or a list of them (name).
     * The client should display the result in an editable form, then POST to /analyze.
     */
    @GetMapping("/lookup")
    public ResponseEntity<?> lookup(
            @RequestParam(required = false) String barcode,
            @RequestParam(required = false) String name) {

        if (barcode != null && !barcode.isBlank()) {
            ScannedProductDTO result = productLookupService.lookupByBarcode(barcode.trim());
            if (result == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(result);
        }

        if (name != null && !name.isBlank()) {
            List<ScannedProductDTO> results = productLookupService.searchByName(name.trim());
            return ResponseEntity.ok(results);
        }

        return ResponseEntity.badRequest()
                .body("Provide either 'barcode' or 'name' as a query parameter.");
    }
}
