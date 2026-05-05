import { useEffect, useState, useMemo } from "react";

function ComparisonSelector({
  history,
  selectedProducts,
  onSelectProduct,
  onLoadHistory,
  onCompare,
  loading,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    material: "",
    minScore: "",
    maxScore: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onLoadHistory();
  }, []);

  const uniqueCategories = useMemo(
    () => [...new Set(history.map((item) => item.category).filter(Boolean))],
    [history]
  );

  const uniqueMaterials = useMemo(
    () => [...new Set(history.map((item) => item.material).filter(Boolean))],
    [history]
  );

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesMaterial = !filters.material || item.material === filters.material;

      const score = item.overallSustainabilityScore ?? 0;
      const minScore = filters.minScore ? Number(filters.minScore) : 0;
      const maxScore = filters.maxScore ? Number(filters.maxScore) : 100;
      const matchesScore = score >= minScore && score <= maxScore;

      return matchesSearch && matchesCategory && matchesMaterial && matchesScore;
    });
  }, [history, searchQuery, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({ category: "", material: "", minScore: "", maxScore: "" });
  };

  const selectedCount = selectedProducts.length;

  return (
    <div className="card comparison-selector-card">
      <div className="card-header comparison-selector-header">
        <div>
          <span className="section-tag">Step 1</span>
          <h2>Select Products</h2>
          <p className="comparison-note">
            Pick at least two saved analyses to compare their full sustainability breakdown.
          </p>
        </div>
        <div className="comparison-selector-summary">
          <span className="badge">{selectedCount} selected</span>
          <span className="comparison-selector-hint">
            {selectedCount < 2 ? "Select one more product to compare." : "Ready to compare."}
          </span>
          <button
            className="btn btn-secondary btn-sm"
            type="button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="comparison-filter-panel">
          <div className="filter-group">
            <label>
              Search Product
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>
                Category
                <select name="category" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="filter-group">
              <label>
                Material
                <select name="material" value={filters.material} onChange={handleFilterChange}>
                  <option value="">All Materials</option>
                  {uniqueMaterials.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>
                Min Score
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="minScore"
                  value={filters.minScore}
                  onChange={handleFilterChange}
                  placeholder="0"
                />
              </label>
            </div>

            <div className="filter-group">
              <label>
                Max Score
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="maxScore"
                  value={filters.maxScore}
                  onChange={handleFilterChange}
                  placeholder="100"
                />
              </label>
            </div>

            <button className="btn btn-ghost" type="button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="selector-list-wrapper">
        {!history.length ? (
          <p className="empty-text comparison-empty-state">
            No saved products yet. Run an analysis first to build comparison history.
          </p>
        ) : !filteredHistory.length ? (
          <p className="empty-text comparison-empty-state">
            No products match your filters.
          </p>
        ) : (
          <>
            <div className="selector-list">
              {filteredHistory.map((item) => (
                <label key={item.productId} className="selector-item">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(item.productId)}
                    onChange={() => onSelectProduct(item.productId)}
                  />
                  <div className="selector-item-content">
                    <strong>{item.productName}</strong>
                    <span>
                      {item.category || "Uncategorized"}
                      {item.material && ` • ${item.material}`}
                      {" • "}
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "No timestamp"}
                    </span>
                  </div>
                  <div className="selector-item-actions">
                    <span className="score-chip">
                      #{item.productId} • Score {item.overallSustainabilityScore ?? "-"}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <p className="selector-count">{filteredHistory.length} of {history.length} products</p>
          </>
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