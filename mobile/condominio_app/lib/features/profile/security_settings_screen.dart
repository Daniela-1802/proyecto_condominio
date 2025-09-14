import 'package:flutter/material.dart';

class SecuritySettingsScreen extends StatelessWidget {
  const SecuritySettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Seguridad')),
      body: ListView(
        children: [
          const _SectionTitle('Acceso'),
          SwitchListTile(
            title: const Text('Usar biometría / PIN local'),
            subtitle: const Text('Desbloquear la app con huella/rostro o PIN'),
            value: true,
            onChanged: (_) {},
          ),
          ListTile(
            leading: const Icon(Icons.lock_outline),
            title: const Text('Cambiar contraseña'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(),

          const _SectionTitle('Autenticación en dos pasos (2FA)'),
          SwitchListTile(
            title: const Text('Activar 2FA (TOTP)'),
            subtitle: const Text('Protege tu cuenta con un segundo factor'),
            value: false,
            onChanged: (_) {},
          ),
          ListTile(
            leading: const Icon(Icons.key_outlined),
            title: const Text('Códigos de recuperación'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(),

          const _SectionTitle('Sesiones y actividad'),
          ListTile(
            leading: const Icon(Icons.devices_other),
            title: const Text('Sesiones activas'),
            subtitle: const Text('Revisa y cierra sesiones abiertas en otros dispositivos'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          ListTile(
            leading: const Icon(Icons.history),
            title: const Text('Actividad de inicio de sesión'),
            subtitle: const Text('Historial de accesos y alertas'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(),

          const _SectionTitle('Accesos y permisos'),
          ListTile(
            leading: const Icon(Icons.app_shortcut_outlined),
            title: const Text('Revocar accesos de terceros'),
            subtitle: const Text('Tokens o integraciones conectadas'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text, {super.key});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 8),
      child: Text(text, style: Theme.of(context).textTheme.titleMedium),
    );
  }
}
