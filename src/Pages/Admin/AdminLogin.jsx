import { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./AdminLogin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { Login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/admin/adminlogin", { email, password });

      Login({
        id: res.data.user.id,
        name: res.data.user.username,
        email: res.data.user.email,
        role: res.data.user.role,
        isLoggedin: true,
      });

      navigate("/adminpanel/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1 className="admin-title">Welcome Back Admin</h1>
        <p className="admin-subtitle">Login to manage your store</p>

        <form onSubmit={handleSubmit} className="admin-form">
          {error && <p className="admin-error">{error}</p>}

          <div className="admin-input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
