function ReportHistory({ history, onLoadItem, onClear }) {
  return (
    <section className="card history-card">
      <div className="card-header history-header">
        <div>
          <span className="section-tag">History</span>
          <h2>Recent Reports</h2>
        </div>
        <button className="btn btn-ghost" type="button" onClick={onClear} disabled={!history.length}>
          Clear
        </button>
      </div>

      {!history.length ? (
        <p className="empty-text">No saved reports yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id}>
              <button className="history-item" type="button" onClick={() => onLoadItem(item)}>
                <div>
                  <strong>{item.report?.productName || "Unknown Product"}</strong>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <span className="score-chip">
                  Score {item.report?.overallSustainabilityScore ?? "-"}
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