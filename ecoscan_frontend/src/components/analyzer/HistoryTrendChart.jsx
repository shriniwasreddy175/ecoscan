import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

function formatDateLabel(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function HistoryTrendChart({ history }) {
  const chartData = [...(history || [])]
    .filter((h) => h?.createdAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((h) => ({
      createdAt: h.createdAt,
      productName: h.productName,
      overallScore: Number(h.overallSustainabilityScore) || 0,
      ecoScore: Number(h.ecoScore) || 0,
      carbon: Number(h.carbonFootprint) || 0,
    }));

  return (
    <section className="card chart-card">
      <div className="card-header">
        <div>
          <span className="section-tag">Trends</span>
          <h2>Score Over Time</h2>
        </div>
      </div>

      {!chartData.length ? (
        <p className="empty-text">Not enough history data for trend chart.</p>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d9efe0" />
              <XAxis
                dataKey="createdAt"
                tickFormatter={formatDateLabel}
                tick={{ fill: "#466054", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "#466054", fontSize: 12 }} />
              <Tooltip
                labelFormatter={(value) => `Date: ${formatDateTime(value)}`}
                formatter={(value, name, props) => {
                  if (name === "overallScore") return [value, "Overall Score"];
                  if (name === "ecoScore") return [value, "Eco Score"];
                  if (name === "carbon") return [value, "Carbon Footprint"];
                  return [value, name];
                }}
                contentStyle={{
                  background: "#ffffff",
                  border: "1px solid #d9efe0",
                  borderRadius: 12,
                  color: "#0f172a",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="overallScore"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 3 }}
                name="Overall Score"
              />
              <Line
                type="monotone"
                dataKey="ecoScore"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Eco Score"
              />
              <Line
                type="monotone"
                dataKey="carbon"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Carbon Footprint"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default HistoryTrendChart;