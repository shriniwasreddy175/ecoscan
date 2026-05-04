import GamificationPanel from "../components/gamification/GamificationPanel";
import { useGamification } from "../hooks/useGamification";
import { Link } from "react-router-dom";

export default function GamificationPage() {
  const { stats, loading, error } = useGamification();

  return (
    <section className="page-section">
      <span className="eyebrow">Rewards</span>
      <h1 style={{ marginTop: 8 }}>Your Eco Journey</h1>
      <p className="lead">
        Turn sustainability into a game. Earn Eco Points for every analysis, level
        up your EcoScore rank, and unlock badges as you build greener habits.
      </p>

      {!loading && !error && stats?.totalAnalyses === 0 && (
        <div className="gamification-cta-banner">
          <span>🌱 Start your journey — </span>
          <Link to="/analyzer" className="gamification-cta-link">
            run your first product analysis
          </Link>
          <span> to earn Eco Points!</span>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <GamificationPanel stats={stats} loading={loading} error={error} />
      </div>

      {/* How it works */}
      <div className="card" style={{ marginTop: 18 }}>
        <span className="section-tag">How it works</span>
        <h2 style={{ marginTop: 6 }}>Earn Points & Level Up</h2>

        <div className="gamification-how-grid">
          <div className="info-card">
            <h3>🏅 Eco Points</h3>
            <p>
              Each product analysis earns you points based on its sustainability score:
              20 pts for a score ≥ 80, 15 for ≥ 60, 10 for ≥ 40, 5 for ≥ 20, and 2 pts
              for any other score.
            </p>
          </div>
          <div className="info-card">
            <h3>🎖️ Levels</h3>
            <p>
              Accumulate Eco Points to rise through the ranks — from
              🌱 Seedling all the way to 🏆 Sustainability Champion.
            </p>
          </div>
          <div className="info-card">
            <h3>🔥 Streak</h3>
            <p>
              Run at least one analysis every day to keep your streak alive.
              Consistency is the key to becoming an eco champion!
            </p>
          </div>
          <div className="info-card">
            <h3>🏆 Badges</h3>
            <p>
              Unlock achievement badges by hitting milestones — first analysis,
              high eco scores, low carbon footprints, and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
