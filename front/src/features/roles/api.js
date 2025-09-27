import { api } from "../../shared/api/client";

export const RolesApi = {
  list:   ()            => api.get("/roles/"),
  create: (payload)     => api.post("/roles/", payload),
  update: (id, payload) => api.patch(`/roles/${id}/`, payload),
  remove: (id)          => api.del(`/roles/${id}/`),
};
