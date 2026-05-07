import ProductForm from "../components/analyzer/ProductForm";
import ResultsPanel from "../components/analyzer/ResultsPanel";
import ReportHistory from "../components/analyzer/ReportHistory";
import HistoryTrendChart from "../components/analyzer/HistoryTrendChart";
import { useProductAnalyzer } from "../hooks/useProductAnalyzer";
import { useAuth } from "../hooks/useAuth";

function AnalyzerPage() {
  const auth = useAuth();
  const {
    form,
    loading,
    historyLoading,
    error,
    result,
    history,
    progressValue,
    handleChange,
    resetForm,
    runAnalysis,
    applyHistoryItem,
    deleteHistoryItem,
    clearHistory,
    setError,
    setResult,
    setForm,
  } = useProductAnalyzer();

  const isGuest = !auth?.user?.userId;

  const fillSampleData = () => {
    setForm({
      name: "Polyester Jacket",
      category: "Clothing",
      price: "1999",
      weight: "1.2",
      material: "Polyester",
      transportDistance: "150",
      description: "Organic Polyester Jacket",
    });
    setError("");
  };

  return (
    <section className="page-section">
      <div className="split-grid">
        <ProductForm
          form={form}
          loading={loading}
          error={error}
          onChange={handleChange}
          onSubmit={runAnalysis}
          onFillSample={fillSampleData}
          onReset={() => {
            resetForm();
            setResult(null);
          }}
        />

        <ResultsPanel result={result} progressValue={progressValue} />
      </div>

      <div className="history-wrap">
        <ReportHistory
          history={history}
          loading={historyLoading}
          onLoadItem={applyHistoryItem}
          onDeleteItem={isGuest ? deleteHistoryItem : null}
          onClearHistory={isGuest ? clearHistory : null}
        />
      </div>

      <div className="history-wrap">
        <HistoryTrendChart history={history} />
      </div>
    </section>
  );
}

export default AnalyzerPage;