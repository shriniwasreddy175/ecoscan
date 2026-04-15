package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CarbonFactorService carbonFactorService;
    private final CarbonCalculationService carbonCalculationService;
    private final WaterFootprintService waterFootprintService;
    private final EnergyConsumptionService energyConsumptionService;
    private final TransportImpactService transportImpactService;
    private final RecyclingImpactService recyclingImpactService;
    private final SustainabilityIndexService sustainabilityIndexService;
    private final SDGImpactService sdgImpactService;

    @Override
    public SustainabilityReportDTO analyzeProduct(Product product) {

        var factor = carbonFactorService
                .getByMaterial(product.getMaterial())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Material not supported"));

        double carbon = carbonCalculationService.calculateCarbon(product.getWeight(), factor.getEmissionPerKg());

        double shadowCost = carbonCalculationService.calculateShadowCost(carbon);

        int ecoScore = carbonCalculationService.calculateEcoScore(carbon);

        double water = waterFootprintService
                .calculateWaterFootprint(product.getWeight(), product.getMaterial());

        double energy = energyConsumptionService
                .calculateEnergy(product.getWeight());

        double transport = transportImpactService
                .calculateTransportEmission(product.getTransportDistance());

        int recyclingScore = recyclingImpactService
                .calculateRecyclingScore(product.getMaterial());

        int overallScore = sustainabilityIndexService
                .calculateOverallScore(carbon, water, energy, transport, recyclingScore);

        String sdg13 = sdgImpactService.calculateSDG13(carbon);
        String sdg12 = sdgImpactService.calculateSDG12(ecoScore);
        String sdg9 = sdgImpactService.calculateSDG9(shadowCost);

        product.setCarbonFootprint(carbon);
        product.setShadowCost(shadowCost);
        product.setEcoScore(ecoScore);

        Product savedProduct = productRepository.save(product);

        return new SustainabilityReportDTO(
                savedProduct.getId(),
                savedProduct.getName(),
                carbon,
                shadowCost,
                ecoScore,
                water,
                energy,
                transport,
                recyclingScore,
                overallScore,
                sdg12,
                sdg13,
                sdg9
        );
    }
}
