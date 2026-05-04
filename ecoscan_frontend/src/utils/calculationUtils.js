/**
 * Local calculation utilities for non-logged-in users
 * Mimics backend calculation logic
 */

/**
 * Calculate water footprint based on weight and material
 * Formula: weight * material_factor
 */
export function calculateWaterFootprint(weight, material) {
  if (!weight) return 0;

  const materialFactors = {
    polyester: 1000, // liters per kg
    cotton: 10000,
    wool: 4000,
    silk: 2700,
    linen: 1800,
    nylon: 1200,
    acrylic: 800,
    leather: 15000,
    plastic: 600,
    rubber: 500,
    metal: 700,
    glass: 300,
    paper: 300,
    wood: 200,
    ceramic: 400,
  };

  const normalizedMaterial = material?.toLowerCase().trim() || "polyester";
  const factor = materialFactors[normalizedMaterial] || 1000; // default to polyester

  return weight * factor;
}

/**
 * Calculate energy consumption based on weight
 * Formula: weight * 15 kWh/kg (average)
 */
export function calculateEnergy(weight) {
  if (!weight) return 0;
  return weight * 15; // kWh
}

/**
 * Calculate transport emission based on distance
 * Formula: distance * 0.12 kg CO2/km (average for road transport)
 */
export function calculateTransportEmission(distance) {
  if (!distance) return 0;
  return distance * 0.12; // kg CO2
}

/**
 * Calculate carbon footprint
 * Formula: weight * emission_per_kg from material
 */
export function calculateCarbon(weight, emissionPerKg = 10) {
  if (!weight) return 0;
  return weight * emissionPerKg;
}

/**
 * Calculate shadow cost (environmental cost)
 * Formula: carbon * $50 per ton
 */
export function calculateShadowCost(carbon) {
  if (!carbon) return 0;
  return (carbon / 1000) * 50; // Convert kg to tons and multiply by price per ton
}

/**
 * Calculate eco score
 * Formula: 100 - (carbon / max_carbon) * 100
 */
export function calculateEcoScore(carbon) {
  if (!carbon) return 100;
  const maxCarbon = 50; // kg
  return Math.max(0, Math.min(100, 100 - (carbon / maxCarbon) * 100));
}

/**
 * Calculate recycling score based on material
 * Higher for recyclable materials
 */
export function calculateRecyclingScore(material) {
  const recyclingScores = {
    polyester: 40,
    cotton: 80,
    wool: 85,
    silk: 70,
    linen: 90,
    nylon: 30,
    acrylic: 20,
    leather: 50,
    plastic: 35,
    rubber: 40,
    metal: 95,
    glass: 100,
    paper: 100,
    wood: 90,
    ceramic: 85,
  };

  const normalizedMaterial = material?.toLowerCase().trim() || "polyester";
  return recyclingScores[normalizedMaterial] || 50; // default to medium
}

/**
 * Calculate overall sustainability score
 * Weighted average of all metrics
 */
export function calculateOverallScore(carbon, water, energy, transport, recyclingScore) {
  // Normalize metrics to 0-100 scale
  const carbonScore = Math.max(0, 100 - (carbon / 50) * 100);
  const waterScore = Math.max(0, 100 - (water / 50000) * 100);
  const energyScore = Math.max(0, 100 - (energy / 100) * 100);
  const transportScore = Math.max(0, 100 - (transport / 100) * 100);

  // Weighted average
  const weights = {
    carbon: 0.3,
    water: 0.2,
    energy: 0.2,
    transport: 0.15,
    recycling: 0.15,
  };

  const overall =
    carbonScore * weights.carbon +
    waterScore * weights.water +
    energyScore * weights.energy +
    transportScore * weights.transport +
    recyclingScore * weights.recycling;

  return Math.round(overall);
}
