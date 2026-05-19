package com.project.ecoscan_backend.utils;

import java.util.Map;

/**
 * Utility methods for parsing raw Open Food Facts API response fields
 * into the types EcoScan needs.
 */
public class OpenFoodFactsParser {

    private OpenFoodFactsParser() {}

    /**
     * Parses a quantity string like "500g", "1.5 kg", "330 ml", "1L"
     * into a weight in kilograms.
     * Returns null if the string cannot be parsed.
     */
    public static Double parseWeightKg(String quantity) {
        if (quantity == null || quantity.isBlank()) return null;

        String q = quantity.toLowerCase().trim();

        try {
            if (q.contains("kg")) {
                String num = q.replace("kg", "").trim();
                return Double.parseDouble(num);
            }
            if (q.contains("g")) {
                String num = q.replace("g", "").trim();
                return Double.parseDouble(num) / 1000.0;
            }
            // Liquids: treat 1 ml ≈ 0.001 kg (water density approximation)
            if (q.contains("ml")) {
                String num = q.replace("ml", "").trim();
                return Double.parseDouble(num) / 1000.0;
            }
            if (q.contains("l")) {
                String num = q.replace("l", "").trim();
                return Double.parseDouble(num);
            }
        } catch (NumberFormatException ignored) {
            // fall through to null
        }
        return null;
    }

    /**
     * Extracts a human-readable material hint from the OFF packaging field.
     * Returns null if packaging is blank.
     * The result is intentionally left un-normalized so MaterialNormalizer
     * can handle it downstream.
     */
    public static String extractMaterial(String packaging) {
        if (packaging == null || packaging.isBlank()) return null;

        String p = packaging.toLowerCase();

        // Prefer the most specific match first
        if (p.contains("glass"))      return "Glass";
        if (p.contains("aluminium") || p.contains("aluminum")) return "Aluminium";
        if (p.contains("steel") || p.contains("tin")) return "Steel";
        if (p.contains("cardboard") || p.contains("carton")) return "Cardboard";
        if (p.contains("paper"))      return "Paper";
        if (p.contains("plastic") || p.contains("pet") || p.contains("hdpe")
                || p.contains("pp") || p.contains("pvc")) return "Plastic";
        if (p.contains("wood"))       return "Wood";
        if (p.contains("cotton"))     return "Cotton";

        // Return the raw value trimmed — MaterialNormalizer will handle it
        return packaging.trim();
    }

    /**
     * Estimates a transport distance in km based on the first country tag
     * returned by Open Food Facts (e.g. "en:france", "en:united-states").
     *
     * These are rough averages to a global distribution hub; the user can
     * always override the value before submitting to /analyze.
     */
    public static Double estimateTransportDistance(String countriesRaw) {
        if (countriesRaw == null || countriesRaw.isBlank()) return 500.0; // default

        String c = countriesRaw.toLowerCase();

        // Europe
        if (c.contains("france") || c.contains("germany") || c.contains("italy")
                || c.contains("spain") || c.contains("netherlands")
                || c.contains("belgium") || c.contains("poland")) return 300.0;

        // UK
        if (c.contains("united-kingdom") || c.contains("uk")) return 400.0;

        // North America
        if (c.contains("united-states") || c.contains("canada")) return 8000.0;

        // Asia
        if (c.contains("china"))  return 10000.0;
        if (c.contains("india"))  return 7000.0;
        if (c.contains("japan") || c.contains("south-korea")) return 9000.0;

        // South America
        if (c.contains("brazil") || c.contains("argentina")) return 9500.0;

        // Africa
        if (c.contains("south-africa") || c.contains("nigeria")) return 8500.0;

        return 500.0; // fallback
    }

    /**
     * Safely reads a nested string value from a Map<String, Object> response.
     * Returns null if the key is absent or the value is not a String.
     */
    public static String getString(Map<String, Object> map, String key) {
        if (map == null) return null;
        Object val = map.get(key);
        return (val instanceof String s) ? s : null;
    }

    /**
     * Strips the language prefix from an Open Food Facts tag.
     * e.g. "en:beverages" → "beverages", "fr:boissons" → "boissons"
     */
    public static String stripTagPrefix(String tag) {
        if (tag == null) return null;
        int colon = tag.indexOf(':');
        return (colon >= 0) ? tag.substring(colon + 1) : tag;
    }
}
