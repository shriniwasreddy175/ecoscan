import { LEVELS } from "../../utils/gamificationUtils";

/**
 * GamificationPanel
 *
 * Displays the user's EcoScore level, total Eco Points, current streak,
 * progress towards the next level, and earned / locked badges.
 */
function GamificationPanel({ stats, loading, error }) {
  if (loading) {
    return (
      <section className="card">
        <span className="section-tag">Gamification</span>
        <p className="empty-text" style={{ marginTop: 10 }}>Loading rewards data…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card">
        <span className="section-tag">Gamification</span>
        <div className="alert error" style={{ marginTop: 10 }}>{error}</div>
      </section>
    );
  }

  if (!stats) return null;

  const { totalPoints, level, progressToNext, badges, streak, totalAnalyses } = stats;
  const isMaxLevel = level.index === LEVELS.length - 1;
  const nextLevel = !isMaxLevel ? LEVELS[level.index + 1] : null;

  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  return (
    <section className="card">
      <span className="section-tag">Gamification</span>
      <h2 style={{ marginTop: 6 }}>Eco Rewards</h2>

      {/* ── Level card ─────────────────────────────────── */}
      <div className="gamification-level-card">
        <div className="gamification-level-icon">{level.icon}</div>
        <div style={{ flex: 1 }}>
          <div className="gamification-level-name">{level.name}</div>
          <div className="gamification-level-sub">
            {isMaxLevel
              ? "Maximum level reached — congratulations!"
              : `${totalPoints} / ${nextLevel.minPoints} pts to ${nextLevel.icon} ${nextLevel.name}`}
          </div>

          <div className="gamification-progress-track">
            <div
              className="gamification-progress-fill"
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────── */}
      <div className="gamification-stats-row">
        <div className="gamification-stat-card">
          <span className="gamification-stat-value">{totalPoints}</span>
          <span className="gamification-stat-label">Eco Points</span>
        </div>
        <div className="gamification-stat-card">
          <span className="gamification-stat-value">
            {streak > 0 ? `🔥 ${streak}` : streak}
          </span>
          <span className="gamification-stat-label">Day Streak</span>
        </div>
        <div className="gamification-stat-card">
          <span className="gamification-stat-value">{totalAnalyses}</span>
          <span className="gamification-stat-label">Analyses</span>
        </div>
        <div className="gamification-stat-card">
          <span className="gamification-stat-value">{earnedBadges.length}</span>
          <span className="gamification-stat-label">Badges</span>
        </div>
      </div>

      {/* ── Badges ─────────────────────────────────────── */}
      <div style={{ marginTop: 20 }}>
        <h3 style={{ margin: "0 0 10px", color: "var(--text)" }}>Badges</h3>

        {earnedBadges.length > 0 && (
          <>
            <p className="gamification-badge-section-label">Earned</p>
            <div className="gamification-badge-grid">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="gamification-badge gamification-badge--earned" title={badge.description}>
                  <span className="gamification-badge-icon">{badge.icon}</span>
                  <span className="gamification-badge-name">{badge.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {lockedBadges.length > 0 && (
          <>
            <p className="gamification-badge-section-label" style={{ marginTop: earnedBadges.length ? 14 : 0 }}>
              Locked
            </p>
            <div className="gamification-badge-grid">
              {lockedBadges.map((badge) => (
                <div key={badge.id} className="gamification-badge gamification-badge--locked" title={badge.description}>
                  <span className="gamification-badge-icon">🔒</span>
                  <span className="gamification-badge-name">{badge.name}</span>
                  <span className="gamification-badge-hint">{badge.description}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {earnedBadges.length === 0 && (
          <p className="empty-text">Run your first product analysis to start earning badges!</p>
        )}
      </div>
    </section>
  );
}

export default GamificationPanel;
