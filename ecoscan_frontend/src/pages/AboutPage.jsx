function AboutPage() {
  return (
    <section className="page-section">
      <div className="card">
        <span className="section-tag">About EcoScan</span>
        <h2>What this system does</h2>
        <p className="about-text">
          EcoScan is a full-stack sustainability analysis platform. The React frontend
          collects product details and the Spring Boot backend computes environmental
          indicators for faster eco-aware decisions.
        </p>

        <div className="about-grid">
          <article className="info-card">
            <h3>Input</h3>
            <p>Product name, category, pricing, material, weight, and transport details.</p>
          </article>
          <article className="info-card">
            <h3>Computation</h3>
            <p>Carbon, energy, water, recycling, and aggregate sustainability scoring.</p>
          </article>
          <article className="info-card">
            <h3>Output</h3>
            <p>Structured report with overall score and SDG 9/12/13 impact summary.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;