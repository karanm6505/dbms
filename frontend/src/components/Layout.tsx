import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/students", label: "Students" },
  { to: "/books", label: "Books" },
  { to: "/staff", label: "Staff" },
  { to: "/borrows", label: "Borrowing" },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar__inner">
          <h1 className="brand">Library Manager</h1>
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
