import 'package:flutter/material.dart';

import 'screens/home_screen.dart';
import 'theme/app_theme.dart';
import 'theme/theme_controller.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await loadThemeFromPrefs();
  runApp(const KimKimiApp());
}

class KimKimiApp extends StatelessWidget {
  const KimKimiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<ThemeMode>(
      valueListenable: kkThemeMode,
      builder: (context, mode, _) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'KimKimi',
          theme: buildKimKimiTheme(brightness: Brightness.light),
          darkTheme: buildKimKimiTheme(brightness: Brightness.dark),
          themeMode: mode,
          home: const HomeScreen(),
        );
      },
    );
  }
}
