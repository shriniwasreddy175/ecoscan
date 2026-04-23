import { useMemo, useState } from "react";
import { analyzeProduct } from "../api/productApi";

const initialForm = {
  name: "",
  category: "",
  price: "",
  weight: "",
  material: "",
  transportDistance: "",
  description: "",
};

function readHistory() {
  try {
    const raw = localStorage.getItem("ecoscan_report_history");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(history) {
  localStorage.setItem("ecoscan_report_history", JSON.stringify(history));
}

export function useProductAnalyzer() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(readHistory);

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

  const applyHistoryItem = (item) => {
    setResult(item.report ?? null);
    setForm(item.input ?? initialForm);
    setError("");
  };

  const clearHistory = () => {
    setHistory([]);
    writeHistory([]);
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

      const entry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        input: {
          name: form.name,
          category: form.category,
          price: form.price,
          weight: form.weight,
          material: form.material,
          transportDistance: form.transportDistance,
          description: form.description,
        },
        report,
      };

      const nextHistory = [entry, ...history].slice(0, 10);
      setHistory(nextHistory);
      writeHistory(nextHistory);
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
    clearHistory,
    setError,
    setResult,
    initialForm,
  };
}