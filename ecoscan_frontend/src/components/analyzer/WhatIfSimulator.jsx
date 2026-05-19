import { useEffect, useMemo, useState } from "react";
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
  const getInitialWeight = (report) => report?.weight ?? 1;
  const getInitialMaterial = (report) => report?.material ?? "Polyester";
  const getInitialDistance = (report) => report?.transportDistance ?? 0;

  const [weight, setWeight] = useState(getInitialWeight(initialReport));
  const [material, setMaterial] = useState(getInitialMaterial(initialReport));
  const [distance, setDistance] = useState(getInitialDistance(initialReport));
  const [hasUserEdited, setHasUserEdited] = useState(false);

  const base = initialReport || {};

  const originalWeight = Number(base.weight ?? weight) || 0;
  const originalMaterial = String(base.material ?? material ?? "Polyester").trim().toLowerCase();
  const originalMaterialLabel = String(base.material ?? "").trim();
  const originalDistance = Number(base.transportDistance ?? distance) || 0;

  const defaultMaterialOptions = [
    "Polyester",
    "Cotton",
    "Wool",
    "Silk",
    "Linen",
    "Nylon",
    "Plastic",
    "Metal",
  ];

  const materialOptions = useMemo(() => {
    if (!originalMaterialLabel) return defaultMaterialOptions;

    const hasOriginal = defaultMaterialOptions.some(
      (m) => m.toLowerCase() === originalMaterialLabel.toLowerCase()
    );

    return hasOriginal
      ? defaultMaterialOptions
      : [originalMaterialLabel, ...defaultMaterialOptions];
  }, [originalMaterialLabel]);

  const materialEmissionFactors = {
    cotton: 2.1,
    polyester: 5.5,
    wool: 8.0,
    silk: 11.0,
    nylon: 6.5,
    acrylic: 7.0,
    denim: 3.5,
    "recycled plastic": 2.5,
    pvc: 6.0,
    polypropylene: 5.0,
    bioplastic: 1.8,
    plastic: 5.2,
    aluminium: 8.5,
    "recycled aluminium": 2.0,
    copper: 4.0,
    iron: 2.0,
    metal: 4.5,
    "stainless steel": 6.0,
    plywood: 1.2,
    mdf: 1.5,
    paper: 1.0,
    "recycled paper": 0.5,
    cardboard: 0.8,
    glass: 1.5,
    silicon: 3.0,
    lithium: 15.0,
    ceramic: 1.8,
    "packaging plastic": 5.5,
    "packaging paper": 1.0,
    rubber: 3.0,
    leather: 10.0,
    "synthetic leather": 6.5,
    fabric: 6.2,
    foam: 2.5,
  };

  const getEmissionPerKg = (selectedMaterial) => {
    const normalized = String(selectedMaterial || "").trim().toLowerCase();
    if (materialEmissionFactors[normalized] != null) {
      return materialEmissionFactors[normalized];
    }

    const baseCarbon = Number(base.carbonFootprint ?? base.carbon ?? 0);
    if (normalized === originalMaterial && originalWeight > 0 && baseCarbon > 0) {
      return baseCarbon / originalWeight;
    }

    return 10;
  };

  useEffect(() => {
    setWeight(getInitialWeight(initialReport));
    setMaterial(getInitialMaterial(initialReport));
    setDistance(getInitialDistance(initialReport));
    setHasUserEdited(false);
  }, [initialReport]);

  const simulated = useMemo(() => {
    const w = Number(weight) || 0;
    const d = Number(distance) || 0;
    const normalizedMaterial = (material || "polyester").toLowerCase();
    const emissionPerKg = getEmissionPerKg(normalizedMaterial);

    const carbon = calculateCarbon(w, emissionPerKg);
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

  const currentWeight = Number(weight) || 0;
  const currentMaterial = String(material || "").trim().toLowerCase();
  const currentDistance = Number(distance) || 0;

  const isAtOriginalInputs =
    Math.abs(currentWeight - originalWeight) < 1e-9 &&
    currentMaterial === originalMaterial &&
    Math.abs(currentDistance - originalDistance) < 1e-9;

  const baseOverall = Number(base.overallSustainabilityScore ?? 0);
  const baseCarbon = Number(base.carbonFootprint ?? base.carbon ?? 0);
  const baseEco = Number(base.ecoScore ?? calculateEcoScore(baseCarbon));
  const baseRecycling = Number(base.recyclingScore ?? calculateRecyclingScore(originalMaterial));

  const effective = isAtOriginalInputs
    ? {
        ...simulated,
        overall: baseOverall || simulated.overall,
        carbon: baseCarbon || simulated.carbon,
        ecoScore: baseEco,
        recyclingScore: baseRecycling,
      }
    : simulated;

  const delta = {
    overall: (effective.overall || 0) - baseOverall,
    carbon: (effective.carbon || 0) - baseCarbon,
  };

  const displayedOverall = hasUserEdited
    ? effective.overall
    : (baseOverall || effective.overall);

  const displayedCarbon = hasUserEdited
    ? effective.carbon
    : (baseCarbon || effective.carbon);

  const displayedEco = hasUserEdited
    ? effective.ecoScore
    : (baseEco || effective.ecoScore);

  const displayedRecycling = hasUserEdited
    ? effective.recyclingScore
    : (baseRecycling || effective.recyclingScore);

  const roundedOverallDelta = Math.round(delta.overall);
  const roundedCarbonDelta = Math.round(delta.carbon * 100) / 100;

  const showOverallDelta = hasUserEdited && roundedOverallDelta !== 0;
  const showCarbonDelta = hasUserEdited && Math.abs(roundedCarbonDelta) >= 0.01;

  return (
    <div className="whatif-panel card">
      <div className="card-header">
        <span className="section-tag">What-if Simulator</span>
        <h4>Preview metric changes without saving</h4>
      </div>

      <div className="whatif-grid">
        <label>
          Weight (kg)
          <input
            type="number"
            min="0"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              setHasUserEdited(true);
            }}
          />
        </label>

        <label>
          Material
          <select
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value);
              setHasUserEdited(true);
            }}
          >
            {materialOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Transport Distance (km)
          <input
            type="number"
            min="0"
            value={distance}
            onChange={(e) => {
              setDistance(e.target.value);
              setHasUserEdited(true);
            }}
          />
        </label>
      </div>

      <div className="whatif-results">
        <div className="whatif-metric">
          <strong>Overall Score</strong>
          <div>
            {displayedOverall}
            {showOverallDelta && (
              <small className={roundedOverallDelta >= 0 ? "delta-up" : "delta-down"}>
                {roundedOverallDelta >= 0 ? `+${roundedOverallDelta}` : roundedOverallDelta}
              </small>
            )}
          </div>
        </div>

        <div className="whatif-metric">
          <strong>Carbon (kg CO2e)</strong>
          <div>
            {displayedCarbon.toFixed(2)}
            {showCarbonDelta && (
              <small className={roundedCarbonDelta <= 0 ? "delta-up" : "delta-down"}>
                {roundedCarbonDelta <= 0
                  ? `${roundedCarbonDelta.toFixed(2)}`
                  : `+${roundedCarbonDelta.toFixed(2)}`}
              </small>
            )}
          </div>
        </div>

        <div className="whatif-metric">
          <strong>Eco Score</strong>
          <div>{displayedEco}</div>
        </div>

        <div className="whatif-metric">
          <strong>Recycling Score</strong>
          <div>{displayedRecycling}</div>
        </div>
      </div>
    </div>
  );
}

export default WhatIfSimulator;
