// src/features/usuarios/components/UserModal.jsx
import { useEffect, useState } from "react";

export default function UserModal({ show, onClose, onSave, initial }) {
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState({
    username: "",
    email: "",
    is_active: true,
    password: "", // solo crear (en edición puedes ocultarlo si no vas a cambiar)
  });

  useEffect(() => {
    if (initial) {
      setForm({
        username: initial.username ?? "",
        email: initial.email ?? "",
        is_active: initial.is_active ?? true,
        password: "",
      });
    }
  }, [initial]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // No envíes password si está vacío en edición (DRF suele validarlo)
    const data = { ...form };
    if (isEdit && !data.password) delete data.password;
    await onSave(data);
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{isEdit ? "Editar usuario" : "Nuevo usuario"}</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>×</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Usuario</label>
                <input
                  className="form-control"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  disabled={isEdit} // comúm: no cambiar username
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {!isEdit && (
                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-check">
                <input
                  className="form-check-input"
                  id="is_active"
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="is_active">
                  Activo
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Guardar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </div>
  );
}
