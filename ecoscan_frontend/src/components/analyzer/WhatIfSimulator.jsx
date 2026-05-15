import { useMemo, useState } from "react";
import {
  calculateCarbon,
  calculateWaterFootprint,
  calculateEnergy,
  calculateTransportEmission,
  calculateEcoScore,
  calculateShadowCost,
  calculateRecyclingScore,
  calculateOverallScore,
} from "../../utils/calculationUtils";

function WhatIfSimulator({ initialReport }) {
  const [weight, setWeight] = useState(initialReport?.weight ?? initialReport?.weight ?? 1);
  const [material, setMaterial] = useState(initialReport?.material ?? "Polyester");
  const [distance, setDistance] = useState(initialReport?.transportDistance ?? initialReport?.transport ?? 0);

  const simulated = useMemo(() => {
    const w = Number(weight) || 0;
    const d = Number(distance) || 0;
    const normalizedMaterial = (material || "polyester").toLowerCase();

    const carbon = calculateCarbon(w, 10);
    const water = calculateWaterFootprint(w, normalizedMaterial);
    const energy = calculateEnergy(w);
    const transport = calculateTransportEmission(d);
    const recyclingScore = calculateRecyclingScore(normalizedMaterial);
    const ecoScore = calculateEcoScore(carbon);
    const shadowCost = calculateShadowCost(carbon);
    const overall = calculateOverallScore(carbon, water, energy, transport, recyclingScore);

    return {
      carbon,
      water,
      energy,
      transport,
      recyclingScore,
      ecoScore,
      shadowCost,
      overall,
    };
  }, [weight, material, distance]);

  const base = initialReport || {};

  const delta = {
    overall: (simulated.overall || 0) - (base.overallSustainabilityScore ?? 0),
    carbon: (simulated.carbon || 0) - (base.carbonFootprint ?? base.carbon ?? 0),
  };

  return (
    <div className="whatif-panel card">
      <div className="card-header">
        <span className="section-tag">What-if Simulator</span>
        <h4>Preview metric changes without saving</h4>
      </div>

      <div className="whatif-grid">
        <label>
          Weight (kg)
          <input type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>

        <label>
          Material
          <select value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option>Polyester</option>
            <option>Cotton</option>
            <option>Wool</option>
            <option>Silk</option>
            <option>Linen</option>
            <option>Nylon</option>
            <option>Plastic</option>
            <option>Metal</option>
          </select>
        </label>

        <label>
          Transport Distance (km)
          <input type="number" min="0" value={distance} onChange={(e) => setDistance(e.target.value)} />
        </label>
      </div>

      <div className="whatif-results">
        <div className="whatif-metric">
          <strong>Overall Score</strong>
          <div>{simulated.overall} <small className={delta.overall >= 0 ? 'delta-up' : 'delta-down'}>{delta.overall >=0 ? `+${delta.overall}` : delta.overall}</small></div>
        </div>

        <div className="whatif-metric">
          <strong>Carbon (kg CO2e)</strong>
          <div>{simulated.carbon.toFixed(2)} <small className={delta.carbon <= 0 ? 'delta-up' : 'delta-down'}>{delta.carbon <=0 ? `${delta.carbon.toFixed(2)}` : `+${delta.carbon.toFixed(2)}`}</small></div>
        </div>

        <div className="whatif-metric">
          <strong>Eco Score</strong>
          <div>{simulated.ecoScore}</div>
        </div>

        <div className="whatif-metric">
          <strong>Recycling Score</strong>
          <div>{simulated.recyclingScore}</div>
        </div>
      </div>
    </div>
  );
}

export default WhatIfSimulator;
