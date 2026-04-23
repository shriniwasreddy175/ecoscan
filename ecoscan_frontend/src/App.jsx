import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import PageContainer from "./components/layout/PageContainer";
import HomePage from "./pages/HomePage";
import AnalyzerPage from "./pages/AnalyzerPage";
import AboutPage from "./pages/AboutPage";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <PageContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyzer" element={<AnalyzerPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </PageContainer>
    </div>
  );
}

export default App;