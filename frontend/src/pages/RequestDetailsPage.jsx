import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api/apiClient";
import { useAuth } from "../context/useAuth";

export default function RequestDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [request, setRequest] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [voteSummary, setVoteSummary] = useState({
    voteCount: 0,
    hasVoted: false,
  });

  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");

  async function loadDetails() {
    try {
      setLoading(true);
      setError("");

      const requestData = await apiRequest(`/requests/${id}`);
      setRequest(requestData);

      const updatesData = await apiRequest(`/requests/${id}/updates`);
      setUpdates(updatesData.updates || []);

      setVoteSummary({
        voteCount: requestData._count?.votes ?? 0,
        hasVoted: false,
      });

      if (isAuthenticated) {
        const summary = await apiRequest(`/requests/${id}/vote-summary`);
        setVoteSummary({
          voteCount: summary.voteCount,
          hasVoted: summary.hasVoted,
        });
      }
    } catch (err) {
      setError(err.message || "Failed to load request details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  async function handleVoteToggle() {
    if (!isAuthenticated) {
      setError("Please login to vote.");
      return;
    }

    try {
      setVoting(true);
      setError("");

      if (voteSummary.hasVoted) {
        await apiRequest(`/requests/${id}/vote`, {
          method: "DELETE",
        });

        setVoteSummary((current) => ({
          voteCount: Math.max(0, current.voteCount - 1),
          hasVoted: false,
        }));
      } else {
        const result = await apiRequest(`/requests/${id}/vote`, {
          method: "POST",
        });

        setVoteSummary((current) => ({
          voteCount: result.alreadyVoted ? current.voteCount : current.voteCount + 1,
          hasVoted: true,
        }));
      }
    } catch (err) {
      setError(err.message || "Vote action failed");
    } finally {
      setVoting(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p>Loading request details...</p>
      </main>
    );
  }

  if (error && !request) {
    return (
      <main className="page">
        <div className="error-box">{error}</div>
        <Link to="/" className="details-link">
          ← Back to board
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/" className="details-link">
        ← Back to board
      </Link>

      {error && <div className="error-box page-error">{error}</div>}

      <section className="details-hero">
        <div>
          <div className="card-top details-tags">
            <span className="badge">{request.category}</span>
            <span className="status-badge">{formatStatus(request.status)}</span>
          </div>

          <h1>{request.title}</h1>
          <p className="details-description">{request.description}</p>
        </div>

        <div className="vote-panel">
          <strong>{voteSummary.voteCount}</strong>
          <span>{voteSummary.voteCount === 1 ? "vote" : "votes"}</span>

          <button
            className={voteSummary.hasVoted ? "secondary-button" : "primary-button"}
            onClick={handleVoteToggle}
            disabled={voting}
          >
            {voting
              ? "Saving..."
              : voteSummary.hasVoted
              ? "Remove Vote"
              : "Vote"}
          </button>
        </div>
      </section>

      <section className="updates-section">
        <h2>Status Updates</h2>

        {updates.length === 0 ? (
          <div className="empty-state">
            <p>No updates yet.</p>
          </div>
        ) : (
          <div className="timeline">
            {updates.map((update) => (
              <article key={update.id} className="timeline-item">
                <p>{update.message}</p>
                <span>
                  By {update.createdBy?.name || "Admin"} ·{" "}
                  {new Date(update.createdAt).toLocaleString()}
                </span>
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