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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRemainingLeave = async () => {
      try {
        const response = await axios.get('http://localhost:8900/api/leave/remaining', {
          withCredentials: true,
        });
        setRemainingLeave(response.data.remainingLeave);
      } catch (err) {
        console.error(err);
        setError('Could not fetch remaining leave balance.');
      } finally {
        setLoading(false);
      }
    };

    fetchRemainingLeave();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < new Date(today.setHours(0, 0, 0, 0))) {
      setError("Start date cannot be in the past");
      return;
    }

    if (end < start) {
      setError("End date must be after start date");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8900/api/leave",
        { type: leaveType, startDate, endDate, reason },
        { withCredentials: true }
      );
      setSuccess(true);
      setError("");
     
      setLeaveType("PTO");
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to submit leave request.");
      setSuccess(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 id="leave-form-title">Request Leave</h2>

      <p className={styles.remaining} data-testid="remaining-leave">
        Remaining Leave: {loading ? "Loading..." : remainingLeave !== null ? `${remainingLeave} hours` : "N/A"}
      </p>

      <form onSubmit={handleSubmit} aria-labelledby="leave-form-title">
        <label htmlFor="leaveType">Leave Type:</label>
        <select
          id="leaveType"
          name="leaveType"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          aria-label="Select type of leave"
        >
          <option value="PTO">PTO</option>
          <option value="Sick">Sick</option>
          <option value="Half-Day">Half-Day</option>
        </select>

        <label htmlFor="startDate">Start Date:</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label htmlFor="endDate">End Date:</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <label htmlFor="reason">Reason (optional):</label>
        <textarea
          id="reason"
          name="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-label="Reason for leave request"
        />

        <button
          type="submit"
          className={styles.submitBtn}
          aria-label="Submit leave request form"
        >
          Submit Request
        </button>

        {error && <p className={styles.error} role="alert" data-testid="form-error">{error}</p>}
        {success && <p className={styles.success} role="status">Leave request submitted successfully!</p>}
      </form>

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
          aria-label="Return to dashboard"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};