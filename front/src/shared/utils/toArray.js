export function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload?.results && Array.isArray(payload.results)) return payload.results;
  if (payload?.data && Array.isArray(payload.data)) return payload.data;
  if (payload?.items && Array.isArray(payload.items)) return payload.items;
  if (payload?.value && Array.isArray(payload.value)) return payload.value; // por si usas ConvertTo-Json en pruebas
  return [];
}
