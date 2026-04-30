import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import PageContainer from "./components/layout/PageContainer";
import HomePage from "./pages/HomePage";
import AnalyzerPage from "./pages/AnalyzerPage";
import ComparisonPage from "./pages/ComparisonPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import { AuthProvider } from "./hooks/useAuth";

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("ecoscan-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ecoscan-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  return (
    <AuthProvider>
      <div className="app-shell">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <PageContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyzer" element={<AnalyzerPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </PageContainer>
      </div>
    </AuthProvider>
  );
}

export default App;