import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/apiClient";

const ALL = "ALL";

export default function BoardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState(ALL);

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

  const categories = useMemo(() => {
    return [ALL, ...new Set(requests.map((item) => item.category).filter(Boolean))];
  }, [requests]);

  const statuses = useMemo(() => {
    return [ALL, ...new Set(requests.map((item) => item.status).filter(Boolean))];
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !keyword ||
        request.title.toLowerCase().includes(keyword) ||
        request.description.toLowerCase().includes(keyword) ||
        request.category.toLowerCase().includes(keyword);

      const matchesCategory = category === ALL || request.category === category;
      const matchesStatus = status === ALL || request.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [requests, search, category, status]);

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

      <section className="filters-bar">
        <input
          type="search"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === ALL ? "All categories" : item}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item === ALL ? "All statuses" : formatStatus(item)}
            </option>
          ))}
        </select>

        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            setSearch("");
            setCategory(ALL);
            setStatus(ALL);
          }}
        >
          Reset
        </button>
      </section>

      {loading && <p>Loading requests...</p>}

      {error && <div className="error-box">{error}</div>}

      {!loading && !error && requests.length === 0 && (
        <div className="empty-state">
          <h2>No published requests yet</h2>
          <p>Once admins publish requests, they will appear here.</p>
        </div>
      )}

      {!loading && !error && requests.length > 0 && filteredRequests.length === 0 && (
        <div className="empty-state">
          <h2>No matching requests</h2>
          <p>Try changing the search or filter values.</p>
        </div>
      )}

      {!loading && !error && filteredRequests.length > 0 && (
        <div className="request-grid">
          {filteredRequests.map((request) => {
            const votes = request._count?.votes ?? 0;

            return (
              <article key={request.id} className="request-card">
                <div className="card-top">
                  <span className="badge">{request.category}</span>
                  <span className="status-badge">{formatStatus(request.status)}</span>
                </div>

                <h2>{request.title}</h2>

                <p className="request-description">{request.description}</p>

                <div className="card-footer">
                  <span>
                    {votes} {votes === 1 ? "vote" : "votes"}
                  </span>

                  <Link to={`/requests/${request.id}`} className="details-link">
                    View details →
                  </Link>
                </div>
              </article>
            );
          })}
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