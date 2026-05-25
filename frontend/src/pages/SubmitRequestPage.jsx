import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiClient";

export default function SubmitRequestPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "UI",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdRequest, setCreatedRequest] = useState(null);

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCreatedRequest(null);

    if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
      setError("Title, description, and category are required.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/requests", {
        method: "POST",
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category.trim(),
        }),
      });

      setCreatedRequest(data);

      setForm({
        title: "",
        description: "",
        category: "UI",
      });
    } catch (err) {
      setError(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <Link to="/" className="details-link">
        ← Back to board
      </Link>

      <h1>Submit Feature Request</h1>
      <p className="muted">
        Share an idea with the team. New requests are reviewed by an admin before appearing on the public board.
      </p>

      {error && <div className="error-box">{error}</div>}

      {createdRequest && (
        <div className="success-box">
          <strong>Request submitted successfully.</strong>
          <p>
            Status: <strong>{formatStatus(createdRequest.status)}</strong>. It will appear publicly after admin approval.
          </p>

          <div className="success-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setCreatedRequest(null)}
            >
              Submit another
            </button>

            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Back to board
            </button>
          </div>
        </div>
      )}

      {!createdRequest && (
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={updateField}
              placeholder="Example: Dark mode"
              required
            />
          </label>

          <label>
            Category
            <select name="category" value={form.category} onChange={updateField}>
              <option value="UI">UI</option>
              <option value="Performance">Performance</option>
              <option value="Security">Security</option>
              <option value="Reporting">Reporting</option>
              <option value="Integration">Integration</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Explain the problem, who needs it, and why it matters."
              rows={6}
              required
            />
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      )}
    </main>
  );
}

function formatStatus(status) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}