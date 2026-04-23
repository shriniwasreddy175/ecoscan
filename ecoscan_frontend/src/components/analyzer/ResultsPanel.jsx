import ImpactChart from "./ImpactChart";
import { exportReportAsCSV, exportReportAsPDF } from "../../utils/exportReport";

function ResultsPanel({ result, progressValue }) {
  return (
    <>
      <section className="card">
        <div className="card-header card-header-row">
          <div>
            <span className="section-tag">Results</span>
            <h2>Sustainability Report</h2>
          </div>

          <div className="export-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => exportReportAsCSV(result)}
              disabled={!result}
            >
              Export CSV
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => exportReportAsPDF(result)}
              disabled={!result}
            >
              Export PDF
            </button>
          </div>
        </div>

        {!result ? (
          <p className="empty-text">Run an analysis to view report data.</p>
        ) : (
          <>
            <div className="score-banner">
              <span>Overall Score</span>
              <strong>{result.overallSustainabilityScore}</strong>
              <div className="score-meter">
                <div className="score-fill" style={{ width: `${progressValue}%` }} />
              </div>
            </div>

            <div className="results-grid">
              <ResultCard label="Product" value={result.productName} />
              <ResultCard label="Product ID" value={result.productId} />
              <ResultCard label="Carbon Footprint" value={result.carbonFootprint} />
              <ResultCard label="Shadow Cost" value={result.shadowCost} />
              <ResultCard label="Eco Score" value={result.ecoScore} />
              <ResultCard label="Water Footprint" value={result.waterFootprint} />
              <ResultCard label="Energy Consumption" value={result.energyConsumption} />
              <ResultCard label="Transport Emission" value={result.transportEmission} />
              <ResultCard label="Recycling Score" value={result.recyclingScore} />
            </div>

            <div className="sdg-grid">
              <div className="sdg-pill">
                <span>SDG 12</span>
                <strong>{result.sdg12Impact}</strong>
              </div>
              <div className="sdg-pill">
                <span>SDG 13</span>
                <strong>{result.sdg13Impact}</strong>
              </div>
              <div className="sdg-pill">
                <span>SDG 9</span>
                <strong>{result.sdg9Impact}</strong>
              </div>
            </div>
          </>
        )}
      </section>

      <ImpactChart report={result} />
    </>
  );
}

function ResultCard({ label, value }) {
  return (
    <div className="result-card">
      <span>{label}</span>
      <strong>{value ?? "-"}</strong>
    </div>
  );
}

export default ResultsPanel;