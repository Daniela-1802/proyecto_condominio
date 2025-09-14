class Env {
  // EJEMPLO: corre DRF en localhost:8000
  static const String baseUrl    = 'http://127.0.0.1:8000';

  // SimpleJWT por defecto:
  static const String loginPath  = '/api/token/';
  static const String refreshPath= '/api/token/refresh/';

  // Endpoint para datos del usuario actual (ajusta a tu API):
  // puede ser '/api/me/' o '/users/me/' según tu servidor
  static const String mePath     = '/api/me/';
}
