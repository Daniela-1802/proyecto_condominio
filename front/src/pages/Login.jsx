import { useState } from "react";
import { login, getMe } from "../api";
//import { loginUser, getMe } from "../api";

export default function Login({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e){
    e.preventDefault(); setErr(""); setLoading(true);
    try{
      const { access, refresh } = await login(u, p);
      //const { access, refresh } = await loginUser(u, p); // ← espera {access,refresh}
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      const me = await getMe(access);
      onLogin?.(me); // ← importante para que App deje de mostrar Login
    }catch(ex){ setErr(ex.message || "Usuario/clave inválidos"); }
    finally{ setLoading(false); }
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4" style={{ width: 420 }}>
        <h3 className="mb-3 text-center">Iniciar sesión</h3>
        <form onSubmit={handle}>
          <input className="form-control mb-2" placeholder="Usuario" value={u} onChange={e=>setU(e.target.value)} />
          <input type="password" className="form-control mb-2" placeholder="Contraseña" value={p} onChange={e=>setP(e.target.value)} />
          <button className="btn btn-primary w-100" disabled={loading}>{loading?"Entrando...":"Entrar"}</button>
          {err && <div className="alert alert-danger mt-3">{err}</div>}
        </form>
      </div>
    </div>
  );
}
