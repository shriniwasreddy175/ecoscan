import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/analyzer");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <section className="auth-page page-section">
      <div className="auth-layout">
        <aside className="auth-intro">
          <span className="eyebrow">EcoScan account</span>
          <h1>Pick up where your impact story left off.</h1>
          <p>Sign in to revisit product analyses, compare materials, and keep your sustainability progress in one place.</p>
          <div className="auth-stat-list">
            <span><strong>01</strong> Analyze product impact</span>
            <span><strong>02</strong> Track your progress</span>
            <span><strong>03</strong> Make better choices</span>
          </div>
        </aside>

        <div className="auth-card card">
          <div className="auth-card-heading">
            <span className="section-tag">Welcome back</span>
            <h2>Login</h2>
            <p>Use your EcoScan account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="form-grid auth-form">
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </label>

            <div className="full-width form-actions auth-actions">
              <button className="btn btn-primary" type="submit">Login</button>
              <Link className="btn btn-secondary" to="/signup">Create account</Link>
            </div>
          </form>

          {error && <div className="alert error">{error}</div>}
        </div>
      </div>
    </section>
  );
}

export default LoginPage;