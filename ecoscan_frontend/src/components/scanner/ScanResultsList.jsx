/**
 * ScanResultsList
 * Shown after a name search returns multiple results.
 * User picks one to pre-fill the edit form.
 */
function ScanResultsList({ results, onSelect }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="scan-results-list card">
      <div className="card-header">
        <span className="section-tag">Search Results</span>
        <h3 style={{ margin: "6px 0 0" }}>
          {results.length} product{results.length !== 1 ? "s" : ""} found — pick one to continue
        </h3>
      </div>

      <ul className="scan-result-items">
        {results.map((dto, idx) => (
          <li key={dto.barcode ?? idx}>
            <button
              type="button"
              className="scan-result-item"
              onClick={() => onSelect(dto)}
            >
              {/* Thumbnail */}
              <div className="scan-result-thumb">
                {dto.imageUrl ? (
                  <img src={dto.imageUrl} alt={dto.name ?? "product"} />
                ) : (
                  <span className="scan-result-thumb-placeholder">📦</span>
                )}
              </div>

              {/* Info */}
              <div className="scan-result-info">
                <strong className="scan-result-name">
                  {dto.name || "Unnamed product"}
                </strong>
                <span className="scan-result-meta">
                  {[dto.category, dto.material, dto.weight != null ? `${dto.weight} kg` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
                {!dto.dataComplete && (
                  <span className="scan-incomplete-badge">⚠ Incomplete data</span>
                )}
              </div>

              <span className="scan-result-arrow">→</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ScanResultsList;
