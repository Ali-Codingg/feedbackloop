import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginSession } = useAuth();

  const [form, setForm] = useState({
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
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      loginSession({
        user: data.user,
        token: data.token,
      });

      if (data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <h1>Login</h1>
      <p className="muted">Login to submit and vote on feature requests.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="admin@feedbackloop.com"
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
            placeholder="Enter your password"
            required
          />
        </label>

        {error && <div className="error-box">{error}</div>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="small-text">
        No account? <Link to="/register">Create one</Link>
      </p>
    </main>
  );
}