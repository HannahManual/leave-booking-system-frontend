import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./CreateUserPage.module.css";

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    roleId: "1", 
    departmentId: "1",
    annualLeaveBalance: "0",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post(
        "/api/users",
        {
          ...formData,
          roleId: parseInt(formData.roleId),
          departmentId: parseInt(formData.departmentId),
          annualLeaveBalance: parseInt(formData.annualLeaveBalance),
        },
        { withCredentials: true }
      );
      setSuccess(true);
      setFormData({
        firstName: "",
        surname: "",
        email: "",
        password: "",
        roleId: "1",
        departmentId: "1",
        annualLeaveBalance: "0",
      });
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.response?.data?.error || "Failed to create user.");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create New User</h2>

      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label>Surname:</label>
        <input
          name="surname"
          type="text"
          value={formData.surname}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Role:</label>
        <select name="roleId" value={formData.roleId} onChange={handleChange}>
          <option value="1">Employee</option>
          <option value="2">Manager</option>
          <option value="3">Admin</option>
        </select>

        <label>Department ID:</label>
        <input
          name="departmentId"
          type="number"
          value={formData.departmentId}
          onChange={handleChange}
          required
        />

        <label>Annual Leave Balance (hours):</label>
        <input
          name="annualLeaveBalance"
          type="number"
          value={formData.annualLeaveBalance}
          onChange={handleChange}
          required
        />

        <button type="submit">Create User</button>

        {success && <p className={styles.success}>✅ User created successfully!</p>}
        {error && <p className={styles.error}>❌ {error}</p>}

        <div className={styles.backLink}>
          <button type="button" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}
