import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { setAuthData } from "../../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    console.log("LOGIN DATA:", { email, password });
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      // VERY IMPORTANT
      setAuthData(res.data);

      if (res.data.role === "rider") {
        navigate("/rider-dashboard");
      } else if (res.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>
          Welcome <span>Back</span>
        </h2>

        <p className="auth-subtitle">
          Login to continue booking rides
        </p>

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

        <button onClick={login}>Login</button>

        <p style={{ marginTop: 16 }}>
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
