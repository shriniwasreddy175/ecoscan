const categoryOptions = [
  "Electronics",
  "Clothing",
  "Furniture",
  "Food",
  "Cosmetics",
  "Home & Kitchen",
  "Accessories",
  "Other",
];

function ProductForm({
  form,
  loading,
  error,
  onChange,
  onSubmit,
  onFillSample,
  onReset,
}) {
  return (
    <section className="card">
      <div className="card-header">
        <div>
          <span className="section-tag">Product Analyzer</span>
          <h2>Enter Product Details</h2>
        </div>
      </div>

      <form
        className="form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label>
          Product Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Category
          <select name="category" value={form.category} onChange={onChange} required>
            <option value="">Select category</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Price
          <input type="number" step="0.01" min="0.01" name="price" value={form.price} onChange={onChange} required />
        </label>

        <label>
          Weight (kg)
          <input type="number" step="0.01" min="0.01" name="weight" value={form.weight} onChange={onChange} required />
        </label>

        <label>
          Material
          <input name="material" value={form.material} onChange={onChange} required />
        </label>

        <label>
          Transport Distance (km)
          <input
            type="number"
            step="1"
            min="0"
            name="transportDistance"
            value={form.transportDistance}
            onChange={onChange}
            required
          />
        </label>

        <label className="full-width">
          Description
          <textarea name="description" rows="4" value={form.description} onChange={onChange} required />
        </label>

        <div className="form-actions full-width">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Product"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={onFillSample}>
            Fill Sample
          </button>
          <button className="btn btn-ghost" type="button" onClick={onReset}>
            Reset
          </button>
        </div>
      </form>

      {error ? <div className="alert error">{error}</div> : null}
    </section>
  );
}

export default ProductForm;
