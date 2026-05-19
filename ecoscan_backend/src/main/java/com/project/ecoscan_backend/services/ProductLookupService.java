package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.dtos.ScannedProductDTO;

import java.util.List;

public interface ProductLookupService {

    /**
     * Looks up a single product by its barcode (EAN-13, UPC, etc.)
     * using the Open Food Facts API.
     *
     * @param barcode the product barcode
     * @return pre-filled ScannedProductDTO, or null if not found
     */
    ScannedProductDTO lookupByBarcode(String barcode);

    /**
     * Searches for products by name using the Open Food Facts search API.
     * Returns up to 5 results.
     *
     * @param name the product name to search for
     * @return list of matching ScannedProductDTOs (may be empty)
     */
    List<ScannedProductDTO> searchByName(String name);
}
