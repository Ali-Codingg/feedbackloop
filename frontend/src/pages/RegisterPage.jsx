import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../context/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { loginSession } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      loginSession({
        user: data.user,
        token: data.token,
      });

      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <h1>Create Account</h1>
      <p className="muted">Register to submit feature requests and vote.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={updateField}
            placeholder="Your name"
            required
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="Minimum 6 characters"
            required
          />
        </label>

        {error && <div className="error-box">{error}</div>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="small-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}