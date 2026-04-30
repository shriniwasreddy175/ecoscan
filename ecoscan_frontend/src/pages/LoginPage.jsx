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
    <section className="page-section">
      <span className="eyebrow">Account</span>
      <h1>Login</h1>

      <div className="card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit} className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn btn-primary" type="submit">Login</button>
            <Link className="btn btn-secondary" to="/signup">Sign up</Link>
          </div>
        </form>

        {error && <div className="alert error" style={{ marginTop: 14 }}>{error}</div>}
      </div>
    </section>
  );
}

export default LoginPage;