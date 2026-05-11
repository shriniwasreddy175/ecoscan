import { exportReportAsCSV, exportReportAsPDF } from "../../utils/exportReport";

function ResultsPanel({ result, progressValue }) {
  return (
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
              <ResultCard label="Product" value={result.productName ?? result.name} />
              <ResultCard label="Product ID" value={result.productId ?? result.id} />
              <ResultCard label="Carbon Footprint" value={result.carbonFootprint} />
              <ResultCard label="Shadow Cost" value={result.shadowCost} />
              <ResultCard label="Eco Score" value={result.ecoScore} />
              <ResultCard label="Water Footprint" value={result.waterFootprint ?? result.water} />
              <ResultCard label="Energy Consumption" value={result.energyConsumption ?? result.energy} />
              <ResultCard label="Transport Emission" value={result.transportEmission ?? result.transport} />
              <ResultCard label="Recycling Score" value={result.recyclingScore} />
            </div>

            <div className="sdg-grid">
              <div className="sdg-pill">
                <span>SDG 12</span>
                <strong>{result.sdg12Impact ?? result.sdg12}</strong>
              </div>
              <div className="sdg-pill">
                <span>SDG 13</span>
                <strong>{result.sdg13Impact ?? result.sdg13}</strong>
              </div>
              <div className="sdg-pill">
                <span>SDG 9</span>
                <strong>{result.sdg9Impact ?? result.sdg9}</strong>
              </div>
            </div>

            <div className="recommendation-wrap">
              <div className="recommendation-header">
                <h3>Recommendation Explainer</h3>
                <span>Top 2 actions ranked by expected score gain</span>
              </div>

              {!Array.isArray(result.recommendations) || result.recommendations.length === 0 ? (
                <p className="empty-text">No recommendations available for this report.</p>
              ) : (
                <div className="recommendation-grid">
                  {result.recommendations.slice(0, 2).map((rec, idx) => (
                    <article className="recommendation-card" key={`${rec.title}-${idx}`}>
                      <div className="recommendation-card-top">
                        <strong>{rec.title}</strong>
                        <span className={`recommendation-priority recommendation-priority-${(rec.priority || "low").toLowerCase()}`}>
                          {rec.priority || "Low"}
                        </span>
                      </div>

                      <p className="recommendation-because">
                        <strong>Because:</strong> {rec.because}
                      </p>
                      <p>
                        <strong>Expected impact:</strong> {rec.expectedImpact}
                      </p>
                      <p>
                        <strong>Potential score gain:</strong> +{rec.potentialScoreGain}
                      </p>

                      <ul>
                        {(rec.actionSteps || []).slice(0, 3).map((step, stepIndex) => (
                          <li key={`${rec.title}-step-${stepIndex}`}>{step}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
    </section>
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