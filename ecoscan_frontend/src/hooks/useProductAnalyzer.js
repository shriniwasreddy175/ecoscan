import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import {
  analyzeProduct,
  fetchProductHistory,
  fetchProductReportById,
} from "../api/productApi";
import {
  addToLocalHistory,
  clearLocalHistory,
  deleteLocalHistoryItem,
  getLocalHistoryWithLimit,
} from "../utils/localHistoryUtils";
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
import { generateRecommendations } from "../utils/recommendationUtils";

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
    setHistoryLoading(true);
    try {
      if (!auth?.user?.userId) {
        // Guest: use local history
        const items = getLocalHistoryWithLimit(limit);
        setHistory(Array.isArray(items) ? items : []);
        return;
      }

      // Authenticated: fetch from backend using JWT token (set via authHeaders in productApi)
      const items = await fetchProductHistory(limit);
      setHistory(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err.message || "Failed to load history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [auth?.user?.userId]);

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

      const isGuest = !auth?.user?.userId;
      const report = await fetchProductReportById(productId, isGuest);
      setResult({
        ...report,
        recommendations:
          Array.isArray(report?.recommendations) && report.recommendations.length > 0
            ? report.recommendations
            : generateRecommendations(report),
      });
    } catch (err) {
      setError(err.message || "Failed to load report from history.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (!auth?.user?.userId) {
      clearLocalHistory();
      setHistory([]);
      return;
    }

    setHistory([]);
  };

  const deleteHistoryItem = async (itemId) => {
    if (auth?.user?.userId) {
      setError("Delete is available for guest local history only.");
      return;
    }

    deleteLocalHistoryItem(itemId);
    await loadHistory();
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
      if (auth?.user?.userId) {
        // Authenticated: JWT token sent via authHeaders in productApi
        report = await analyzeProduct(payload);
        // Ensure recommendations are always present — fall back to local generation
        // if the backend returned an empty array
        if (!Array.isArray(report?.recommendations) || report.recommendations.length === 0) {
          report = { ...report, recommendations: generateRecommendations(report) };
        }
      } else {
        const carbon = calculateCarbon(payload.weight, 10);
        const water = calculateWaterFootprint(payload.weight, payload.material);
        const energy = calculateEnergy(payload.weight);
        const transport = calculateTransportEmission(payload.transportDistance);
        const recyclingScore = calculateRecyclingScore(payload.material);
        const ecoScore = calculateEcoScore(carbon);
        const shadowCost = calculateShadowCost(carbon);
        const overallScore = calculateOverallScore(
          carbon,
          water,
          energy,
          transport,
          recyclingScore
        );

        report = {
          id: Date.now(),
          productId: Date.now(),
          productName: payload.name,
          name: payload.name,
          category: payload.category,
          price: payload.price,
          weight: payload.weight,
          material: payload.material,
          transportDistance: payload.transportDistance,
          description: payload.description,
          ecoScore,
          carbonFootprint: carbon,
          overallSustainabilityScore: overallScore,
          shadowCost,
          waterFootprint: water,
          energyConsumption: energy,
          transportEmission: transport,
          water,
          energy,
          transport,
          recyclingScore,
          sdg12Impact: "Responsible Consumption",
          sdg13Impact: "Moderate Impact",
          sdg9Impact: "Efficient Industry",
          createdAt: new Date().toISOString(),
        };

        report.recommendations = generateRecommendations(report);

        // Save to localStorage for history persistence, but keep the
        // in-memory report (with recommendations) as the displayed result.
        const savedItem = addToLocalHistory(report);
        // Merge the assigned id back so history lookups work, but keep recommendations
        report = { ...report, id: savedItem.id, productId: savedItem.productId };
      }

      setResult(report);
      await loadHistory();
    } catch (err) {
      setError(err.message || "Failed to analyze product.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Analyze a pre-built payload directly (used by ScanPage).
   * Skips the form-reading step and validates the payload itself.
   */
  const runAnalysisWithPayload = async (payload) => {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      if (
        !payload.name ||
        !payload.category ||
        !payload.material ||
        isNaN(payload.weight) || payload.weight <= 0 ||
        isNaN(payload.transportDistance) || payload.transportDistance < 0
      ) {
        throw new Error("Please fill in Name, Category, Material, Weight, and Transport Distance.");
      }

      let report;
      if (auth?.user?.userId) {
        report = await analyzeProduct(payload);
        // Ensure recommendations are always present — fall back to local generation
        // if the backend returned an empty array
        if (!Array.isArray(report?.recommendations) || report.recommendations.length === 0) {
          report = { ...report, recommendations: generateRecommendations(report) };
        }
      } else {
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
          price: payload.price,
          weight: payload.weight,
          material: payload.material,
          transportDistance: payload.transportDistance,
          description: payload.description,
          ecoScore,
          carbonFootprint: carbon,
          overallSustainabilityScore: overallScore,
          shadowCost,
          waterFootprint: water,
          energyConsumption: energy,
          transportEmission: transport,
          water,
          energy,
          transport,
          recyclingScore,
          sdg12Impact: "Responsible Consumption",
          sdg13Impact: "Moderate Impact",
          sdg9Impact: "Efficient Industry",
          createdAt: new Date().toISOString(),
        };
        report.recommendations = generateRecommendations(report);

        // Save to localStorage for history persistence, but keep the
        // in-memory report (with recommendations) as the displayed result.
        const savedItem = addToLocalHistory(report);
        // Merge the assigned id back so history lookups work, but keep recommendations
        report = { ...report, id: savedItem.id, productId: savedItem.productId };
      }

      setResult(report);
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
    runAnalysisWithPayload,
    applyHistoryItem,
    clearHistory,
    deleteHistoryItem,
    setError,
    setResult,
  };
}