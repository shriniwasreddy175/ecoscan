function ComparisonTable({ results }) {
  if (!results.length) return null;

  const metrics = [
    { key: "productName", label: "Product" },
    { key: "category", label: "Category" },
    { key: "overallSustainabilityScore", label: "Overall Score" },
    { key: "ecoScore", label: "Eco Score" },
    { key: "carbonFootprint", label: "Carbon (kg)" },
    { key: "waterFootprint", label: "Water (L)" },
    { key: "energyConsumption", label: "Energy (kWh)" },
    { key: "transportEmission", label: "Transport (kg)" },
    { key: "recyclingScore", label: "Recycling Score" },
    { key: "shadowCost", label: "Shadow Cost ($)" },
    { key: "sdg12Impact", label: "SDG 12" },
    { key: "sdg13Impact", label: "SDG 13" },
    { key: "sdg9Impact", label: "SDG 9" },
  ];

  const hasComparableValue = (metricKey, value) => {
    if (value === null || value === undefined) return false;
    if (metricKey === "productName" || metricKey === "category") return false;
    if (metricKey.startsWith("sdg")) return false;
    return typeof value === "number";
  };

  const getWinner = (metricKey) => {
    let extreme = null;
    let extremeIdx = -1;

    results.forEach((r, idx) => {
      const value = r[metricKey];
      if (!hasComparableValue(metricKey, value)) return;

      const isScore =
        metricKey.includes("Score") || metricKey === "overallSustainabilityScore";
      const isBetter = isScore ? value > extreme : value < extreme;

      if (extreme === null || isBetter) {
        extreme = value;
        extremeIdx = idx;
      }
    });

    return extremeIdx;
  };

  return (
    <section className="card comparison-card">
      <div className="card-header comparison-card-header">
        <div>
          <span className="section-tag">Results</span>
          <h2>Comparison Table</h2>
          <p className="comparison-note">
            Compare the full sustainability breakdown for every saved product.
          </p>
        </div>
        <div className="comparison-legend">
          <span className="comparison-legend-item">Higher is better for scores</span>
          <span className="comparison-legend-item">Lower is better for impact metrics</span>
        </div>
      </div>

      <div className="table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Metric</th>
              {results.map((r) => (
                <th key={r.productId}>
                  <div className="comparison-head-cell">
                    <strong>{r.productName ?? r.name ?? "Unknown"}</strong>
                    <span>{r.category ?? "Uncategorized"}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => {
              const winner = getWinner(metric.key);
              return (
                <tr key={metric.key}>
                  <td className="metric-label">{metric.label}</td>
                  {results.map((r, idx) => (
                    <td
                      key={r.productId}
                      className={winner === idx ? "winner" : ""}
                    >
                      {formatValue(r[metric.key], metric.key)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatValue(value, key) {
  if (value === null || value === undefined) return "-";

  if (key === "productName") return value;
  if (key === "category") return value;
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    if (key.includes("Score")) {
      return Math.round(value);
    }
    return value.toFixed(2);
  }

  return value;
}

export default ComparisonTable;