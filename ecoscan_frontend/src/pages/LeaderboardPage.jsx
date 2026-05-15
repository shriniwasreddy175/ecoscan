import { useEffect, useState } from "react";
import { fetchLeaderboardApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboardApi(50)
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load leaderboard.");
        setLoading(false);
      });
  }, []);

  return (
    <section className="page-section">
      <span className="eyebrow">Community</span>
      <h1 style={{ marginTop: 8 }}>Eco Leaderboard</h1>
      <p className="lead">
        See how you stack up against other EcoScan users. Rankings are based on
        Eco Points earned from product analyses.
      </p>

      {loading && (
        <div className="card" style={{ marginTop: 20 }}>
          <p className="empty-text">Loading leaderboard…</p>
        </div>
      )}

      {error && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="alert error">{error}</div>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <p className="empty-text">
            No rankings yet — be the first to analyze a product and earn Eco Points!
          </p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="card" style={{ marginTop: 20, padding: 0, overflow: "hidden" }}>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="leaderboard-th leaderboard-th--rank">Rank</th>
                <th className="leaderboard-th">User</th>
                <th className="leaderboard-th leaderboard-th--level">Level</th>
                <th className="leaderboard-th leaderboard-th--points">Eco Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const isMe = user && user.userId === entry.userId;
                return (
                  <tr
                    key={entry.userId}
                    className={`leaderboard-row${isMe ? " leaderboard-row--me" : ""}`}
                  >
                    <td className="leaderboard-td leaderboard-td--rank">
                      {entry.rank <= 3
                        ? <span className="leaderboard-medal">{MEDAL[entry.rank - 1]}</span>
                        : <span className="leaderboard-rank-num">#{entry.rank}</span>}
                    </td>
                    <td className="leaderboard-td">
                      <div className="leaderboard-user">
                        <div className="leaderboard-avatar">
                          {entry.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <div className="leaderboard-name">
                            {entry.fullName}
                            {isMe && <span className="leaderboard-you-badge">You</span>}
                          </div>
                          {entry.organization && (
                            <div className="leaderboard-org">{entry.organization}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="leaderboard-td leaderboard-td--level">
                      <span className="leaderboard-level-badge">
                        {entry.levelIcon} {entry.level}
                      </span>
                    </td>
                    <td className="leaderboard-td leaderboard-td--points">
                      <span className="leaderboard-points">{entry.ecoPoints.toLocaleString()}</span>
                      <span className="leaderboard-pts-label"> pts</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Points guide */}
      <div className="card" style={{ marginTop: 18 }}>
        <span className="section-tag">How points work</span>
        <h2 style={{ marginTop: 6 }}>Earn Eco Points</h2>
        <div className="gamification-how-grid">
          <div className="info-card">
            <h3>⭐ Score ≥ 80</h3>
            <p>20 Eco Points per analysis</p>
          </div>
          <div className="info-card">
            <h3>✅ Score ≥ 60</h3>
            <p>15 Eco Points per analysis</p>
          </div>
          <div className="info-card">
            <h3>🔶 Score ≥ 40</h3>
            <p>10 Eco Points per analysis</p>
          </div>
          <div className="info-card">
            <h3>🔸 Score ≥ 20</h3>
            <p>5 Eco Points per analysis</p>
          </div>
        </div>
      </div>
    </section>
  );
}
