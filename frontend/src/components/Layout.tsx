import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/students", label: "Students" },
  { to: "/books", label: "Books" },
  { to: "/staff", label: "Staff" },
  { to: "/borrows", label: "Borrowing" },
  { to: "/schema/functions", label: "Functions" },
  { to: "/schema/procedures", label: "Procedures" },
  { to: "/schema/triggers", label: "Triggers" },
  { to: "/schema/reference", label: "Schema Manual" },
];

export function Layout() {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar__inner">
          <h1 className="brand">Library Manager</h1>
          <div className="top-bar__controls">
            <nav className="navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link--active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {user && (
              <div className="user-menu">
                <div className="user-menu__meta">
                  <span className="user-menu__email">{user.email}</span>
                  <span
                    className={`user-menu__role user-menu__role--${user.role}`}
                  >
                    {isAdmin ? "Admin" : "Viewer"}
                  </span>
                </div>
                <button className="user-menu__logout" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
