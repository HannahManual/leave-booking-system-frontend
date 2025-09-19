import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./LeaveRequestFormPage.module.css";
import { useNavigate } from "react-router-dom";

export default function LeaveRequestFormPage() {
  const [leaveType, setLeaveType] = useState("PTO");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [remainingLeave, setRemainingLeave] = useState<number | null>(null);
  const navigate = useNavigate();

  // ✅ Fetch remaining leave balance (with credentials)
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await axios.get("/api/leave/remaining", {
          withCredentials: true,
        });
        setRemainingLeave(res.data.remainingLeaveHours);
      } catch (err) {
        console.error("Failed to fetch remaining leave:", err);
        setError("Failed to fetch remaining leave.");
      }
    };

    fetchLeave();
  }, []);

  // ✅ Submit new leave request (with credentials)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        "/api/leave",
        { type: leaveType, startDate, endDate, reason },
        { withCredentials: true }
      );
      setSuccess(true);
      setError("");
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to submit leave request.");
      setSuccess(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Request Leave</h2>
      <p className={styles.remaining}>
        Remaining Leave: {remainingLeave !== null ? `${remainingLeave} hours` : "Loading..."}
      </p>

      <form onSubmit={handleSubmit}>
        <label>Leave Type:</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          <option value="PTO">PTO</option>
          <option value="Sick">Sick</option>
          <option value="Half-Day">Half-Day</option>
        </select>

        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <label>Reason (optional):</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />

        <button type="submit" className={styles.submitBtn}>
          Submit Request
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Leave request submitted successfully!</p>}
      </form>

      {/* Back to Dashboard Button */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            backgroundColor: "#6a0dad",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}