import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ImpactChart({ report }) {
  if (!report) return null;

  const chartData = [
    { name: "Carbon", value: Number(report.carbonFootprint) || 0 },
    { name: "Water", value: Number(report.waterFootprint) || 0 },
    { name: "Energy", value: Number(report.energyConsumption) || 0 },
    { name: "Transport", value: Number(report.transportEmission) || 0 },
    { name: "Recycling", value: Number(report.recyclingScore) || 0 },
    { name: "EcoScore", value: Number(report.ecoScore) || 0 },
    { name: "Overall", value: Number(report.overallSustainabilityScore) || 0 },
  ];

  return (
    <section className="card chart-card">
      <div className="card-header">
        <div>
          <span className="section-tag">Visualization</span>
          <h2>Impact Metrics Chart</h2>
        </div>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9efe0" />
            <XAxis dataKey="name" tick={{ fill: "#466054", fontSize: 12 }} />
            <YAxis tick={{ fill: "#466054", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #d9efe0",
                borderRadius: 12,
                color: "#0f172a",
              }}
            />
            <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ImpactChart;