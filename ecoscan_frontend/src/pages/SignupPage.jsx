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
    <section className="page-section">
      <span className="eyebrow">Account</span>
      <h1>Sign Up</h1>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit} className="form-grid">
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
            <Link className="btn btn-ghost" to="/login">Already have an account?</Link>
          </div>
        </form>

        {error && <div className="alert error" style={{ marginTop: 14 }}>{error}</div>}
      </div>
    </section>
  );
}

export default SignupPage;