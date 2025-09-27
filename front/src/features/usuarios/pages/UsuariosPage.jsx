import { useEffect, useState } from "react";
import { UsuariosApi } from "../api";
import { RolesApi } from "../../roles/api";
import { toArray } from "../../../shared/utils/toArray";

export default function UsuariosPage(){
  const [rows, setRows] = useState([]);
  const [roles, setRoles] = useState([]);              // ← catálogo de roles
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    nombre_completo: "",
    telefono: "",
    activo: true,
    is_staff: false,
    groups: [],                                        // ← ids de grupos seleccionados
  });

  async function load(){
    setLoading(true);
    try{
      const [u, g] = await Promise.all([UsuariosApi.list(), RolesApi.list()]);
      setRows(toArray(u));
      setRoles(toArray(g));
    }catch(ex){
      setMsg(ex.message || "Error");
      setRows([]);
      setRoles([]);
    }finally{
      setLoading(false);
    }
  }
  useEffect(()=>{ load(); }, []);

  function reset(){
    setEditing(null);
    setForm({
      username: "",
      password: "",
      email: "",
      nombre_completo: "",
      telefono: "",
      activo: true,
      is_staff: false,
      groups: [],
    });
    setMsg("");
  }

  function edit(row){
    setEditing(row.id);
    setForm({
      username: row.usuario || "",
      password: "",                      // no se edita aquí
      email: row.correo || "",
      nombre_completo: row.nombre_completo || "",
      telefono: row.telefono || "",
      activo: !!row.activo,
      is_staff: !!row.is_staff,          // en lectura puede venir o no; tu serializer ya lo expone
      groups: toArray(row.groups).map(g => g.id),   // normaliza a ids
    });
  }

  async function save(e){
    e.preventDefault();
    setMsg("");

    try{
      if(editing){
        // PATCH: campos editables
        const payload = {
          username: form.username,
          correo: form.email,
          nombre_completo: form.nombre_completo,
          telefono: form.telefono,
          activo: form.activo,
          is_staff: form.is_staff,
          groups: form.groups,           // lista de IDs
        };
        await UsuariosApi.update(editing, payload);
      }else{
        // POST: lo que espera tu UsuarioCreateSerializer + extras admitidos
        const payload = {
          username: form.username,
          password: form.password,
          email: form.email || undefined,
          nombre_completo: form.nombre_completo || undefined,
          telefono: form.telefono || undefined,
          is_staff: form.is_staff,
          groups: form.groups,           // IDs de roles (si envías vacío, ok)
        };
        await UsuariosApi.create(payload);
      }
      reset();
      await load();
      setMsg("Guardado correctamente");
    }catch(ex){
      setMsg(ex.message || "Error");
    }
  }

  async function remove(id){
    if(!window.confirm("¿Eliminar usuario? Esta acción borra también su cuenta de acceso.")) return;
    try{
      await UsuariosApi.remove(id);
      await load();
    }catch(ex){
      setMsg(ex.message || "Error");
    }
  }

  // helper para multi-select simple (controlado)
  function toggleGroup(id){
    setForm(f => {
      const set = new Set(f.groups);
      if(set.has(id)) set.delete(id); else set.add(id);
      return { ...f, groups: Array.from(set) };
    });
  }
function renderRoleBadges(list) {
  const items = Array.isArray(list) ? list : (list ? [list] : []);
  if (items.length === 0) return <span className="text-muted">—</span>;
  return items.map(g => (
    <span key={g.id || g} className="badge badge-secondary mr-1">
      {g.name || g}
    </span>
  ));
}



  return (
    <div className="container-fluid">
      <h4 className="mb-3">Usuarios</h4>

      <form className="card p-3 mb-3" onSubmit={save}>
        <div className="row g-2">
          <div className="col-md-3">
            <input className="form-control" placeholder="Usuario (username)"
              value={form.username}
              onChange={e=>setForm({...form, username:e.target.value})}
              disabled={editing}
            />
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Email"
              value={form.email}
              onChange={e=>setForm({...form, email:e.target.value})}/>
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Nombre completo"
              value={form.nombre_completo}
              onChange={e=>setForm({...form, nombre_completo:e.target.value})}/>
          </div>
          <div className="col-md-3">
            <input className="form-control" placeholder="Teléfono"
              value={form.telefono}
              onChange={e=>setForm({...form, telefono:e.target.value})}/>
          </div>

          {!editing && (
            <div className="col-md-3">
              <input type="password" className="form-control" placeholder="Password"
                value={form.password}
                onChange={e=>setForm({...form, password:e.target.value})}/>
            </div>
          )}

          <div className="col-md-3 d-flex align-items-center gap-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chkActivo"
                checked={form.activo} onChange={e=>setForm({...form, activo:e.target.checked})}/>
              <label className="form-check-label" htmlFor="chkActivo">Activo</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="chkStaff"
                checked={form.is_staff} onChange={e=>setForm({...form, is_staff:e.target.checked})}/>
              <label className="form-check-label" htmlFor="chkStaff">Es staff</label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="border rounded p-2">
              <div className="small mb-1">Roles (marque para asignar):</div>
              <div className="d-flex flex-wrap gap-3">
                {roles.map(r => (
                  <div className="form-check" key={r.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`g${r.id}`}
                      checked={form.groups.includes(r.id)}
                      onChange={()=>toggleGroup(r.id)}
                    />
                    <label className="form-check-label" htmlFor={`g${r.id}`}>{r.name}</label>
                  </div>
                ))}
                {roles.length===0 && <span className="text-muted small">No hay roles aún.</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 d-flex gap-2">
          <button className="btn btn-primary">{editing ? "Actualizar" : "Crear"}</button>
          {editing && <button type="button" className="btn btn-secondary" onClick={reset}>Cancelar</button>}
        </div>
        {msg && <div className={`small mt-2 ${/error|fail|invalid|not/i.test(msg) ? "text-danger" : "text-success"}`}>{msg}</div>}
      </form>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-sm mb-0">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Activo</th>
                <th>Staff</th>
                <th>Roles</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}>Cargando...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={6}>Sin datos</td></tr>

              ) : rows.map(r=> {
                const rolesDeUsuario = Array.isArray(r.groups) ? r.groups : [];
                return (
                <tr key={r.id}>
                  <td>{r.usuario}</td>
                  <td>{r.nombre_completo}</td>
                  <td>{r.correo}</td>
                  <td>{r.telefono}</td>
                  <td>{r.activo ? "Sí" : "No"}</td>
                  <td>{r.is_staff ? "Sí" : "No"}</td>
                    <td>{renderRoleBadges(rolesDeUsuario)}</td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={()=>edit(r)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger"  onClick={()=>remove(r.id)}>Eliminar</button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
