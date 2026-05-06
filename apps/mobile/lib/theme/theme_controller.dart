import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Uygulama geneli tema (web’deki tema anahtarına denk).
final ValueNotifier<ThemeMode> kkThemeMode = ValueNotifier(ThemeMode.system);

Future<void> loadThemeFromPrefs() async {
  final p = await SharedPreferences.getInstance();
  final v = p.getString('kk_theme_mode');
  kkThemeMode.value = switch (v) {
    'light' => ThemeMode.light,
    'dark' => ThemeMode.dark,
    _ => ThemeMode.system,
  };
}

Future<void> persistThemeMode(ThemeMode mode) async {
  final p = await SharedPreferences.getInstance();
  await p.setString(
    'kk_theme_mode',
    switch (mode) {
      ThemeMode.light => 'light',
      ThemeMode.dark => 'dark',
      _ => 'system',
    },
  );
  kkThemeMode.value = mode;
}
