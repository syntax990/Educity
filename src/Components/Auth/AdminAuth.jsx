import React, { useState } from "react";
import "./Auth.css";

const AdminAuth = ({ onSuccess, onClose }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    adminCode: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleModeSwitch = (nextMode) => {
    setMode(nextMode);
    setForm({ username: "", email: "", password: "", adminCode: "" });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const url =
      mode === "signup"
        ? "http://localhost:4000/api/admin/signup"
        : "http://localhost:4000/api/admin/login";

    const body = {
      username: form.username.trim(),
      password: form.password,
    };

    if (mode === "signup") {
      body.email = form.email.trim();
      body.adminCode = form.adminCode.trim();
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      onSuccess({ ...data, purchasedCourses: data.purchasedCourses || [] });
      setMessage(
        mode === "signup"
          ? "Admin signed up successfully."
          : "Admin login successful.",
      );
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => handleModeSwitch("login")}
          >
            Admin Sign In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => handleModeSwitch("signup")}
          >
            Admin Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          {mode === "signup" && (
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {mode === "signup" && (
            <label>
              Admin Code
              <input
                type="text"
                name="adminCode"
                value={form.adminCode}
                onChange={handleChange}
                required
              />
            </label>
          )}

          <div className="auth-actions">
            <button type="submit" className="btn auth-submit">
              {mode === "signup" ? "Create Admin Account" : "Sign In"}
            </button>
            <button type="button" className="btn auth-close" onClick={onClose}>
              Close
            </button>
          </div>

          {message && <div className="auth-message">{message}</div>}
          {error && <div className="auth-error">{error}</div>}
        </form>
      </div>
    </section>
  );
};

export default AdminAuth;
