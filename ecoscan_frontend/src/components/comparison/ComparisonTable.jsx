function ComparisonTable({ results }) {
  if (!results.length) return null;

  const metrics = [
    { key: "productName", label: "Product" },
    { key: "overallSustainabilityScore", label: "Overall Score" },
    { key: "ecoScore", label: "Eco Score" },
    { key: "carbonFootprint", label: "Carbon (kg)" },
    { key: "waterFootprint", label: "Water (L)" },
    { key: "energyConsumption", label: "Energy (kWh)" },
    { key: "transportEmission", label: "Transport (kg)" },
    { key: "recyclingScore", label: "Recycling Score" },
    { key: "shadowCost", label: "Shadow Cost ($)" },
  ];

  const getWinner = (metricKey) => {
    let extreme = null;
    let extremeIdx = -1;

    results.forEach((r, idx) => {
      const value = r[metricKey];
      if (value === null || value === undefined) return;

      if (
        metricKey === "productName" ||
        metricKey === "sdg12Impact" ||
        metricKey === "sdg13Impact" ||
        metricKey === "sdg9Impact"
      ) {
        return;
      }

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
      <div className="card-header">
        <span className="section-tag">Results</span>
        <h2>Comparison Table</h2>
      </div>

      <div className="table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Metric</th>
              {results.map((r) => (
                <th key={r.productId}>{r.productName}</th>
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