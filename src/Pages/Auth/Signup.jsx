import { useState } from "react"
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"
import { toast } from "react-toastify";

function Signup() {
  const Navigate = useNavigate()
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({})

  function handleInput(e) {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError({});
  }

  function ValidateFrom() {
    let Newerror = {}
  
    if (!input.username.trim()) {
      Newerror.user = "Username is required"
    }

    if (!input.email.trim()) {
      Newerror.email = "Email is required"
    }

    if (!input.password.trim()) {
      Newerror.password = "Password is required"
    }

    setError(Newerror);
    return Object.keys(Newerror).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!ValidateFrom()) {
      return;
    }

    try {
      await api.post("/auth/register", input)
      setInput({ username: "", email: "", password: "" });
      setError({});
      toast.success("Registration successful!");


      Navigate("/Login")


    } catch (error) {
      console.error("Error registering user:", error);
      setError({ general: error.response?.data?.message || "Server error, please try again" })
    }
  }

  return (
    <div className="signup-continer">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Account</h2>
        {error.general && <p className="error-message general-error">{error.general}</p>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            name="username"
            placeholder="Enter-userName"
            value={input.username}
            onChange={handleInput}
          />
          {error.user && <p className="error-message">{error.user}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            type="email"
            name="email"
            placeholder="Enter-email"
            value={input.email}
            onChange={handleInput}
          />
          {error.email && <p className="error-message">{error.email}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            name="password"
            placeholder="Enter-password"
            value={input.password}
            onChange={handleInput}
          />
          {error.password && <p className="error-message">{error.password}</p>}
        </div>

        <button className="signup-btn" type="submit">Register</button>
        <p className="redirect-text">
          Already have an account? <span className="redirect-link" onClick={() => Navigate("/Login")}>Login here</span>
        </p>
      </form>
    </div>
  )
}

export default Signup