import { useEffect, useMemo, useState } from "react";
import {
  getIdToken,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const initialUsers = [
  { id: 1, name: "derrick Lim", email: "derrick@ukoolmeow.com", role: "user" },
  { id: 2, name: "peter lim", email: "peter@ukoolmeow.com", role: "admin" },
  { id: 3, name: "Priya Nair", email: "priya@ukoolmeow.com", role: "user" },
  { id: 4, name: "Marco Ong", email: "marco@ukoolmeow.com", role: "user" },
  { id: 5, name: "Zara Lee", email: "zara@ukoolmeow.com", role: "admin" },
];

const roles = ["user", "admin", "superadmin"];
const emptyUser = {
  id: "",
  name: "Guest",
  email: "Not signed in",
  role: "user",
};

function AdminConsole() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [passwordDrafts, setPasswordDrafts] = useState({});
  const [authNotice, setAuthNotice] = useState("");
  const [authError, setAuthError] = useState("");
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(emptyUser);

  const apiBase = process.env.REACT_APP_API_BASE_URL || "";

  const canManageRoles = currentUser.role === "superadmin";

  const visibleUsers = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return users;
    }
    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        value.toLowerCase().includes(trimmed)
      )
    );
  }, [query, users]);

  const handleRoleChange = (userId, nextRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: nextRole } : user
      )
    );
    setNotice("Role updated. Connect this to your API to persist changes.");
  };

  const handlePasswordChange = (userId, value) => {
    setPasswordDrafts((prev) => ({
      ...prev,
      [userId]: value,
    }));
  };

  const handlePasswordSave = (userId) => {
    const nextPassword = passwordDrafts[userId] || "";
    if (!nextPassword.trim()) {
      setNotice("Password cannot be empty.");
      return;
    }

    setNotice("Password updated (mock). Connect this to your API.");
    setPasswordDrafts((prev) => ({
      ...prev,
      [userId]: "",
    }));
  };

  const exchangeGoogleToken = async (firebaseUser) => {
    const idToken = await getIdToken(firebaseUser, true);
    const response = await fetch(`${apiBase}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify Google sign-in on the server.");
    }

    const data = await response.json();
    const profile = data?.user || {};

    setCurrentUser({
      id: profile.id || firebaseUser.uid,
      name: profile.name || firebaseUser.displayName || "Unknown",
      email: profile.email || firebaseUser.email || "",
      role: profile.role || "user",
    });
    setAuthNotice("Google sign-in verified. Role loaded from server.");
  };

  const handleGoogleConnect = async () => {
    setAuthNotice("");
    setAuthError("");
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(error?.message || "Google sign-in failed.");
      setAuthLoading(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    setAuthError("");
    setAuthNotice("");
    setAuthLoading(true);
    try {
      await signOut(auth);
      setCurrentUser(emptyUser);
      setAuthNotice("Signed out.");
    } catch (error) {
      setAuthError(error?.message || "Sign out failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (!user) {
        setCurrentUser(emptyUser);
        setAuthLoading(false);
        return;
      }

      try {
        await exchangeGoogleToken(user);
      } catch (error) {
        setAuthError(error?.message || "Unable to verify Google sign-in.");
      } finally {
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Ukool Meow Admin Console</p>
          <h1>Assign who becomes an admin</h1>
          <p className="subtitle">
            Superadmins can promote users, keep admins in check, and verify role
            ownership in one place.
          </p>
        </div>
        <div className="hero-card">
          <p className="card-label">Signed in as</p>
          <p className="card-name">{currentUser.name}</p>
          <p className="card-meta">{currentUser.email}</p>
          <span className={`role-badge role-${currentUser.role}`}>
            {currentUser.role}
          </span>
        </div>
      </header>

      <section className="auth-panel">
        <div>
          <h2>Google Authentication</h2>
          <p className="panel-subtitle">
            Connect Google sign-in to verify who can access admin controls.
          </p>
        </div>
        <div className="auth-actions">
          <span
            className={`status-badge ${
              authLoading
                ? "status-loading"
                : authUser
                ? "status-on"
                : "status-off"
            }`}
          >
            {authLoading
              ? "Connecting"
              : authUser
              ? "Connected"
              : "Not connected"}
          </span>
          {!authUser ? (
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleConnect}
              disabled={authLoading}
            >
              <span className="google-mark">G</span>
              Connect Google
            </button>
          ) : (
            <button
              type="button"
              className="google-button google-secondary"
              onClick={handleGoogleDisconnect}
              disabled={authLoading}
            >
              Disconnect
            </button>
          )}
        </div>
      </section>
      {authNotice ? <div className="notice info">{authNotice}</div> : null}
      {authError ? <div className="notice warn">{authError}</div> : null}

      <main className="panel">
        <div className="panel-header">
          <div>
            <h2>Role Assignment</h2>
            <p className="panel-subtitle">
              Update user roles instantly (mock data for now).
            </p>
          </div>
          <div className="search-wrap">
            <input
              type="search"
              placeholder="Search by name, email, or role"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>

        {!canManageRoles ? (
          <div className="notice warn">Only superadmins can manage roles.</div>
        ) : null}
        {notice ? <div className="notice info">{notice}</div> : null}

        <div className="table">
          <div className="table-row table-head">
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Password</span>
          </div>

          {visibleUsers.map((user, index) => (
            <div
              key={user.id}
              className="table-row"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
              <span>
                <span className={`role-badge role-${user.role}`}>
                  {user.role}
                </span>
              </span>
              <span>
                <select
                  value={user.role}
                  disabled={!canManageRoles}
                  onChange={(event) =>
                    handleRoleChange(user.id, event.target.value)
                  }
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </span>
              <span className="password-cell">
                <input
                  className="password-input"
                  type="password"
                  placeholder="Set new password"
                  value={passwordDrafts[user.id] || ""}
                  disabled={!canManageRoles}
                  onChange={(event) =>
                    handlePasswordChange(user.id, event.target.value)
                  }
                />
                <button
                  type="button"
                  className="mini-button"
                  disabled={!canManageRoles}
                  onClick={() => handlePasswordSave(user.id)}
                >
                  Set
                </button>
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default AdminConsole;
