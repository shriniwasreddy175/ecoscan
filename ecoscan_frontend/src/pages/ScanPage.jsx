import { useState } from "react";
import { useProductLookup } from "../hooks/useProductLookup";
import { useProductAnalyzer } from "../hooks/useProductAnalyzer";
import ScanSearchBar from "../components/scanner/ScanSearchBar";
import ScanResultsList from "../components/scanner/ScanResultsList";
import ScanEditForm from "../components/scanner/ScanEditForm";
import ResultsPanel from "../components/analyzer/ResultsPanel";
import ImpactChart from "../components/analyzer/ImpactChart";

function ScanPage() {
  const lookup = useProductLookup();
  const analyzer = useProductAnalyzer();

  // Track whether we've submitted for analysis so we can show the report
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzed(false);
    analyzer.setError("");
    analyzer.setResult(null);

    // Build payload from the editable form
    const f = lookup.editForm;
    analyzer.setForm({
      name: f.name,
      category: f.category,
      price: f.price || "0",
      weight: f.weight,
      material: f.material,
      transportDistance: f.transportDistance,
      description: f.description,
    });

    // Trigger analysis using the hook's runAnalysis
    // We need to call it after setForm has propagated, so we build the
    // payload directly and call analyzeProduct ourselves via the hook.
    await analyzer.runAnalysisWithPayload({
      name: f.name.trim(),
      category: f.category.trim(),
      price: Number(f.price) || 0,
      weight: Number(f.weight),
      material: f.material.trim(),
      transportDistance: Number(f.transportDistance),
      description: f.description.trim(),
    });

    setAnalyzed(true);
  };

  const handleReset = () => {
    lookup.reset();
    analyzer.setResult(null);
    analyzer.setError("");
    setAnalyzed(false);
  };

  return (
    <section className="page-section">
      {/* Page title */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span className="section-tag">Barcode &amp; Name Lookup</span>
        <h1 style={{ margin: "10px 0 6px" }}>Scan a Product</h1>
        <p className="lead">
          Enter a barcode or search by product name. We'll pull data from{" "}
          <a
            href="https://world.openfoodfacts.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-2)", fontWeight: 700 }}
          >
            Open Food Facts
          </a>{" "}
          and pre-fill the form — you review, adjust, and analyze.
        </p>
      </div>

      {/* Search bar — always visible */}
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <ScanSearchBar
          mode={lookup.mode}
          onModeChange={(m) => { lookup.setMode(m); lookup.reset(); }}
          query={lookup.query}
          onQueryChange={lookup.setQuery}
          onSearch={lookup.runLookup}
          loading={lookup.loading}
        />
        {lookup.error && (
          <div className="alert error" style={{ marginTop: "0.75rem" }}>
            {lookup.error}
          </div>
        )}
      </div>

      {/* Name-search results list */}
      {lookup.results.length > 0 && (
        <ScanResultsList
          results={lookup.results}
          onSelect={lookup.selectResult}
        />
      )}

      {/* Edit form + analysis results */}
      {lookup.selected && (
        <div className="split-grid" style={{ marginTop: "1.25rem" }}>
          {/* Left: editable form */}
          <div className="left-column">
            <ScanEditForm
              selected={lookup.selected}
              form={lookup.editForm}
              onChange={lookup.handleEditChange}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
              loading={analyzer.loading}
              error={analyzer.error}
            />
            {analyzed && <ImpactChart report={analyzer.result} />}
          </div>

          {/* Right: results panel */}
          {analyzed && (
            <ResultsPanel
              result={analyzer.result}
              progressValue={analyzer.progressValue}
            />
          )}
        </div>
      )}

      {/* Empty state when nothing is happening */}
      {!lookup.selected && lookup.results.length === 0 && !lookup.loading && (
        <div className="scan-empty-state card">
          <div className="scan-empty-icon">🔍</div>
          <h3>How it works</h3>
          <ol className="scan-how-list">
            <li>
              <strong>Barcode mode</strong> — type the number printed under the
              barcode on any packaged product.
            </li>
            <li>
              <strong>Name search</strong> — type a product name and pick from
              the results list.
            </li>
            <li>
              Review the pre-filled details, correct anything that looks off
              (weight, material, transport distance).
            </li>
            <li>
              Hit <strong>Analyze Product</strong> to get the full sustainability
              report.
            </li>
          </ol>
          <p className="scan-empty-note">
            Data is sourced from{" "}
            <a
              href="https://world.openfoodfacts.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-2)" }}
            >
              Open Food Facts
            </a>
            , a free, open database of food products worldwide.
          </p>
        </div>
      )}
    </section>
  );
}

export default ScanPage;
