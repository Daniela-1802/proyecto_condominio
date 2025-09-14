import 'package:dio/dio.dart';
import '../env.dart';
import 'storage/secure_storage.dart';

class ApiClient {
  final Dio dio = Dio(BaseOptions(baseUrl: Env.baseUrl));
  final AppSecureStorage storage = AppSecureStorage();

  ApiClient() {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await storage.readAccess();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (e, handler) async {
          if (e.response?.statusCode == 401 && await _refresh()) {
            final req = e.requestOptions;
            final token = await storage.readAccess();
            if (token != null && token.isNotEmpty) {
              req.headers['Authorization'] = 'Bearer $token';
            }
            final retry = await dio.fetch(req);
            return handler.resolve(retry);
          }
          handler.next(e);
        },
      ),
    );
  }

  Future<bool> _refresh() async {
    try {
      final refresh = await storage.readRefresh();
      if (refresh == null || refresh.isEmpty) return false;

      final res = await dio.post(Env.refreshPath, data: {'refresh': refresh});
      final newAccess = res.data['access'] as String?;
      if (newAccess == null) return false;

      await storage.saveTokens(access: newAccess, refresh: refresh);
      return true;
    } catch (_) {
      await storage.clear();
      return false;
    }
  }
}
