import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/apiClient";

export default function BoardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/requests");
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>Public Feedback Board</h1>
          <p className="muted">
            Browse published feature requests and see what the community is asking for.
          </p>
        </div>

        <Link to="/submit" className="primary-button">
          Submit Request
        </Link>
      </div>

      {loading && <p>Loading requests...</p>}

      {error && <div className="error-box">{error}</div>}

      {!loading && !error && requests.length === 0 && (
        <div className="empty-state">
          <h2>No published requests yet</h2>
          <p>Once admins publish requests, they will appear here.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && (
        <div className="request-grid">
          {requests.map((request) => (
            <article key={request.id} className="request-card">
              <div className="card-top">
                <span className="badge">{request.category}</span>
                <span className="status-badge">{formatStatus(request.status)}</span>
              </div>

              <h2>{request.title}</h2>

              <p className="request-description">{request.description}</p>

              <div className="card-footer">
              <span>
                {request._count?.votes ?? 0} {(request._count?.votes ?? 0) === 1 ? "vote" : "votes"}
                </span>

                <Link to={`/requests/${request.id}`} className="details-link">
                  View details →
                </Link>
              </div>
            </article>
          ))}
        </div>
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