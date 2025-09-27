import React, { useEffect, useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AppFooter from "./components/AppFooter";
import Login from "./pages/Login";
import { getMe, refreshToken } from "./api";

import { Routes, Route, Navigate } from "react-router-dom";
import UsuariosPage from "./features/usuarios/pages/UsuariosPage";
import RolesPage from "./features/roles/pages/RolesPage";

function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // Al cargar, intenta usar tokens guardados
  useEffect(() => {
    async function init() {
      const access = localStorage.getItem("access");
      if (!access) { setChecking(false); return; }

      try {
        const me = await getMe(access);
        setUser(me);
      } catch {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) { setChecking(false); return; }
        try {
          const { access: newAccess } = await refreshToken(refresh);
          localStorage.setItem("access", newAccess);
          const me = await getMe(newAccess);
          setUser(me);
        } catch {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        } finally {
          setChecking(false);
        }
        return;
      }
      setChecking(false);
    }
    init();
  }, []);

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }

  // Mientras verifica tokens
  if (checking) return null;

  // Si no hay sesión, muestra Login
  if (!user) return <Login onLogin={setUser} />;

  // Si hay sesión, layout con rutas
  return (
    <div id="wrapper" className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div id="content-wrapper" className="d-flex flex-column w-100">
        <div id="content">
          <Topbar user={user} onLogout={logout} />

          {/* ⬇️ AQUÍ VAN LAS RUTAS (reemplaza tu contenido anterior) */}
          <div className="container-fluid">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route
                path="/dashboard"
                element={
                  <>
                    <div className="d-flex justify-content-between align-items-center">
                      <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>
                      <button className="btn btn-outline-secondary" onClick={logout}>
                        Cerrar sesión
                      </button>
                    </div>

                    <div className="row">
                      <div className="col-xl-3 col-md-6 mb-4">
                        <div className="card border-left-primary shadow h-100 py-2">
                          <div className="card-body">
                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                              Earnings (Monthly)
                            </div>
                            <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                          </div>
                        </div>
                      </div>
                      {/* ...otras cards si quieres */}
                    </div>
                  </>
                }
              />

              <Route path="/usuarios" element={<UsuariosPage />} />
              <Route path="/roles" element={<RolesPage />} />
              {/* Agrega aquí más rutas cuando las tengas */}
            </Routes>
          </div>
        </div>

        <AppFooter />
      </div>
    </div>
  );
}

export default App;
