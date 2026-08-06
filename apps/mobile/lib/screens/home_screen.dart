import 'dart:convert';

import 'package:flutter/material.dart';

import '../api_config.dart';
import '../kimkimi_http.dart';
import '../room_session_store.dart';
import '../theme/theme_controller.dart';
import '../user_facing_errors.dart';
import '../widgets/category_room_tile.dart';
import '../widgets/kk_surface_card.dart';
import '../widgets/join_room_dialog.dart';
import '../widgets/kimkimi_brand.dart';
import 'info_screens.dart';
import 'room_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Map<String, dynamic>> _categories = [];
  String? _error;
  bool _loading = true;
  ({String secretId, String playerToken, String shortCode, bool isHost})? _savedRoom;

  @override
  void initState() {
    super.initState();
    _load();
    _loadSavedRoom();
  }

  Future<void> _loadSavedRoom() async {
    final s = await RoomSessionStore.load();
    if (mounted) setState(() => _savedRoom = s);
  }

  Future<void> _clearSavedRoom() async {
    await RoomSessionStore.clear();
    if (mounted) setState(() => _savedRoom = null);
  }

  Future<void> _resumeRoom() async {
    final s = _savedRoom;
    if (s == null) return;
    await Navigator.push<void>(
      context,
      MaterialPageRoute(
        builder: (_) => RoomScreen(
          secretId: s.secretId,
          playerToken: s.playerToken,
          shortCode: s.shortCode,
          isHost: s.isHost,
        ),
      ),
    );
    await _loadSavedRoom();
  }

  Future<void> _cycleTheme() async {
    final cur = kkThemeMode.value;
    final next = cur == ThemeMode.light
            ? ThemeMode.dark
            : ThemeMode.light;
    await persistThemeMode(next);
  }

  Future<void> _load() async {
    if (!mounted) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final r = await kimkimiGet(Uri.parse('$kApiBase/public/categories'));
      if (!mounted) return;
      if (r.statusCode != 200) {
        setState(() {
          _error = 'Sunucu ${r.statusCode}';
          _loading = false;
        });
        return;
      }
      final list = jsonDecode(r.body) as List<dynamic>;
      setState(() {
        _categories = list.map((e) => Map<String, dynamic>.from(e as Map)).toList();
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = describeClientNetworkError(e);
        _loading = false;
      });
    }
  }

  Future<void> _createRoom(String categoryId) async {
    final name = await showDialog<String>(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => const HostNameDialog(),
    );
    if (name == null || name.isEmpty) return;

    final r = await kimkimiPost(
      Uri.parse('$kApiBase/rooms'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'categoryId': categoryId, 'hostDisplayName': name}),
    );
    if (!mounted) return;
    if (r.statusCode != 201) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(userFacingApiMessage(r.statusCode, r.body))),
      );
      return;
    }
    final body = jsonDecode(r.body) as Map<String, dynamic>;
    final secretId = body['secretId'] as String;
    final token = body['hostPlayerToken'] as String;
    final shortCode = body['shortCode'] as String;
    await RoomSessionStore.save(
      secretId: secretId,
      playerToken: token,
      shortCode: shortCode,
      isHost: true,
    );
    if (!mounted) return;
    await Navigator.push<void>(
      context,
      MaterialPageRoute(
        builder: (_) => RoomScreen(
          secretId: secretId,
          playerToken: token,
          shortCode: shortCode,
          isHost: true,
        ),
      ),
    );
    await _loadSavedRoom();
  }

  Future<void> _joinRoom() async {
    final joined = await showDialog<({String code, String name})>(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => const JoinRoomDialog(),
    );
    if (joined == null) return;
    final code = joined.code;
    final guestName = joined.name;
    if (code.isEmpty || guestName.isEmpty) return;
    if (!mounted) return;

    final r = await kimkimiPost(
      Uri.parse('$kApiBase/rooms/join'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'shortCode': code, 'guestDisplayName': guestName}),
    );
    if (!mounted) return;
    if (r.statusCode != 201) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(userFacingApiMessage(r.statusCode, r.body))),
      );
      return;
    }
    final body = jsonDecode(r.body) as Map<String, dynamic>;
    final secretId = body['secretId'] as String;
    final token = body['guestPlayerToken'] as String;
    await RoomSessionStore.save(
      secretId: secretId,
      playerToken: token,
      shortCode: code,
      isHost: false,
    );
    if (!mounted) return;
    await Navigator.push<void>(
      context,
      MaterialPageRoute(
        builder: (_) => RoomScreen(
          secretId: secretId,
          playerToken: token,
          shortCode: code,
          isHost: false,
        ),
      ),
    );
    await _loadSavedRoom();
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final gradientColors = isDark
        ? [
            const Color(0xFF1E1436),
            scheme.surfaceContainerLowest,
            const Color(0xFF120C22),
          ]
        : [
            Color.alphaBlend(scheme.primary.withValues(alpha: 0.045), scheme.surface),
            Color.alphaBlend(scheme.primary.withValues(alpha: 0.02), scheme.surface),
            scheme.surface,
          ];

    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: Padding(
        padding: EdgeInsets.only(bottom: 10 + MediaQuery.paddingOf(context).bottom),
        child: _JoinRoomHeroButton(onPressed: _joinRoom),
      ),
      body: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: gradientColors,
            stops: const [0.0, 0.45, 1.0],
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: RefreshIndicator(
            onRefresh: _load,
            edgeOffset: 88,
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverAppBar(
                  pinned: true,
                  toolbarHeight: 78,
                  surfaceTintColor: Colors.transparent,
                  backgroundColor: scheme.surface.withValues(alpha: isDark ? 0.88 : 0.86),
                  elevation: 0,
                  shadowColor: scheme.shadow.withValues(alpha: 0.12),
                  title: const KimKimiAppBarTitle(),
                  actions: [
                ValueListenableBuilder<ThemeMode>(
                  valueListenable: kkThemeMode,
                  builder: (context, mode, _) {
                    return IconButton(
                      tooltip: 'Tema',
                      onPressed: _cycleTheme,
                      icon: Icon(
                        mode == ThemeMode.dark
                            ? Icons.dark_mode_rounded
                            : Icons.light_mode_rounded
                      ),
                    );
                  },
                ),
                PopupMenuButton<String>(
                  tooltip: 'Menü',
                  itemBuilder: (ctx) => const [
                    PopupMenuItem(value: 'how', child: Text('Nasıl oynanır')),
                    PopupMenuItem(value: 'privacy', child: Text('Gizlilik politikası')),
                    PopupMenuItem(value: 'terms', child: Text('Kullanım şartları')),
                  ],
                  onSelected: (v) {
                    Widget page;
                    switch (v) {
                      case 'how':
                        page = const HowToPlayScreen();
                        break;
                      case 'privacy':
                        page = const PrivacyPolicyScreen();
                        break;
                      default:
                        page = const TermsOfUseScreen();
                    }
                    Navigator.push<void>(context, MaterialPageRoute(builder: (_) => page));
                  },
                ),
                IconButton(onPressed: _load, icon: const Icon(Icons.refresh_rounded)),
              ],
            ),
            if (_savedRoom != null)
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                  child: Material(
                    elevation: 3,
                    shadowColor: scheme.tertiary.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(22),
                    color: scheme.tertiaryContainer.withValues(alpha: isDark ? 0.55 : 0.92),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.history_rounded, color: scheme.onTertiaryContainer),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Kaldığın oda',
                                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                                        color: scheme.onTertiaryContainer,
                                        fontWeight: FontWeight.w700,
                                      ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Text(
                            _savedRoom!.shortCode,
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                  letterSpacing: 6,
                                  fontWeight: FontWeight.w800,
                                  color: scheme.onTertiaryContainer,
                                ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Aynı cihazdan odaya dönebilir veya kaydı temizleyebilirsin.',
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: scheme.onTertiaryContainer.withValues(alpha: 0.9),
                                  height: 1.35,
                                ),
                          ),
                          const SizedBox(height: 14),
                          Row(
                            children: [
                              Expanded(
                                child: FilledButton.icon(
                                  onPressed: _resumeRoom,
                                  icon: const Icon(Icons.login_rounded),
                                  label: const Text('Odaya dön'),
                                ),
                              ),
                              const SizedBox(width: 10),
                              OutlinedButton(
                                onPressed: _clearSavedRoom,
                                child: const Text('Temizle'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            if (_loading)
              const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_error != null)
              SliverFillRemaining(
                hasScrollBody: false,
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.cloud_off_rounded, size: 56, color: scheme.error),
                      const SizedBox(height: 16),
                      Text(
                        'Bağlantı sorunu',
                        style: Theme.of(context).textTheme.titleMedium,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _error!,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: scheme.onSurfaceVariant,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'API: $kApiBase',
                        style: Theme.of(context).textTheme.labelSmall?.copyWith(
                              color: scheme.outline,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Emülatörde sunucu bilgisayarda çalışmalı (apps/web, port 3000).',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: scheme.onSurfaceVariant,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      FilledButton.icon(
                        onPressed: _load,
                        icon: const Icon(Icons.replay_rounded),
                        label: const Text('Yeniden dene'),
                      ),
                    ],
                  ),
                ),
              )
            else if (_categories.isEmpty)
              SliverFillRemaining(
                hasScrollBody: false,
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.category_outlined, size: 56, color: scheme.outline),
                      const SizedBox(height: 16),
                      Text(
                        'Oynanabilir kategori yok',
                        style: Theme.of(context).textTheme.titleMedium,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Sunucuya ulaşıldı fakat yayınlanmış sorulu kategori bulunamadı. '
                        'Veritabanında seed veya admin içeriği kontrol edin.',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: scheme.onSurfaceVariant,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      FilledButton.icon(
                        onPressed: _load,
                        icon: const Icon(Icons.refresh_rounded),
                        label: const Text('Yenile'),
                      ),
                    ],
                  ),
                ),
              )
            else ...[
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 14, 16, 10),
                  child: KkSurfaceCard(
                    padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'OYNA',
                          style: Theme.of(context).textTheme.labelSmall?.copyWith(
                                letterSpacing: 1.4,
                                fontWeight: FontWeight.w700,
                                color: scheme.primary.withValues(alpha: 0.9),
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Kategoriler',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.5,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Bir kategori seçerek oda aç. Arkadaşın alttaki davet butonundan kodla katılabilir.',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: scheme.onSurfaceVariant,
                                height: 1.45,
                              ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverList.separated(
                  itemCount: _categories.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 12),
                  itemBuilder: (ctx, i) {
                    final c = _categories[i];
                    final title = c['title'] as String? ?? 'Kategori';
                    final slug = c['slug'] as String? ?? '';
                    return CategoryRoomTile(
                      title: title,
                      slug: slug,
                      onTap: () => _createRoom(c['id'] as String),
                    );
                  },
                ),
              ),
              SliverToBoxAdapter(child: SizedBox(height: 120 + MediaQuery.paddingOf(context).bottom)),
            ],
          ],
        ),
      ),
        ),
      ),
    );
  }
}

class _JoinRoomHeroButton extends StatelessWidget {
  const _JoinRoomHeroButton({required this.onPressed});

  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final maxW = (w - 32).clamp(280.0, 420.0);

    return ConstrainedBox(
      constraints: BoxConstraints(minWidth: maxW, maxWidth: maxW),
      child: Material(
        elevation: 12,
        borderRadius: BorderRadius.circular(34),
        shadowColor: const Color(0xFF4C1D95).withValues(alpha: 0.55),
        child: InkWell(
          onTap: onPressed,
          borderRadius: BorderRadius.circular(34),
          child: Ink(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(34),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF7C6AF0),
                  Color(0xFF6D28D9),
                  Color(0xFFD946EF),
                ],
                stops: [0.0, 0.45, 1.0],
              ),
              border: Border.all(color: Colors.white.withValues(alpha: 0.22), width: 1.2),
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(11),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.18),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
                    ),
                    child: const Icon(Icons.key_rounded, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.auto_awesome_rounded, color: Color(0xFFFFE082), size: 18),
                            const SizedBox(width: 6),
                            const Text(
                              'Koda katıl',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w800,
                                fontSize: 17,
                                letterSpacing: 0.1,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Kodu yapıştır veya yaz · anında bağlan',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.88),
                            fontSize: 12.5,
                            height: 1.25,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.16),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.north_east_rounded, color: Colors.white, size: 20),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
