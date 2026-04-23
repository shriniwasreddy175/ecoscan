package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.dtos.ProductHistoryItemDTO;
import com.project.ecoscan_backend.dtos.SustainabilityReportDTO;
import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.repositories.ProductRepository;
import com.project.ecoscan_backend.utils.MaterialNormalizer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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

        product.setCarbonFootprint(carbon);
        product.setShadowCost(shadowCost);
        product.setEcoScore(ecoScore);

        Product savedProduct = productRepository.save(product);

        return buildReport(savedProduct, water, energy, transport, recyclingScore, overallScore, sdg12, sdg13, sdg9);
    }

    @Override
    public List<ProductHistoryItemDTO> getHistory(int limit) {
        int safeLimit = Math.min(100, Math.max(1, limit));
        PageRequest pageRequest = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"));

        return productRepository.findAllByOrderByCreatedAtDesc(pageRequest).stream()
                .map(product -> {
                    SustainabilityReportDTO report = buildReportFromProduct(product);
                    return new ProductHistoryItemDTO(
                            product.getId(),
                            product.getName(),
                            product.getCategory(),
                            product.getMaterial(),
                            product.getEcoScore(),
                            report.getOverallSustainabilityScore(),
                            product.getCreatedAt()
                    );
                })
                .toList();
    }

    @Override
    public SustainabilityReportDTO getReportByProductId(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        return buildReportFromProduct(product);
    }

    private SustainabilityReportDTO buildReportFromProduct(Product product) {
        double water = waterFootprintService.calculateWaterFootprint(product.getWeight(), product.getMaterial());
        double energy = energyConsumptionService.calculateEnergy(product.getWeight());
        double transport = transportImpactService.calculateTransportEmission(product.getTransportDistance());
        int recyclingScore = recyclingImpactService.calculateRecyclingScore(product.getMaterial());

        double carbon = product.getCarbonFootprint() == null ? 0 : product.getCarbonFootprint();
        double shadowCost = product.getShadowCost() == null ? 0 : product.getShadowCost();
        int ecoScore = product.getEcoScore() == null ? 0 : product.getEcoScore();

        int overallScore = sustainabilityIndexService.calculateOverallScore(carbon, water, energy, transport, recyclingScore);
        String sdg12 = sdgImpactService.calculateSDG12(ecoScore);
        String sdg13 = sdgImpactService.calculateSDG13(carbon);
        String sdg9 = sdgImpactService.calculateSDG9(shadowCost);

        return buildReport(product, water, energy, transport, recyclingScore, overallScore, sdg12, sdg13, sdg9);
    }

    private SustainabilityReportDTO buildReport(Product product,
                                                double water,
                                                double energy,
                                                double transport,
                                                int recyclingScore,
                                                int overallScore,
                                                String sdg12,
                                                String sdg13,
                                                String sdg9) {
        return new SustainabilityReportDTO(
                product.getId(),
                product.getName(),
                product.getCarbonFootprint() == null ? 0 : product.getCarbonFootprint(),
                product.getShadowCost() == null ? 0 : product.getShadowCost(),
                product.getEcoScore() == null ? 0 : product.getEcoScore(),
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
