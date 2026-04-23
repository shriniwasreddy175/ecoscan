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
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const progressValue = useMemo(() => {
    if (!result?.overallSustainabilityScore) return 0;
    return Math.min(100, Math.max(0, result.overallSustainabilityScore));
  }, [result]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setError("");
  };

  const loadHistory = async () => {
    const items = await fetchProductHistory(30);
    setHistory(Array.isArray(items) ? items : []);
  };

  useEffect(() => {
    loadHistory().catch((err) => {
      setError(err.message || "Failed to load history.");
    });
  }, []);

  const applyHistoryItem = async (item) => {
    if (!item?.productId) return;
    setError("");
    setLoading(true);
    try {
      const report = await fetchProductReportById(item.productId);
      setResult(report);
    } catch (err) {
      setError(err.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
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
        !Number.isFinite(payload.price) ||
        !Number.isFinite(payload.weight) ||
        !Number.isFinite(payload.transportDistance) ||
        payload.price <= 0 ||
        payload.weight <= 0 ||
        payload.transportDistance < 0
      ) {
        throw new Error("Please fill all fields with valid values.");
      }

      const report = await analyzeProduct(payload);
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
    error,
    result,
    history,
    progressValue,
    handleChange,
    resetForm,
    runAnalysis,
    applyHistoryItem,
    setError,
    setResult,
    initialForm,
  };
}
