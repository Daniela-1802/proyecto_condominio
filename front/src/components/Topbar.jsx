export default function Topbar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <span className="ml-2">Mi Topbar de CONDOMINIO :)</span>
      <div className="ml-auto">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            window.location.hash = "#/dashboard";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
