import { useParams } from "react-router-dom";

export default function RequestDetailsPage() {
  const { id } = useParams();

  return (
    <main className="page">
      <h1>Request Details</h1>
      <p>Request ID: {id}</p>
    </main>
  );
}