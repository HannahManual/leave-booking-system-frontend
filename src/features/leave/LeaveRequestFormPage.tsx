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

  // Fetch remaining leave balance
  useEffect(() => {
    const fetchLeave = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8900/api/leave/remaining", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRemainingLeave(res.data.remainingLeaveHours);
      } catch (err) {
        console.error("Failed to fetch remaining leave:", err);
        setError("Failed to fetch remaining leave.");
      }
    };

    fetchLeave();
  }, []);

  // Submit new leave request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8900/api/leave",
        { type: leaveType, startDate, endDate, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(true);
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to submit leave request.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Request Leave</h2>
      <p className={styles.remaining}>Remaining Leave: {remainingLeave} hours</p>

      <form onSubmit={handleSubmit}>
        <label>Leave Type:</label>
        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
          <option value="PTO">PTO</option>
          <option value="Sick">Sick</option>
          <option value="Half-Day">Half-Day</option>
        </select>

        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

        <label>Reason (optional):</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} />

        <button type="submit" className={styles.submitBtn}>Submit Request</button>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Leave request submitted successfully!</p>}

        <div className={styles.backLink}>
          <button onClick={() => navigate("/dashboard")}>&#8592; Back to Dashboard</button>
        </div>
      </form>
    </div>
  );
}
