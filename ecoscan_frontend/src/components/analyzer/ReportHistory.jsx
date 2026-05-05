import { useState, useMemo } from "react";

function ReportHistory({ history, loading, onLoadItem, onDeleteItem, onClearHistory }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    material: "",
    minScore: "",
    maxScore: "",
  });
  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <section className="card history-card">
      <div className="card-header history-header">
        <div>
          <span className="section-tag">History</span>
          <h2>Recent Product Reports</h2>
        </div>
        <div className="history-controls">
          {onClearHistory ? (
            <button className="btn btn-ghost history-clear-btn" type="button" onClick={onClearHistory}>
              Clear Local History
            </button>
          ) : null}
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Filters"}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="history-filter-panel">
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

      {loading ? (
        <p className="empty-text">Loading history...</p>
      ) : !history.length ? (
        <p className="empty-text">No history available yet.</p>
      ) : !filteredHistory.length ? (
        <p className="empty-text">No products match your filters.</p>
      ) : (
        <div className="history-list-wrapper">
          <ul className="history-list history-list-scrollable">
            {filteredHistory.map((item) => (
              <li key={item.productId}>
                <button
                  className="history-item"
                  type="button"
                  onClick={() => onLoadItem(item)}
                >
                  <div className="history-item-content">
                    <strong>{item.productName || "Unknown Product"}</strong>
                    <span>
                      {item.category || "Uncategorized"}
                      {item.material && ` • ${item.material}`}
                      {" • "}
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "No timestamp"}
                    </span>
                  </div>
                  <div className="history-item-actions">
                    <span className="score-chip">
                      #{item.productId} • Score {item.overallSustainabilityScore ?? "-"}
                    </span>
                    {onDeleteItem ? (
                      <button
                        className="history-delete-btn"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteItem(item.productId ?? item.id);
                        }}
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <p className="history-count">{filteredHistory.length} of {history.length} products</p>
        </div>
      )}
    </section>
  );
}

export default ReportHistory;