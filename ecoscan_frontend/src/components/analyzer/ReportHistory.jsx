function ReportHistory({ history, loading, onLoadItem }) {
  return (
    <section className="card history-card">
      <div className="card-header history-header">
        <div>
          <span className="section-tag">History</span>
          <h2>Recent Reports</h2>
        </div>
      </div>

      {!history.length ? (
        <p className="empty-text">No saved reports yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.productId}>
              <button
                className="history-item"
                type="button"
                onClick={() => onLoadItem(item)}
                disabled={loading}
              >
                <div>
                  <strong>{item.productName || "Unknown Product"}</strong>
                  <span>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Unknown time"}
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
