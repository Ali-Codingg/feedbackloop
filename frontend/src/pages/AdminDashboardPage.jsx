import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiClient";

const STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "PLANNED",
  "IN_PROGRESS",
  "DONE",
  "REJECTED",
];

export default function AdminDashboardPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [analytics, setAnalytics] = useState(null);

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/admin/requests");
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load admin requests");
    } finally {
      setLoading(false);
    }
  }

  async function loadAnalytics() {
    try {
      const data = await apiRequest("/admin/analytics");
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  }

  async function refreshDashboard() {
    await Promise.all([loadRequests(), loadAnalytics()]);
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  async function updateStatus(requestId, status, isPublished) {
    try {
      setBusyId(requestId);
      setError("");
      setSuccess("");

      const updated = await apiRequest(`/admin/requests/${requestId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          isPublished,
        }),
      });

      setRequests((current) =>
        current.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status: updated.status,
                isPublished: updated.isPublished,
                updatedAt: updated.updatedAt,
              }
            : item
        )
      );

      await loadAnalytics();

      setSuccess("Request updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update request");
    } finally {
      setBusyId("");
    }
  }

  async function deleteRequest(requestId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this request? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setBusyId(requestId);
      setError("");
      setSuccess("");

      await apiRequest(`/admin/requests/${requestId}`, {
        method: "DELETE",
      });

      setRequests((current) => current.filter((item) => item.id !== requestId));

      await loadAnalytics();

      setSuccess("Request deleted successfully.");
    } catch (err) {
      setError(err.message || "Failed to delete request");
    } finally {
      setBusyId("");
    }
  }

  async function addUpdate(requestId, message) {
    if (!message.trim()) {
      setError("Update message is required.");
      return;
    }

    try {
      setBusyId(requestId);
      setError("");
      setSuccess("");

      await apiRequest(`/admin/requests/${requestId}/updates`, {
        method: "POST",
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      setSuccess("Status update added successfully.");
    } catch (err) {
      setError(err.message || "Failed to add status update");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className="page admin-page">
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="muted">
            Review submitted requests, publish approved ideas, update their status,
            and add progress updates.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={refreshDashboard}
        >
          Refresh
        </button>
      </div>

      {analytics && (
        <section className="stats-grid admin-stats">
          <div className="stat-card">
            <strong>{analytics.totals.totalRequests}</strong>
            <span>Total requests</span>
          </div>

          <div className="stat-card">
            <strong>{analytics.totals.publishedRequests}</strong>
            <span>Published</span>
          </div>

          <div className="stat-card">
            <strong>{analytics.totals.pendingRequests}</strong>
            <span>Pending</span>
          </div>

          <div className="stat-card">
            <strong>{analytics.totals.totalVotes}</strong>
            <span>Total votes</span>
          </div>

          <div className="stat-card">
            <strong>{analytics.totals.totalUsers}</strong>
            <span>Total users</span>
          </div>
        </section>
      )}

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {loading && <p>Loading admin requests...</p>}

      {!loading && requests.length === 0 && (
        <div className="empty-state">
          <h2>No requests yet</h2>
          <p>Submitted feature requests will appear here.</p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="admin-list">
          {requests.map((request) => (
            <AdminRequestCard
              key={request.id}
              request={request}
              busy={busyId === request.id}
              onUpdateStatus={updateStatus}
              onDelete={deleteRequest}
              onAddUpdate={addUpdate}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function AdminRequestCard({
  request,
  busy,
  onUpdateStatus,
  onDelete,
  onAddUpdate,
}) {
  const [status, setStatus] = useState(request.status);
  const [isPublished, setIsPublished] = useState(request.isPublished);
  const [message, setMessage] = useState("");

  async function handleSave() {
    await onUpdateStatus(request.id, status, isPublished);
  }

  async function handleAddUpdate() {
    await onAddUpdate(request.id, message);
    setMessage("");
  }

  return (
    <article className="admin-card">
      <div className="admin-card-main">
        <div className="card-top">
          <span className="badge">{request.category}</span>
          <span className={request.isPublished ? "published-badge" : "draft-badge"}>
            {request.isPublished ? "Published" : "Unpublished"}
          </span>
        </div>

        <h2>{request.title}</h2>

        <div className="admin-meta">
          <span>Status: {formatStatus(request.status)}</span>
          <span>Votes: {request._count?.votes ?? 0}</span>
          <span>
            Created by:{" "}
            {request.createdBy?.name || request.createdBy?.email || "Unknown"}
          </span>
        </div>

        <div className="admin-form-row">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {formatStatus(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Published
          </label>

          <button
            className="primary-button"
            type="button"
            disabled={busy}
            onClick={handleSave}
          >
            {busy ? "Saving..." : "Save"}
          </button>

          <button
            className="danger-button"
            type="button"
            disabled={busy}
            onClick={() => onDelete(request.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="admin-update-box">
        <label>
          Add status update
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: We are reviewing this request."
            rows={4}
          />
        </label>

        <button
          className="secondary-button"
          type="button"
          disabled={busy || !message.trim()}
          onClick={handleAddUpdate}
        >
          Add Update
        </button>
      </div>
    </article>
  );
}

function formatStatus(status) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}