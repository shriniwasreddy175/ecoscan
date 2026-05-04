import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import {
  analyzeProduct,
  fetchProductHistory,
  fetchProductReportById,
} from "../api/productApi";
import { addToLocalHistory, getLocalHistoryWithLimit } from "../utils/localHistoryUtils";
import {
  calculateCarbon,
  calculateWaterFootprint,
  calculateEnergy,
  calculateTransportEmission,
  calculateEcoScore,
  calculateShadowCost,
  calculateRecyclingScore,
  calculateOverallScore,
} from "../utils/calculationUtils";

const initialForm = {
  name: "",
  category: "",
  price: "",
  weight: "",
  material: "",
  transportDistance: "",
  description: "",
};

export function useProductAnalyzer() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const progressValue = useMemo(() => {
    if (!result?.overallSustainabilityScore) return 0;
    return Math.min(100, Math.max(0, result.overallSustainabilityScore));
  }, [result]);

  const auth = useAuth();

  const loadHistory = async (limit = 30) => {
    if (!auth?.user?.id) {
      setHistoryLoading(true);
      try {
        const items = getLocalHistoryWithLimit(limit);
        setHistory(Array.isArray(items) ? items : []);
      } finally {
        setHistoryLoading(false);
      }
      return;
    }
    setHistoryLoading(true);
    try {
      const items = await fetchProductHistory(limit, auth?.user?.id);
      setHistory(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [auth?.user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setError("");
  };

  const applyHistoryItem = async (item) => {
    try {
      const productId = item?.productId ?? item?.id;
      if (!productId) throw new Error("Invalid history item.");
      setLoading(true);
      setError("");

      const report = await fetchProductReportById(productId, auth?.user?.id);
      setResult(report);
    } catch (err) {
      setError(err.message || "Failed to load report from history.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (!auth?.user?.id) {
      setHistory([]);
      return;
    }
    // DB-backed history: clear button in UI can be disabled or repurposed later.
    setHistory([]);
  };

  const runAnalysis = async () => {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        weight: Number(form.weight),
        material: form.material.trim(),
        transportDistance: Number(form.transportDistance),
        description: form.description.trim(),
      };

      if (
        !payload.name ||
        !payload.category ||
        !payload.material ||
        !payload.description ||
        form.price === "" ||
        form.weight === "" ||
        form.transportDistance === "" ||
        Number.isNaN(payload.price) ||
        Number.isNaN(payload.weight) ||
        Number.isNaN(payload.transportDistance)
      ) {
        throw new Error("Please fill all fields with valid values.");
      }

      let report;
      if (auth?.user?.id) {
        // Logged in: send to backend
        report = await analyzeProduct(payload, auth?.user?.id);
      } else {
        // Not logged in: calculate locally and save to localStorage
        const carbon = calculateCarbon(payload.weight, 10);
        const water = calculateWaterFootprint(payload.weight, payload.material);
        const energy = calculateEnergy(payload.weight);
        const transport = calculateTransportEmission(payload.transportDistance);
        const recyclingScore = calculateRecyclingScore(payload.material);
        const ecoScore = calculateEcoScore(carbon);
        const shadowCost = calculateShadowCost(carbon);
        const overallScore = calculateOverallScore(carbon, water, energy, transport, recyclingScore);

        report = {
          id: Date.now(),
          productId: Date.now(),
          productName: payload.name,
          name: payload.name,
          category: payload.category,
          ecoScore: ecoScore,
          carbonFootprint: carbon,
          overallSustainabilityScore: overallScore,
          shadowCost: shadowCost,
          waterFootprint: water,
          energyConsumption: energy,
          transportEmission: transport,
          water: water,
          energy: energy,
          transport: transport,
          recyclingScore: recyclingScore,
        };
        addToLocalHistory({
          id: report.id,
          productName: report.productName,
          productId: report.productId,
          category: report.category,
          price: payload.price,
          weight: payload.weight,
          material: payload.material,
          transportDistance: payload.transportDistance,
          description: payload.description,
          ecoScore: report.ecoScore,
          carbonFootprint: report.carbonFootprint,
          shadowCost: report.shadowCost,
          waterFootprint: report.waterFootprint,
          energyConsumption: report.energyConsumption,
          transportEmission: report.transportEmission,
          water: report.water,
          energy: report.energy,
          transport: report.transport,
          recyclingScore: report.recyclingScore,
          overallSustainabilityScore: report.overallSustainabilityScore,
          createdAt: new Date().toISOString(),
        });
      }
      setResult(report);

      // Refresh history after new analysis
      await loadHistory();
    } catch (err) {
      setError(err.message || "Failed to analyze product.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    loading,
    historyLoading,
    error,
    result,
    history,
    progressValue,
    handleChange,
    resetForm,
    runAnalysis,
    applyHistoryItem,
    clearHistory,
    setError,
    setResult,
  };
}