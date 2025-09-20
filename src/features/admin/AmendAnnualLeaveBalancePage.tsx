import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AmendAnnualLeaveBalancePage.module.css';
import { useNavigate } from 'react-router-dom';
interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

const AmendAnnualLeaveBalancePage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch users on page load
  useEffect(() => {
    axios.get('http://localhost:8900/api/users', { withCredentials: true })
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error(err);
        setErrorMessage('Could not fetch user list');
      });
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      setErrorMessage('Please select a user.');
      return;
    }

    try {
      await axios.put(
        'http://localhost:8900/api/leave/amend-alb',
        { userId: selectedUserId, newBalance },
        { withCredentials: true }
      );
      setSuccessMessage('Leave balance updated successfully.');
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      setSuccessMessage('');
      setErrorMessage('Failed to update leave balance.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Amend Annual Leave Balance</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Select User:</label>
        <select
          value={selectedUserId ?? ''}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>

        <label>New Balance (hours):</label>
        <input
          type="number"
          value={newBalance}
          onChange={(e) => setNewBalance(Number(e.target.value))}
          min={0}
          required
        />

        <button type="submit">Update Balance</button>
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
        >
          ← Back to Dashboard
        </button>
      </div>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  );
};

export default AmendAnnualLeaveBalancePage;
