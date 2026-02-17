import "./App.css";
import { useState } from "react";
import AdminConsole from "./components/AdminConsole";
import LoginForm from "./components/LoginForm";
import MeowSearch from "./components/MeowSearch";

function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showAdminConsole, setShowAdminConsole] = useState(false);

//   const handleLogin = (user) => {
//     setCurrentUser(user);
//     setShowAdminConsole(false);
//   };

//   const handleLogout = () => {
//     setCurrentUser(null);
//     setShowAdminConsole(false);
//   };

//   if (!currentUser) {
//     return <LoginForm onLogin={handleLogin} />;
//   }

//   const canViewAdmin = ["admin", "superadmin"].includes(currentUser.role);

  return (

    <div>
      <MeowSearch />
    </div>
    // <div className="home-shell">
      
    //   <header className="home-header">
    //     <div>
    //       <p className="eyebrow">Welcome back</p>
    //       <h1>Ukool Meow Home</h1>
    //       <p className="subtitle">
    //         Signed in as {currentUser.name} ({currentUser.role}).
    //       </p>
    //     </div>
    //     <button type="button" className="login-button" onClick={handleLogout}>
    //       Sign out
    //     </button>
    //   </header>

    //   <section className="home-panel">
    //     <h2>Dashboard</h2>
    //     <p className="panel-subtitle">
    //       Your main content goes here. Admin tools are available by role.
    //     </p>
    //     {canViewAdmin ? (
    //       <button
    //         type="button"
    //         className="google-button"
    //         onClick={() => setShowAdminConsole((prev) => !prev)}
    //       >
    //         {showAdminConsole ? "Hide" : "Open"} Admin Console
    //       </button>
    //     ) : (
    //       <div className="notice warn">
    //         Admin console is hidden for your role.
    //       </div>
    //     )}
    //   </section>

    //   {showAdminConsole && canViewAdmin ? <AdminConsole /> : null}

    //   <MeowSearch />
    // </div>
  );
}

export default App;
