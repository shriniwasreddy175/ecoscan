package com.project.ecoscan_backend.utils;

public class MaterialNormalizer {

    public static String normalize(String input) {
        if (input == null) return null;

        String material = input.toLowerCase();

        if (material.contains("cotton")) return "Cotton";
        if (material.contains("polyester")) return "Polyester";
        if (material.contains("steel")) return "Steel";
        if (material.contains("plastic")) return "Plastic";
        if (material.contains("wood")) return "Wood";

        return input; // fallback
    }

}
