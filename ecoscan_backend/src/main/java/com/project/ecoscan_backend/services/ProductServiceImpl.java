package com.project.ecoscan_backend.services;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.entities.User;
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

    // -------------------------------------------------------------------------
    // analyzeProduct
    // -------------------------------------------------------------------------

    @Override
    public SustainabilityReportDTO analyzeProduct(Product product, String userId) {

        if (userId != null) {
            var user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "User not found with user_id: " + userId));
            product.setUser(user);
        }

        String normalizedMaterial = MaterialNormalizer.normalize(product.getMaterial());

        var factor = carbonFactorService
                .getByMaterial(normalizedMaterial)
                .orElseThrow(() -> new RuntimeException(
                        "Material not supported: " + product.getMaterial()));

        double carbon      = carbonCalculationService.calculateCarbon(product.getWeight(), factor.getEmissionPerKg());
        double shadowCost  = carbonCalculationService.calculateShadowCost(carbon);
        int    ecoScore    = carbonCalculationService.calculateEcoScore(carbon);

        double water          = waterFootprintService.calculateWaterFootprint(product.getWeight(), product.getMaterial());
        double energy         = energyConsumptionService.calculateEnergy(product.getWeight());
        double transport      = transportImpactService.calculateTransportEmission(product.getTransportDistance());
        int    recyclingScore = recyclingImpactService.calculateRecyclingScore(product.getMaterial());
        int    overallScore   = sustainabilityIndexService.calculateOverallScore(carbon, water, energy, transport, recyclingScore);

        String sdg13 = sdgImpactService.calculateSDG13(carbon);
        String sdg12 = sdgImpactService.calculateSDG12(ecoScore);
        String sdg9  = sdgImpactService.calculateSDG9(shadowCost);

        var recommendations = recommendationService.generateRecommendations(
                carbon, water, energy, transport, recyclingScore,
                product.getMaterial(), product.getTransportDistance(), ecoScore);

        product.setCarbonFootprint(carbon);
        product.setShadowCost(shadowCost);
        product.setEcoScore(ecoScore);

        Product saved = productRepository.save(product);

        if (saved.getUser() != null) {
            User linkedUser = saved.getUser();
            linkedUser.setEcoPoints(linkedUser.getEcoPoints() + pointsForScore(overallScore));
            userRepository.save(linkedUser);
        }

        SustainabilityReportDTO report = new SustainabilityReportDTO(
                saved.getId(), saved.getName(), saved.getCategory(),
                carbon, shadowCost, ecoScore,
                water, energy, transport, recyclingScore, overallScore,
                sdg12, sdg13, sdg9, recommendations);

        // Attach raw inputs so the frontend What-if Simulator has the actual values
        report.setWeight(saved.getWeight());
        report.setMaterial(saved.getMaterial());
        report.setTransportDistance(saved.getTransportDistance());
        return report;
    }

    // -------------------------------------------------------------------------
    // getHistory
    // -------------------------------------------------------------------------

    @Override
    public List<ProductHistoryItemDTO> getHistory(int limit, String userId) {
        int safeLimit = Math.max(1, Math.min(limit, 200));

        var stream = (userId != null)
                ? productRepository.findAllByUserUserIdOrderByIdDesc(userId, PageRequest.of(0, safeLimit)).stream()
                : productRepository.findAllByOrderByIdDesc(PageRequest.of(0, safeLimit)).stream();

        return stream.map(product -> {
            SustainabilityReportDTO r = buildReportFromSavedProduct(product);
            return new ProductHistoryItemDTO(
                    product.getId(), product.getName(), product.getCategory(),
                    product.getCreatedAt(),
                    r.getOverallSustainabilityScore(), r.getEcoScore(), r.getCarbonFootprint());
        }).toList();
    }

    // -------------------------------------------------------------------------
    // getReportByProductId
    // -------------------------------------------------------------------------

    @Override
    public SustainabilityReportDTO getReportByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found with id: " + productId));
        return buildReportFromSavedProduct(product);
    }

    // -------------------------------------------------------------------------
    // compareProducts
    // -------------------------------------------------------------------------

    @Override
    public List<SustainabilityReportDTO> compareProducts(List<Long> productIds) {
        if (productIds == null || productIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product IDs list cannot be empty.");
        }
        return productIds.stream()
                .limit(50)
                .map(id -> {
                    try { return getReportByProductId(id); }
                    catch (Exception e) { return null; }
                })
                .filter(r -> r != null)
                .toList();
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private SustainabilityReportDTO buildReportFromSavedProduct(Product product) {
        Double carbonBoxed = product.getCarbonFootprint();
        double carbon = (carbonBoxed != null) ? carbonBoxed : calculateCarbonFromMaterial(product);

        Double shadowCostBoxed = product.getShadowCost();
        double shadowCost = (shadowCostBoxed != null)
                ? shadowCostBoxed
                : carbonCalculationService.calculateShadowCost(carbon);

        Integer ecoScoreBoxed = product.getEcoScore();
        int ecoScore = (ecoScoreBoxed != null)
                ? ecoScoreBoxed
                : carbonCalculationService.calculateEcoScore(carbon);

        double water          = waterFootprintService.calculateWaterFootprint(product.getWeight(), product.getMaterial());
        double energy         = energyConsumptionService.calculateEnergy(product.getWeight());
        double transport      = transportImpactService.calculateTransportEmission(product.getTransportDistance());
        int    recyclingScore = recyclingImpactService.calculateRecyclingScore(product.getMaterial());
        int    overallScore   = sustainabilityIndexService.calculateOverallScore(carbon, water, energy, transport, recyclingScore);

        String sdg13 = sdgImpactService.calculateSDG13(carbon);
        String sdg12 = sdgImpactService.calculateSDG12(ecoScore);
        String sdg9  = sdgImpactService.calculateSDG9(shadowCost);

        var recommendations = recommendationService.generateRecommendations(
                carbon, water, energy, transport, recyclingScore,
                product.getMaterial(), product.getTransportDistance(), ecoScore);

        SustainabilityReportDTO report = new SustainabilityReportDTO(
                product.getId(), product.getName(), product.getCategory(),
                carbon, shadowCost, ecoScore,
                water, energy, transport, recyclingScore, overallScore,
                sdg12, sdg13, sdg9, recommendations);

        // Attach raw inputs so the frontend What-if Simulator has the actual values
        report.setWeight(product.getWeight());
        report.setMaterial(product.getMaterial());
        report.setTransportDistance(product.getTransportDistance());
        return report;
    }

    private double calculateCarbonFromMaterial(Product product) {
        String normalizedMaterial = MaterialNormalizer.normalize(product.getMaterial());
        var factor = carbonFactorService
                .getByMaterial(normalizedMaterial)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Material not supported: " + product.getMaterial()));
        return carbonCalculationService.calculateCarbon(product.getWeight(), factor.getEmissionPerKg());
    }

    /** Mirrors the frontend gamificationUtils.getPointsForScore logic. */
    private int pointsForScore(int overallScore) {
        if (overallScore >= 80) return 20;
        if (overallScore >= 60) return 15;
        if (overallScore >= 40) return 10;
        if (overallScore >= 20) return 5;
        return 2;
    }
}
