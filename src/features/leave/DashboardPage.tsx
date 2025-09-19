import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("roleId");

    if (!storedRole) {
      navigate("/login");
    } else {
      setRoleId(parseInt(storedRole));
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  const adminDashboard = (
    <div>
      <h2 className={styles.heading}>Welcome Admin!</h2>
      <div className={styles.dashboardButtons}>
        <button className={styles.button} onClick={() => navigate("/request-leave")}>Make A New Request</button>
        <button className={styles.button} onClick={() => navigate("/view-requests")}>View Requests</button>
        <button className={styles.button} onClick={() => navigate("/create-user")}>Create New User</button>
        <button className={styles.button} onClick={() => navigate("/amend-leave")}>Amend Annual Leave Balance</button>
        <button className={styles.button} onClick={() => navigate("/system-usage")}>System Usage</button>
      </div>
    </div>
  );

  const managerDashboard = (
    <div>
      <h2 className={styles.heading}>Welcome Manager!</h2>
      <div className={styles.dashboardButtons}>
        <button className={styles.button} onClick={() => navigate("/request-leave")}>Make A New Request</button>
        <button className={styles.button} onClick={() => navigate("/view-requests")}>View Requests</button>
      </div>
    </div>
  );

  const employeeDashboard = (
    <div>
      <h2 className={styles.heading}>Welcome Employee!</h2>
      <div className={styles.dashboardButtons}>
        <button className={styles.button} onClick={() => navigate("/request-leave")}>Make A New Request</button>
        <button className={styles.button} onClick={() => navigate("/view-requests")}>View Requests</button>
        <button className={styles.button} onClick={() => navigate("/view-remaining-leave")}>View Remaining Leave</button>
        <button className={styles.button} onClick={() => navigate("/cancel-request")}>Cancel A Request</button>
      </div>
    </div>
  );

  if (roleId === 3) return adminDashboard;
  if (roleId === 2) return managerDashboard;
    return employeeDashboard;
  }