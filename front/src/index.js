import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

// 🔽 RESTAURA tus estilos
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// si usas SB Admin 2 u hoja propia, importa DESPUÉS de bootstrap:
import "./styles/sb-admin-2.css";   // <-- ajusta la ruta si tu archivo se llama distinto
import "./index.css";               // (opcional)

import App from "./App";            // 🔽 vuelve a tu App

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);


