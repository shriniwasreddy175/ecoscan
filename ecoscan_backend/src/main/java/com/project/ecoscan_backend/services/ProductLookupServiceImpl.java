package com.project.ecoscan_backend.services;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import com.project.ecoscan_backend.dtos.ScannedProductDTO;
import com.project.ecoscan_backend.utils.MaterialNormalizer;
import com.project.ecoscan_backend.utils.OpenFoodFactsParser;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ProductLookupServiceImpl implements ProductLookupService {

    private static final String OFF_BASE = "https://world.openfoodfacts.org";
    private static final String SOURCE   = "OPEN_FOOD_FACTS";

    private final RestClient restClient;

    public ProductLookupServiceImpl() {
        this.restClient = RestClient.builder()
                .baseUrl(OFF_BASE)
                .defaultHeader("User-Agent", "EcoScan/1.0 (contact@ecoscan.app)")
                .build();
    }

    // -------------------------------------------------------------------------
    // Barcode lookup
    // -------------------------------------------------------------------------

    @Override
    @SuppressWarnings("unchecked")
    public ScannedProductDTO lookupByBarcode(String barcode) {
        if (barcode == null || barcode.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Barcode must not be blank");
        }

        log.info("Looking up barcode: {}", barcode);

        Map<String, Object> response;
        try {
            response = restClient.get()
                    .uri("/api/v0/product/{barcode}.json", barcode)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Open Food Facts barcode lookup failed: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not reach Open Food Facts API");
        }

        if (response == null) return null;

        // OFF returns status=0 when the product is not found
        Object status = response.get("status");
        if (Integer.valueOf(0).equals(status) || "0".equals(String.valueOf(status))) {
            return null;
        }

        Map<String, Object> product = (Map<String, Object>) response.get("product");
        if (product == null) return null;

        return mapToDTO(product, barcode);
    }

    // -------------------------------------------------------------------------
    // Name search
    // -------------------------------------------------------------------------

    @Override
    @SuppressWarnings("unchecked")
    public List<ScannedProductDTO> searchByName(String name) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Search name must not be blank");
        }

        log.info("Searching products by name: {}", name);

        Map<String, Object> response;
        try {
            response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/cgi/search.pl")
                            .queryParam("search_terms", name)
                            .queryParam("json", "1")
                            .queryParam("page_size", "5")
                            .queryParam("fields",
                                    "product_name,categories_tags,quantity,packaging," +
                                    "countries_tags,image_url,code")
                            .build())
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Open Food Facts name search failed: {}", e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not reach Open Food Facts API");
        }

        if (response == null) return Collections.emptyList();

        Object productsRaw = response.get("products");
        if (!(productsRaw instanceof List<?> productList)) return Collections.emptyList();

        return productList.stream()
                .filter(p -> p instanceof Map)
                .map(p -> mapToDTO((Map<String, Object>) p, null))
                .filter(dto -> dto.getName() != null && !dto.getName().isBlank())
                .toList();
    }

    // -------------------------------------------------------------------------
    // Shared mapping logic
    // -------------------------------------------------------------------------

    private ScannedProductDTO mapToDTO(Map<String, Object> product, String barcode) {

        // --- Name ---
        String name = OpenFoodFactsParser.getString(product, "product_name");

        // --- Category: first tag from categories_tags ---
        String category = null;
        Object catRaw = product.get("categories_tags");
        if (catRaw instanceof List<?> catList && !catList.isEmpty()) {
            category = OpenFoodFactsParser.stripTagPrefix(String.valueOf(catList.get(0)));
        }

        // --- Weight ---
        String quantityRaw = OpenFoodFactsParser.getString(product, "quantity");
        Double weight = OpenFoodFactsParser.parseWeightKg(quantityRaw);

        // --- Material ---
        String packagingRaw = OpenFoodFactsParser.getString(product, "packaging");
        String materialRaw  = OpenFoodFactsParser.extractMaterial(packagingRaw);
        String material     = (materialRaw != null)
                ? MaterialNormalizer.normalize(materialRaw)
                : null;

        // --- Transport distance ---
        String countriesRaw = null;
        Object countriesObj = product.get("countries_tags");
        if (countriesObj instanceof List<?> countriesList && !countriesList.isEmpty()) {
            countriesRaw = String.valueOf(countriesList.get(0));
        }
        Double transport = OpenFoodFactsParser.estimateTransportDistance(countriesRaw);

        // --- Image ---
        String imageUrl = OpenFoodFactsParser.getString(product, "image_url");

        // --- Barcode fallback from product map (name search returns "code") ---
        String resolvedBarcode = (barcode != null)
                ? barcode
                : OpenFoodFactsParser.getString(product, "code");

        // --- Data completeness flag ---
        boolean complete = name != null && !name.isBlank()
                && weight != null
                && material != null;

        return ScannedProductDTO.builder()
                .barcode(resolvedBarcode)
                .name(name)
                .category(category)
                .weight(weight)
                .material(material)
                .packagingRaw(packagingRaw)
                .estimatedTransportDistance(transport)
                .imageUrl(imageUrl)
                .dataComplete(complete)
                .source(SOURCE)
                .build();
    }
}
