package com.project.ecoscan_backend.services;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.repositories.ProductRepository;
import com.project.ecoscan_backend.repositories.UserRepository;
import com.project.ecoscan_backend.utils.MaterialNormalizer;

import lombok.RequiredArgsConstructor;

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
        private final RecommendationService recommendationService;

    private final UserRepository userRepository;

    @Override
    public SustainabilityReportDTO analyzeProduct(Product product, String userId) {

        // Link product to user if userId provided
        if (userId != null) {
            var user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "User not found with user_id: " + userId
                    ));
            product.setUser(user);
        }

        String normalizedMaterial = MaterialNormalizer.normalize(product.getMaterial());

        var factor = carbonFactorService
                .getByMaterial(normalizedMaterial)
                .orElseThrow(() -> new RuntimeException("Material not supported: " + product.getMaterial()));

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

        var recommendations = recommendationService.generateRecommendations(
                carbon,
                water,
                energy,
                transport,
                recyclingScore,
                product.getMaterial(),
                product.getTransportDistance(),
                ecoScore
        );

        product.setCarbonFootprint(carbon);
        product.setShadowCost(shadowCost);
        product.setEcoScore(ecoScore);

        Product savedProduct = productRepository.save(product);

        return new SustainabilityReportDTO(
                savedProduct.getId(),
                savedProduct.getName(),
                savedProduct.getCategory(),
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
                sdg9,
                recommendations
        );
    }

    @Override
    public List<ProductHistoryItemDTO> getHistory(int limit, String userId) {
        int safeLimit = Math.max(1, Math.min(limit, 200));

        var productsStream = (userId != null)
                ? productRepository.findAllByUserUserIdOrderByIdDesc(userId, PageRequest.of(0, safeLimit)).stream()
                : productRepository.findAllByOrderByIdDesc(PageRequest.of(0, safeLimit)).stream();

        return productsStream
                .map(product -> {
                    SustainabilityReportDTO report = buildReportFromSavedProduct(product);

                    return new ProductHistoryItemDTO(
                            product.getId(),
                            product.getName(),
                            product.getCategory(),
                            product.getCreatedAt(),
                            report.getOverallSustainabilityScore(),
                            report.getEcoScore(),
                            report.getCarbonFootprint()
                    );
                })
                .toList();
    }

    @Override
    public SustainabilityReportDTO getReportByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found with id: " + productId
                ));

        return buildReportFromSavedProduct(product);
    }

    @Override
    public List<SustainabilityReportDTO> compareProducts(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product IDs list cannot be empty.");
        }

        int limit = Math.min(productIds.size(), 50);
        List<Long> safeIds = productIds.stream().limit(limit).toList();

        return safeIds.stream()
                .map(id -> {
                    try {
                        return getReportByProductId(id);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(report -> report != null)
                .toList();
    }

    private SustainabilityReportDTO buildReportFromSavedProduct(Product product) {
        Double carbonBoxed = product.getCarbonFootprint();
        double carbon = (carbonBoxed != null)
                ? carbonBoxed
                : calculateCarbonFromMaterial(product);

        Double shadowCostBoxed = product.getShadowCost();
        double shadowCost = (shadowCostBoxed != null)
                ? shadowCostBoxed
                : carbonCalculationService.calculateShadowCost(carbon);

        Integer ecoScoreBoxed = product.getEcoScore();
        int ecoScore = (ecoScoreBoxed != null)
                ? ecoScoreBoxed
                : carbonCalculationService.calculateEcoScore(carbon);

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

        var recommendations = recommendationService.generateRecommendations(
                carbon,
                water,
                energy,
                transport,
                recyclingScore,
                product.getMaterial(),
                product.getTransportDistance(),
                ecoScore
        );

        return new SustainabilityReportDTO(
                product.getId(),
                product.getName(),
                product.getCategory(),
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
                                sdg9,
                                recommendations
        );
    }

    private double calculateCarbonFromMaterial(Product product) {
        String normalizedMaterial = MaterialNormalizer.normalize(product.getMaterial());

        var factor = carbonFactorService
                .getByMaterial(normalizedMaterial)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Material not supported: " + product.getMaterial()
                ));

        return carbonCalculationService.calculateCarbon(product.getWeight(), factor.getEmissionPerKg());
    }
}
