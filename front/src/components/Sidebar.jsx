import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const link = ({ isActive }) =>
    [
      "nav-link d-flex align-items-center gap-2 px-3 py-2",
      isActive
        ? "bg-white text-primary rounded fw-semibold" // activo: pastilla blanca y texto azul
        : "link-light",                                 // normal: enlaces claros (blancos)
    ].join(" ");

  return (
    <aside className="bg-primary text-white" style={{ width: 240, minHeight: "100vh" }}>
      <div className="p-3 fs-5">SB ADMIN 2</div>

      <nav className="nav flex-column px-2">
        <NavLink to="/dashboard" className={link}>
          <i className="fas fa-gauge" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/usuarios" className={link}>
          <i className="fas fa-users" />
          <span>Usuarios</span>
        </NavLink>

        <NavLink to="/roles" className={link}>
          <i className="fas fa-user-shield" />
          <span>Roles</span>
        </NavLink>
      </nav>
    </aside>
  );
}

