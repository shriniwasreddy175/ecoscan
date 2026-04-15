package com.project.ecoscan_backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String category;
    private Double price;
    private Double weight;
    private String material;
    private Double transportDistance;

    @Column(length = 1000)
    private String description;

    private Double carbonFootprint;
    private Double shadowCost;
    private Integer ecoScore;
}
