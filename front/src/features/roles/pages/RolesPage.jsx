// src/features/roles/pages/RolesPage.jsx
import { useEffect, useState } from "react";
import { RolesApi } from "../api";
import { toArray } from "../../../shared/utils/toArray";


export default function RolesPage(){
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  async function load(){
    try{
      const data = await RolesApi.list();
      setRows(toArray(data));     // ← normaliza
    }catch(ex){
      setMsg(ex.message || "Error"); 
      setRows([]);
    }
  }
  useEffect(()=>{ load(); }, []);

  async function save(e){
    e.preventDefault(); setMsg("");
    try{
      if(editing) await RolesApi.update(editing, { name });
      else        await RolesApi.create({ name });
      setName(""); setEditing(null); await load();
      setMsg("Guardado correctamente");
    }catch(ex){ setMsg(ex.message || "Error"); }
  }

  async function remove(id){
    if(!window.confirm("¿Eliminar rol?")) return;
    await RolesApi.remove(id); await load();
  }

  return (
    <div className="container-fluid">
      <h4 className="mb-3">Roles</h4>

      <form className="d-flex gap-2 mb-3" onSubmit={save}>
        <input className="form-control" placeholder="Nombre del rol" value={name} onChange={e=>setName(e.target.value)}/>
        <button className="btn btn-primary">{editing ? "Actualizar" : "Crear"}</button>
        {editing && <button type="button" className="btn btn-secondary" onClick={()=>{setEditing(null); setName("");}}>Cancelar</button>}
      </form>
      {msg && <div className="small text-success mb-2">{msg}</div>}

      <div className="card">
        <ul className="list-group list-group-flush">
          {(rows ?? []).length===0 ? <li className="list-group-item">Sin datos</li> : (rows ?? []).map(r=>(
            <li className="list-group-item d-flex justify-content-between align-items-center" key={r.id}>
              {r.name}
              <span className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={()=>{setEditing(r.id); setName(r.name);}}>Editar</button>
                <button className="btn btn-sm btn-outline-danger"  onClick={()=>remove(r.id)}>Eliminar</button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
