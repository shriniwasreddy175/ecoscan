import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="page-section">
      <span className="eyebrow">EcoScan Platform</span>
      <h1>Understand your product's environmental impact.</h1>
      <p className="lead">
        Analyze product sustainability metrics like carbon footprint, water usage,
        recycling score, and SDG impact.
      </p>

      <div className="hero-cta">
        <Link className="btn btn-primary" to="/analyzer">
          Start Analysis
        </Link>
        <Link className="btn btn-secondary" to="/about">
          Learn More
        </Link>
      </div>

      <div className="home-grid">
        <article className="info-card">
          <h3>Carbon Intelligence</h3>
          <p>Track product-level carbon footprint and transport emissions.</p>
        </article>
        <article className="info-card">
          <h3>Sustainability Scoring</h3>
          <p>Get an overall eco score to benchmark product impact quickly.</p>
        </article>
        <article className="info-card">
          <h3>SDG Mapping</h3>
          <p>Understand how each product affects SDG 9, 12, and 13 targets.</p>
        </article>
      </div>
    </section>
  );
}

export default HomePage;