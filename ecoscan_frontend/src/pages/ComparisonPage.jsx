import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchProductHistory } from "../api/productApi";
import {
  getLocalHistoryWithLimit,
  normalizeLocalHistoryItem,
} from "../utils/localHistoryUtils";
import ComparisonTable from "../components/comparison/ComparisonTable";
import ComparisonSelector from "../components/comparison/ComparisonSelector";

function ComparisonPage() {
  const [history, setHistory] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();

  const loadHistory = async () => {
    try {
      if (auth?.user?.id) {
        // Logged in: fetch from DB
        const items = await fetchProductHistory(50, auth?.user?.id);
        setHistory(Array.isArray(items) ? items : []);
      } else {
        // Not logged in: fetch from localStorage
        const localItems = getLocalHistoryWithLimit(50);
        setHistory(Array.isArray(localItems) ? localItems : []);
      }
    } catch (err) {
      setError("Failed to load product history.");
    }
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleCompare = async () => {
    if (selectedProducts.length < 2) {
      setError("Select at least 2 products to compare.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (auth?.user?.id) {
        // Logged in: use backend API
        const response = await fetch(
          "http://localhost:8181/ecoscan/api/products/compare",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productIds: selectedProducts }),
          }
        );

        if (!response.ok) throw new Error("Failed to compare products.");
        const results = await response.json();
        setComparisonResults(results);
      } else {
        // Not logged in: compare from local history
        const localHistory = getLocalHistoryWithLimit(200);
        const results = selectedProducts
          .map((productId) => {
            const product = localHistory.find(
              (item) => item.id === productId || item.productId === productId
            );
            if (!product) return null;

            return normalizeLocalHistoryItem(product);
          })
          .filter((r) => r !== null);

        if (results.length === 0) {
          throw new Error("Could not find selected products.");
        }
        setComparisonResults(results);
      }
    } catch (err) {
      setError(err.message || "Comparison failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section">
      <span className="eyebrow">Compare Products</span>
      <h1>Multi-Product Comparison</h1>
      <p className="lead">
        Select multiple products from history to compare sustainability metrics side by side.
      </p>

      <div className="comparison-grid">
        <ComparisonSelector
          history={history}
          selectedProducts={selectedProducts}
          onSelectProduct={handleSelectProduct}
          onLoadHistory={loadHistory}
          onCompare={handleCompare}
          loading={loading}
        />
      </div>

      {error && <div className="alert error">{error}</div>}

      {comparisonResults.length > 0 && (
        <ComparisonTable results={comparisonResults} />
      )}
    </section>
  );
}

export default ComparisonPage;