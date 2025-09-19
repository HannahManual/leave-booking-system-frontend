import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  const role = user?.role;
  const name = user?.name || "User";

  const adminDashboard = (
    <div>
      <h2 className={styles.heading}>Welcome {name}!</h2>
      <div className={styles.dashboardButtons}>
        <button className={styles.button} onClick={() => navigate("/request-leave")}>Make A New Request</button>
        <button className={styles.button} onClick={() => navigate("/view-requests")}>View Requests</button>
        <button className={styles.button} onClick={() => navigate("/create-user")}>Create New User</button>
        <button className={styles.button} onClick={() => navigate("/amend-leave")}>Amend Annual Leave Balance</button>
        <button className={styles.button} onClick={() => navigate("/system-usage")}>System Usage</button>
      </div>
    </div>
  );

  const employeeDashboard = (
    <div>
      <h2 className={styles.heading}>Welcome {name}!</h2>
      <div className={styles.dashboardButtons}>
        <button className={styles.button} onClick={() => navigate("/request-leave")}>Make A New Request</button>
        <button className={styles.button} onClick={() => navigate("/view-requests")}>View Requests</button>
        <button className={styles.button} onClick={() => navigate("/view-remaining-leave")}>View Remaining Leave</button>
        <button className={styles.button} onClick={() => navigate("/cancel-request")}>Cancel A Request</button>
      </div>
    </div>
  );

  return role === 3 ? adminDashboard : employeeDashboard;
}
