package com.project.ecoscan_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Returned by the /lookup endpoint.
 * Contains pre-filled product data sourced from Open Food Facts.
 * The client should display this in an editable form before submitting to /analyze.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScannedProductDTO {

    /** Barcode used for the lookup (null for name searches). */
    private String barcode;

    private String name;
    private String category;

    /** Weight in kg. Null if OFF did not provide parseable quantity. */
    private Double weight;

    /** Normalized material string (e.g. "Plastic", "Glass"). Null if not found. */
    private String material;

    /** Raw packaging text from OFF, for display purposes. */
    private String packagingRaw;

    /** Estimated transport distance in km based on origin country. */
    private Double estimatedTransportDistance;

    /** Product image URL from Open Food Facts. */
    private String imageUrl;

    /**
     * True when name, weight, and material are all present.
     * False means the user should fill in the missing fields before analyzing.
     */
    private boolean dataComplete;

    /** Always "OPEN_FOOD_FACTS" for traceability. */
    private String source;
}
