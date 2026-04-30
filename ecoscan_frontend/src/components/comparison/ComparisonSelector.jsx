import { useEffect } from "react";

function ComparisonSelector({
  history,
  selectedProducts,
  onSelectProduct,
  onLoadHistory,
  onCompare,
  loading,
}) {
  useEffect(() => {
    onLoadHistory();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <span className="section-tag">Step 1</span>
          <h2>Select Products</h2>
        </div>
        <span className="badge">{selectedProducts.length} selected</span>
      </div>

      <div className="selector-list">
        {!history.length ? (
          <p className="empty-text">No products available. Analyze some first.</p>
        ) : (
          history.map((item) => (
            <label key={item.productId} className="selector-item">
              <input
                type="checkbox"
                checked={selectedProducts.includes(item.productId)}
                onChange={() => onSelectProduct(item.productId)}
              />
              <div className="selector-info">
                <strong>{item.productName}</strong>
                <span>{item.category}</span>
              </div>
              <span className="selector-score">
                {item.overallSustainabilityScore}
              </span>
            </label>
          ))
        )}
      </div>

      <div className="form-actions">
        <button
          className="btn btn-primary"
          onClick={onCompare}
          disabled={loading || selectedProducts.length < 2}
        >
          {loading ? "Comparing..." : "Compare Selected"}
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => window.location.reload()}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default ComparisonSelector;