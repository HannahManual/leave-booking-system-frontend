import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SystemUsage.module.css";
import { useNavigate } from "react-router-dom";

interface UsageData {
  totalUsers: number;
  totalRequests: number;
  statusBreakdown: {
    status: string;
    count: number;
  }[];
}

export default function SystemUsage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await axios.get("http://localhost:8900/api/leave/usage", {
          withCredentials: true,
        });
        setUsage(res.data.data);
      } catch (err: any) {
        console.error("Error fetching system usage:", err);
        setError("Failed to load system usage stats.");
      }
    };

    fetchUsage();
  }, []);

  return (
    <div className={styles.container}>
      <h2>📊 System Usage</h2>

      {error && <p className={styles.error}>{error}</p>}

      {usage ? (
        <div className={styles.statsBox}>
          <p><strong>Total Users:</strong> {usage.totalUsers}</p>
          <p><strong>Total Leave Requests:</strong> {usage.totalRequests}</p>

          <h3>Status Breakdown</h3>
          <ul>
            {usage.statusBreakdown.map((item) => (
              <li key={item.status}>
                <span className={styles.status}>{item.status}</span>: {item.count}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !error && <p>Loading...</p>
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
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
