import { useState } from "react";

const roles = ["user", "admin", "superadmin"];
const mockAccounts = {
  "derrick@ukoolmeow.com": {
    name: "Derrick",
    role: "admin",
    password: "ukoolmeow123",
  },
};

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const account = mockAccounts[normalizedEmail];

    if (account && password !== account.password) {
      setError("Incorrect password for this account.");
      return;
    }

    onLogin({
      id: normalizedEmail,
      name: account?.name || normalizedEmail.split("@")[0] || "User",
      email: normalizedEmail,
      role: account?.role || role,
    });
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <p className="eyebrow">Ukool Meow</p>
        <h1>Sign in to continue</h1>
        <p className="subtitle">
          Access your dashboard and manage roles based on your access level.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@ukoolmeow.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <label className="field">
            <span>Role (mock)</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          {error ? <div className="notice warn">{error}</div> : null}

          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
