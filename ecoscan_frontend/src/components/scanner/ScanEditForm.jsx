/**
 * ScanEditForm
 * Pre-filled editable form shown after a product is selected from lookup.
 * User reviews / corrects the fields, then clicks "Analyze".
 */

const categoryOptions = [
  "Electronics", "Clothing", "Furniture", "Food",
  "Cosmetics", "Home & Kitchen", "Accessories", "Other",
];

const allMaterials = [
  "Cotton", "Polyester", "Wool", "Silk", "Nylon", "Acrylic", "Denim",
  "Recycled Plastic", "PVC", "Polypropylene", "Bioplastic",
  "Aluminium", "Recycled Aluminium", "Copper", "Iron",
  "Plywood", "MDF", "Paper", "Recycled Paper", "Cardboard",
  "Glass", "Silicon", "Lithium", "Plastic",
  "Packaging Plastic", "Packaging Paper", "Rubber",
  "Leather", "Synthetic Leather", "Steel", "Stainless Steel",
];

function ScanEditForm({ selected, form, onChange, onAnalyze, onReset, loading, error }) {
  return (
    <div className="scan-edit-card card">
      {/* Header */}
      <div className="card-header">
        <div className="scan-edit-header-row">
          <div>
            <span className="section-tag">Product Found</span>
            <h2 style={{ margin: "6px 0 0" }}>{selected.name || "Unnamed product"}</h2>
          </div>

          {selected.imageUrl && (
            <img
              src={selected.imageUrl}
              alt={selected.name}
              className="scan-edit-thumb"
            />
          )}
        </div>

        {/* Source + completeness */}
        <div className="scan-edit-meta">
          <span className="scan-source-badge">
            🌍 Source: {selected.source ?? "Open Food Facts"}
          </span>
          {selected.barcode && (
            <span className="scan-source-badge">🔖 {selected.barcode}</span>
          )}
          {!selected.dataComplete && (
            <span className="scan-incomplete-badge">
              ⚠ Some fields were missing — please fill them in before analyzing
            </span>
          )}
        </div>
      </div>

      {/* Editable form */}
      <form
        className="form-grid"
        onSubmit={(e) => { e.preventDefault(); onAnalyze(); }}
      >
        <label>
          Product Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={onChange}>
            <option value="">Select category</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label>
          Price (optional)
          <input
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={onChange}
            placeholder="0.00"
          />
        </label>

        <label>
          Weight (kg)
          <input
            type="number"
            step="0.001"
            name="weight"
            value={form.weight}
            onChange={onChange}
            required
            placeholder="e.g. 0.5"
          />
        </label>

        <label>
          Material
          <select name="material" value={form.material} onChange={onChange} required>
            <option value="">Select material</option>
            {allMaterials.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        <label>
          Transport Distance (km)
          <input
            type="number"
            step="1"
            name="transportDistance"
            value={form.transportDistance}
            onChange={onChange}
            required
            placeholder="e.g. 500"
          />
        </label>

        <label className="full-width">
          Description
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={onChange}
            placeholder="Optional notes about the product"
          />
        </label>

        <div className="form-actions full-width">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Analyzing…" : "⚡ Analyze Product"}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onReset}
            disabled={loading}
          >
            ← Search Again
          </button>
        </div>
      </form>

      {error && <div className="alert error">{error}</div>}
    </div>
  );
}

export default ScanEditForm;
