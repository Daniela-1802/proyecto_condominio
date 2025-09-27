import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";

// Páginas
import UsuariosPage from "../features/usuarios/pages/UsuariosPage";
import RolesPage from "../features/roles/pages/RolesPage";

// Simples páginas “public/privado”. Aquí asumimos que ya tienes el access en localStorage.
function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/dashboard" replace />;
}

// Placeholder de dashboard
function Dashboard() {
  return <div className="p-3">Dashboard</div>;
}

export default function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="roles" element={<RolesPage />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
