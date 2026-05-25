import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link to="/" className="footer-brand">
            FeedbackLoop
          </Link>
          <p>
            A simple feedback management platform for collecting, reviewing,
            voting, and tracking feature requests.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Board</Link>
          <Link to="/submit">Submit Request</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} FeedbackLoop</span>
        <span>Built as a semester project</span>
      </div>
    </footer>
  );
}