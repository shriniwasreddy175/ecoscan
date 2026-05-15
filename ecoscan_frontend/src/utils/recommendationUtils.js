function toFixed(value) {
  return Number.isFinite(value) ? Number(value).toFixed(2) : "0.00";
}

function safeMaterial(material) {
  return material && String(material).trim() ? material : "current material";
}

import { rewriteRecommendation } from "./explanationUtils";

export function generateRecommendations(report = {}) {
  const carbon = Number(report.carbonFootprint ?? 0);
  const water = Number(report.waterFootprint ?? report.water ?? 0);
  const energy = Number(report.energyConsumption ?? report.energy ?? 0);
  const transport = Number(report.transportEmission ?? report.transport ?? 0);
  const recyclingScore = Number(report.recyclingScore ?? 0);
  const transportDistance = Number(report.transportDistance ?? 0);
  const ecoScore = Number(report.ecoScore ?? 0);
  const material = safeMaterial(report.material);

  const recommendations = [];

  if (carbon >= 8) {
    recommendations.push({
      title: "Switch to lower-emission material",
      priority: "High",
      because: `Carbon footprint is ${toFixed(carbon)} kg CO2e, which is a major impact driver.`,
      expectedImpact:
        "Can reduce direct product emissions significantly and improve climate impact (SDG 13).",
      potentialScoreGain: 14,
      actionSteps: [
        `Evaluate recycled or bio-based alternatives for ${material}.`,
        "Pilot one low-carbon material variant for the same product.",
        "Re-run EcoScan analysis and compare before/after carbon metrics.",
      ],
    });
  }

  if (transport >= 3 || transportDistance >= 200) {
    recommendations.push({
      title: "Reduce transport distance and optimize logistics",
      priority: "High",
      because: `Transport emission is ${toFixed(transport)} kg CO2e with distance ${toFixed(transportDistance)} km.`,
      expectedImpact:
        "Can lower logistics emissions and improve overall sustainability score quickly.",
      potentialScoreGain: 12,
      actionSteps: [
        "Prefer regional suppliers where feasible.",
        "Consolidate shipments to reduce partial-load transport.",
        "Choose lower-emission freight options for routine deliveries.",
      ],
    });
  }

  if (recyclingScore <= 40) {
    recommendations.push({
      title: "Improve recyclability and end-of-life design",
      priority: "High",
      because: `Recycling score is ${recyclingScore}, indicating poor recovery potential.`,
      expectedImpact: "Improves circularity performance and SDG 12 alignment.",
      potentialScoreGain: 10,
      actionSteps: [
        "Use mono-material or easily separable components.",
        "Avoid mixed composites where possible.",
        "Add clear recycling instructions on packaging and product pages.",
      ],
    });
  }

  if (energy >= 10) {
    recommendations.push({
      title: "Lower manufacturing energy intensity",
      priority: "Medium",
      because: `Energy consumption is ${toFixed(energy)} kWh for this product profile.`,
      expectedImpact: "Can reduce operational footprint and long-term production cost.",
      potentialScoreGain: 8,
      actionSteps: [
        "Review process steps with highest energy draw.",
        "Prioritize efficiency upgrades for high-usage equipment.",
        "Track energy per unit and set monthly reduction targets.",
      ],
    });
  }

  if (water >= 1000) {
    recommendations.push({
      title: "Adopt water-saving process improvements",
      priority: "Medium",
      because: `Water footprint is ${toFixed(water)} L, which is above efficient benchmarks.`,
      expectedImpact:
        "Reduces water stress impact and supports stronger sustainability compliance.",
      potentialScoreGain: 7,
      actionSteps: [
        "Audit water-intensive steps in material processing.",
        "Introduce reuse/recirculation where possible.",
        "Set water KPI per unit and review weekly.",
      ],
    });
  }

  if (ecoScore < 60) {
    recommendations.push({
      title: "Run an eco-score recovery plan",
      priority: "Medium",
      because: `Eco score is ${ecoScore}, signaling room for balanced improvements.`,
      expectedImpact: "Raises baseline sustainability quality across multiple metrics.",
      potentialScoreGain: 9,
      actionSteps: [
        "Prioritize top two high-impact fixes from this list.",
        "Track score improvement after each change.",
        "Set an internal target: +10 eco points in the next revision cycle.",
      ],
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      title: "Maintain current design and monitor trend",
      priority: "Low",
      because: "Current profile is relatively balanced across core metrics.",
      expectedImpact:
        "Helps preserve performance while preventing regressions over time.",
      potentialScoreGain: 4,
      actionSteps: [
        "Set quarterly re-analysis reminders.",
        "Validate suppliers against sustainability commitments.",
        "Keep tracking carbon and recyclability for new batches.",
      ],
    });
  }

  const top = recommendations.sort((a, b) => b.potentialScoreGain - a.potentialScoreGain).slice(0, 3);
  return top.map((r) => ({ ...r, rewrittenExplanation: rewriteRecommendation(r) }));
}

