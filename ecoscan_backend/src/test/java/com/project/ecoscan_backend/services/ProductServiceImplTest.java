package com.project.ecoscan_backend.services;

import com.project.ecoscan_backend.entities.Product;
import com.project.ecoscan_backend.repositories.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;
    @Mock
    private CarbonFactorService carbonFactorService;
    @Mock
    private CarbonCalculationService carbonCalculationService;
    @Mock
    private WaterFootprintService waterFootprintService;
    @Mock
    private EnergyConsumptionService energyConsumptionService;
    @Mock
    private TransportImpactService transportImpactService;
    @Mock
    private RecyclingImpactService recyclingImpactService;
    @Mock
    private SustainabilityIndexService sustainabilityIndexService;
    @Mock
    private SDGImpactService sdgImpactService;

    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        productService = new ProductServiceImpl(
                productRepository,
                carbonFactorService,
                carbonCalculationService,
                waterFootprintService,
                energyConsumptionService,
                transportImpactService,
                recyclingImpactService,
                sustainabilityIndexService,
                sdgImpactService
        );

        lenient().when(waterFootprintService.calculateWaterFootprint(anyDouble(), anyString())).thenReturn(1200.0);
        lenient().when(energyConsumptionService.calculateEnergy(anyDouble())).thenReturn(20.0);
        lenient().when(transportImpactService.calculateTransportEmission(anyDouble())).thenReturn(15.0);
        lenient().when(recyclingImpactService.calculateRecyclingScore(anyString())).thenReturn(60);
        lenient().when(sustainabilityIndexService.calculateOverallScore(anyDouble(), anyDouble(), anyDouble(), anyDouble(), anyInt()))
                .thenReturn(73);
        lenient().when(sdgImpactService.calculateSDG12(anyInt())).thenReturn("Responsible Consumption");
        lenient().when(sdgImpactService.calculateSDG13(anyDouble())).thenReturn("Moderate Impact");
        lenient().when(sdgImpactService.calculateSDG9(anyDouble())).thenReturn("Efficient Industry");
    }

    @Test
    void getHistoryReturnsMappedHistoryItems() {
        Product product = createProduct(101L, "Eco Bottle");
        when(productRepository.findAllByOrderByCreatedAtDesc(any())).thenReturn(List.of(product));

        var history = productService.getHistory(30);

        assertThat(history).hasSize(1);
        assertThat(history.get(0).getProductId()).isEqualTo(101L);
        assertThat(history.get(0).getProductName()).isEqualTo("Eco Bottle");
        assertThat(history.get(0).getOverallSustainabilityScore()).isEqualTo(73);
    }

    @Test
    void getReportByProductIdReturnsReconstructedReport() {
        Product product = createProduct(202L, "Organic Cotton Tee");
        when(productRepository.findById(202L)).thenReturn(Optional.of(product));

        var report = productService.getReportByProductId(202L);

        assertThat(report.getProductId()).isEqualTo(202L);
        assertThat(report.getProductName()).isEqualTo("Organic Cotton Tee");
        assertThat(report.getCarbonFootprint()).isEqualTo(3.4);
        assertThat(report.getOverallSustainabilityScore()).isEqualTo(73);
        assertThat(report.getSdg12Impact()).isEqualTo("Responsible Consumption");
    }

    @Test
    void getReportByProductIdThrowsWhenMissing() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getReportByProductId(999L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");
    }

    private Product createProduct(Long id, String name) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setCategory("Lifestyle");
        product.setMaterial("Cotton");
        product.setWeight(1.2);
        product.setTransportDistance(200.0);
        product.setCarbonFootprint(3.4);
        product.setShadowCost(0.17);
        product.setEcoScore(82);
        product.setCreatedAt(LocalDateTime.now());
        return product;
    }
}
