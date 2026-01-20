import { useState } from "react";
import API from "../../services/api";

import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const register = async () => {
    console.log("REGISTER DATA:", { name, email, password, role });
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
        role
      });
      navigate("/login");
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          onChange={e => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <select onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="rider">Rider</option>
        </select>

        <button onClick={register}>Register</button>

        <p style={{ marginTop: 16 }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
