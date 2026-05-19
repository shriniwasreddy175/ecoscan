/**
 * ScanSearchBar
 * The top input area: mode toggle (Barcode / Name), text input, Search button.
 */
function ScanSearchBar({ mode, onModeChange, query, onQueryChange, onSearch, loading }) {
  const handleKey = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="scan-search-bar">
      {/* Mode toggle */}
      <div className="scan-mode-toggle">
        <button
          type="button"
          className={`scan-mode-btn ${mode === "barcode" ? "active" : ""}`}
          onClick={() => onModeChange("barcode")}
        >
          📷 Barcode
        </button>
        <button
          type="button"
          className={`scan-mode-btn ${mode === "name" ? "active" : ""}`}
          onClick={() => onModeChange("name")}
        >
          🔍 Name Search
        </button>
      </div>

      {/* Input row */}
      <div className="scan-input-row">
        <input
          className="scan-input"
          type="text"
          placeholder={
            mode === "barcode"
              ? "Enter barcode (e.g. 5449000000996)"
              : "Enter product name (e.g. Coca Cola)"
          }
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
          aria-label={mode === "barcode" ? "Barcode input" : "Product name input"}
        />
        <button
          type="button"
          className="btn btn-primary scan-search-btn"
          onClick={onSearch}
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <span className="scan-spinner" aria-label="Searching" />
          ) : (
            "Search"
          )}
        </button>
      </div>

      <p className="scan-hint">
        {mode === "barcode"
          ? "Type or paste the barcode number from the product packaging."
          : "Search by product name to find sustainability data from Open Food Facts."}
      </p>
    </div>
  );
}

export default ScanSearchBar;
