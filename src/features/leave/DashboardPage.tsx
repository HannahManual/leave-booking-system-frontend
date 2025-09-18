import styles from "./DashboardPage.module.css"; 

export default function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const name = user.name || "User";

  const adminDashboard = (
    <div>
      <h2 className={styles.heading}>Welcome {name}!</h2>
      <div className={styles.dashboardButtons}>
        <button className={styles.button}>Make A New Request</button>
        <button className={styles.button}>View Requests</button>
        <button className={styles.button}>Create New User</button>
        <button className={styles.button}>Amend Annual Leave Balance</button>
        <button className={styles.button}>System Usage</button>
      </div>
    </div>
  );

  const employeeDashboard = (
    <div>
      <h2 className={styles.heading}>Welcome {name}!</h2>
      <div className={styles.dashboardButtons}>
        <button className={styles.button}>Make A New Request</button>
        <button className={styles.button}>View Requests</button>
        <button className={styles.button}>View Remaining Leave</button>
        <button className={styles.button}>Cancel A Request</button>
      </div>
    </div>
  );

  return role === "admin" ? adminDashboard : employeeDashboard;
}