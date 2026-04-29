function ReportHistory({ history, loading, onLoadItem }) {
  return (
    <section className="card history-card">
      <div className="card-header history-header">
        <div>
          <span className="section-tag">History</span>
          <h2>Recent Product Reports</h2>
        </div>
      </div>

      {loading ? (
        <p className="empty-text">Loading history...</p>
      ) : !history.length ? (
        <p className="empty-text">No history available yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.productId}>
              <button
                className="history-item"
                type="button"
                onClick={() => onLoadItem(item)}
              >
                <div>
                  <strong>{item.productName || "Unknown Product"}</strong>
                  <span>
                    {item.category || "Uncategorized"}
                    {" • "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "No timestamp"}
                  </span>
                </div>
                <span className="score-chip">
                  Score {item.overallSustainabilityScore ?? "-"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ReportHistory;