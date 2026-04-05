import React, { useState } from "react";
import { setToken } from "../../lib/api";
import logo from "../../assets/Logo_oB_quadrat_weiss.png";

const BACKENDURL = import.meta.env.VITE_API_URL;

type Props = {
  onLogin: () => void;
};

const LoginPage = ({ onLogin }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // FastAPI OAuth2PasswordRequestForm requires form-encoded body, not JSON
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${BACKENDURL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        if (token) {
          setToken(token);
          onLogin();
        } else {
          setError("No token received from server");
        }
      } else if (response.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Login failed — please try again");
      }
    } catch {
      setError("Cannot reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Drink Manager</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <input
              className="form-input"
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              className="form-input"
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn btn-primary login-btn" type="submit" disabled={loading}>
            {loading ? <span className="login-spinner" /> : null}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
