import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
    role: "USER",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signup(form);
      navigate("/analyzer");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <section className="auth-page page-section">
      <div className="auth-layout auth-layout-signup">
        <aside className="auth-intro">
          <span className="eyebrow">Join EcoScan</span>
          <h1>Turn everyday products into measurable progress.</h1>
          <p>Create an account to save your analyses, explore comparisons, and build a clearer view of the choices behind every product.</p>
          <div className="auth-highlight">
            <strong>One account. A better view of impact.</strong>
            <span>Your product history stays ready whenever you return.</span>
          </div>
        </aside>

        <div className="auth-card card">
          <div className="auth-card-heading">
            <span className="section-tag">Get started</span>
            <h2>Sign up</h2>
            <p>Set up your EcoScan account in a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="form-grid auth-form">
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>

          <label>
            Organization
            <input name="organization" value={form.organization} onChange={handleChange} />
          </label>

          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>

          <div className="full-width form-actions">
            <button className="btn btn-primary" type="submit">Create account</button>
            <Link className="btn btn-ghost" to="/login">I already have an account</Link>
          </div>
          </form>

          {error && <div className="alert error">{error}</div>}
        </div>
      </div>
    </section>
  );
}

export default SignupPage;