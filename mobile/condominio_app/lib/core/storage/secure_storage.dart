import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AppSecureStorage {
  final FlutterSecureStorage _s = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  Future<void> saveTokens({required String access, required String refresh}) async {
    await _s.write(key: 'access', value: access);
    await _s.write(key: 'refresh', value: refresh);
  }

  Future<String?> readAccess()  => _s.read(key: 'access');
  Future<String?> readRefresh() => _s.read(key: 'refresh');

  Future<void> saveAccess(String access)  => _s.write(key: 'access', value: access);
  Future<void> saveRefresh(String refresh)=> _s.write(key: 'refresh', value: refresh);

  Future<void> clear() async => _s.deleteAll();
}
