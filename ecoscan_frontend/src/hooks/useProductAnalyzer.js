import { useEffect, useMemo, useState } from "react";
import {
  analyzeProduct,
  fetchProductHistory,
  fetchProductReportById,
} from "../api/productApi";

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

  const loadHistory = async (limit = 30) => {
    setHistoryLoading(true);
    try {
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
  }, []);

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

      const report = await fetchProductReportById(productId);
      setResult(report);
    } catch (err) {
      setError(err.message || "Failed to load report from history.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
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

      const report = await analyzeProduct(payload);
      setResult(report);

      // Refresh DB-backed history after new analysis
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