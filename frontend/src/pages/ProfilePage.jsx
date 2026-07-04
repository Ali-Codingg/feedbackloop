import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/apiClient";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/profile");
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="page">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <div className="error-box">{error}</div>
      </main>
    );
  }

  const { user, stats, recentRequests } = profile;

  return (
    <main className="page">
      <div className="page-header">
        <div>
          <h1>User Profile</h1>
          <p className="muted">
            View your account information and activity inside FeedbackLoop.
          </p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-avatar">
          {(user.name || user.email || "U")[0].toUpperCase()}
        </div>

        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="status-badge">{user.role}</span>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <strong>{stats.submittedRequestsCount}</strong>
          <span>Submitted requests</span>
        </div>

        <div className="stat-card">
          <strong>{stats.votesCount}</strong>
          <span>Votes cast</span>
        </div>

        <div className="stat-card">
          <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
          <span>Joined date</span>
        </div>
      </section>

      <section className="updates-section">
        <h2>Recent Submitted Requests</h2>

        {recentRequests.length === 0 ? (
          <div className="empty-state">
            <p>You have not submitted any requests yet.</p>
          </div>
        ) : (
          <div className="admin-list">
            {recentRequests.map((request) => (
              <article key={request.id} className="request-card">
                <div className="card-top">
                  <span className="badge">{request.category}</span>
                  <span
                    className={
                      request.isPublished ? "published-badge" : "draft-badge"
                    }
                  >
                    {request.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>

                <h2>{request.title}</h2>

                <p className="muted">
                  Status: {formatStatus(request.status)} ·{" "}
                  {request._count?.votes ?? 0} votes
                </p>

                {request.isPublished && (
                  <Link to={`/requests/${request.id}`} className="details-link">
                    View details →
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
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