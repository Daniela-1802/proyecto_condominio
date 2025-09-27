import { api } from "../../shared/api/client";

export const UsuariosApi = {
  list:   ()           => api.get("/usuarios/"),
  create: (payload)    => api.post("/usuarios/", payload),
  update: (id, payload)=> api.patch(`/usuarios/${id}/`, payload),
  remove: (id)         => api.del(`/usuarios/${id}/`),
};
