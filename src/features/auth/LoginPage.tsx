import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Optional: type for decoded token if needed

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async () => {
      console.log("Attempting login with", { email, password });
      const res = await axios.post("http://localhost:8900/api/login", {
        email,
        password
      }, {
        headers: { "Content-Type": "application/json" },
    });
      return res.data; // contains { token, role }
    },
    onSuccess: (data) => {
      const { token, role } = data;

      // Save both token and role to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ role }));

      // Redirect to dashboard
      window.location.href = "/dashboard";
    },
    onError: () => {
      setError("Invalid email or password. Try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate();
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", paddingTop: "60px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
          />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}