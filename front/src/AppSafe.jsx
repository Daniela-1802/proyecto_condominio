import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

function Private({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
}

function Login() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Login OK</h2>
      <button onClick={() => { localStorage.setItem("access","demo"); window.location.hash="#/dashboard"; }}>
        Entrar
      </button>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard OK</h2>
      <p><Link to="/usuarios">Ir a Usuarios</Link></p>
    </div>
  );
}

function Usuarios() {
  return <div style={{ padding: 24 }}><h2>Usuarios OK</h2></div>;
}

export default function AppSafe() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Private><Dashboard /></Private>} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/usuarios" element={<Private><Usuarios /></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
