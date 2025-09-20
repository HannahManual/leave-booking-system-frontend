import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewRemainingLeavePage.module.css';
import { useNavigate } from 'react-router-dom';

const ViewRemainingLeavePage = () => {
  const navigate = useNavigate();
  const [remainingLeave, setRemainingLeave] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className={styles.container}>
      <h2 className={styles.heading} id="remaining-leave-title">Your Remaining Annual Leave</h2>

      {loading ? (
        <p className={styles.loading} role="status">Loading...</p>
      ) : error ? (
        <p className={styles.error} role="alert">{error}</p>
      ) : (
        <div className={styles.leaveCard} role="status" aria-live="polite" aria-label="Annual leave balance card">
          <p>You have</p>
          <h1 className={styles.leaveAmount}>{remainingLeave} hours</h1>
          <p>of annual leave left.</p>
        </div>
      )}

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
          aria-label="Return to dashboard"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ViewRemainingLeavePage;