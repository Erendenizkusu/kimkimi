import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

import 'kimkimi_brand.dart';
import 'kk_surface_card.dart';

ThemeData _dialogTextTheme(BuildContext context) {
  final base = Theme.of(context);
  return base.copyWith(
    textTheme: GoogleFonts.plusJakartaSansTextTheme(base.textTheme),
  );
}

/// Hafif gradient çerçeve + yüzey — “sistem alert” hissi azaltır.
class _KkDialogChrome extends StatelessWidget {
  const _KkDialogChrome({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 400),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  scheme.primary.withValues(alpha: 0.7),
                  scheme.tertiary.withValues(alpha: 0.55),
                ],
              ),
              boxShadow: [
                BoxShadow(
                  color: scheme.primary.withValues(alpha: 0.22),
                  blurRadius: 28,
                  offset: const Offset(0, 14),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(1.35),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(26.8),
                child: Material(
                  color: scheme.surface,
                  child: child,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PolishedNameField extends StatelessWidget {
  const _PolishedNameField({
    required this.controller,
    this.hintText,
    this.onSubmitted,
  });

  final TextEditingController controller;
  final String? hintText;
  final ValueChanged<String>? onSubmitted;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Görünen adın',
          style: tt.titleSmall?.copyWith(
            color: scheme.primary,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.2,
          ),
        ),
        const SizedBox(height: 10),
        DecoratedBox(
          decoration: kkFigmaPanelDecoration(context).copyWith(
            boxShadow: [
              BoxShadow(
                color: scheme.primary.withValues(alpha: 0.08),
                blurRadius: 18,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 50,
                  height: 50,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        scheme.primary,
                        Color.lerp(scheme.primary, scheme.tertiary, 0.55)!,
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: scheme.primary.withValues(alpha: 0.35),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.workspace_premium_rounded,
                    color: scheme.onPrimary,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: TextField(
                    controller: controller,
                    textInputAction: TextInputAction.done,
                    style: tt.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.15,
                    ),
                    cursorColor: scheme.primary,
                    decoration: InputDecoration(
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                      hintText: hintText ?? 'Adını yaz',
                      hintStyle: tt.titleMedium?.copyWith(
                        color: scheme.onSurfaceVariant.withValues(alpha: 0.45),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    onSubmitted: onSubmitted,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

Widget _gradientDialogTitle(BuildContext context, String text) {
  final scheme = Theme.of(context).colorScheme;
  final tt = Theme.of(context).textTheme;
  return ShaderMask(
    blendMode: BlendMode.srcIn,
    shaderCallback: (bounds) => LinearGradient(
      colors: [
        scheme.primary,
        Color.lerp(scheme.primary, scheme.tertiary, 0.65)!,
      ],
    ).createShader(bounds),
    child: Text(
      text,
      textAlign: TextAlign.center,
      style: tt.headlineSmall?.copyWith(
        fontWeight: FontWeight.w800,
        letterSpacing: -0.4,
        color: Colors.white,
        height: 1.15,
      ),
    ),
  );
}

Widget _instructionPanel(BuildContext context, String message) {
  final scheme = Theme.of(context).colorScheme;
  final tt = Theme.of(context).textTheme;
  return DecoratedBox(
    decoration: BoxDecoration(
      color: scheme.primaryContainer.withValues(alpha: 0.42),
      borderRadius: BorderRadius.circular(18),
      border: Border.all(
        color: scheme.outlineVariant.withValues(alpha: 0.45),
      ),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.lightbulb_outline_rounded,
            size: 22,
            color: scheme.primary.withValues(alpha: 0.9),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message,
              textAlign: TextAlign.start,
              style: tt.bodyLarge?.copyWith(
                color: scheme.onSurface.withValues(alpha: 0.88),
                height: 1.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

/// Ortalanmış, iki adımlı katılma akışı (kod → isim).
class JoinRoomDialog extends StatefulWidget {
  const JoinRoomDialog({super.key});

  @override
  State<JoinRoomDialog> createState() => _JoinRoomDialogState();
}

class _JoinRoomDialogState extends State<JoinRoomDialog> {
  int _step = 0;
  final _code = TextEditingController();
  final _name = TextEditingController(text: 'Misafir');

  @override
  void dispose() {
    _code.dispose();
    _name.dispose();
    super.dispose();
  }

  Future<void> _paste() async {
    final d = await Clipboard.getData(Clipboard.kTextPlain);
    final t = d?.text?.trim();
    if (t == null || t.isEmpty) return;
    setState(() => _code.text = t.toUpperCase().replaceAll(RegExp(r'\s+'), ''));
  }

  void _next() {
    final c = _code.text.trim().toUpperCase();
    if (c.length < 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Oda kodunu gir (en az birkaç karakter).')),
      );
      return;
    }
    setState(() => _step = 1);
  }

  void _back() {
    setState(() => _step = 0);
  }

  void _submit() {
    final c = _code.text.trim().toUpperCase();
    final n = _name.text.trim();
    if (n.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Görünen adını yaz.')),
      );
      return;
    }
    Navigator.of(context).pop((code: c, name: n));
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final tt = Theme.of(context).textTheme;

    return Theme(
      data: _dialogTextTheme(context),
      child: _KkDialogChrome(
        child: SingleChildScrollView(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.viewInsetsOf(context).bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const KimKimiAppBarTitle(showTagline: false),
              const SizedBox(height: 12),
              if (_step == 0) ...[
                _gradientDialogTitle(context, 'Odaya katıl'),
                const SizedBox(height: 12),
                _instructionPanel(
                  context,
                  'Host’un paylaştığı kodu gir veya alttaki yapıştır ile panodan al.',
                ),
                const SizedBox(height: 22),
                DecoratedBox(
                  decoration: kkFigmaPanelDecoration(context),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(8, 4, 4, 4),
                    child: TextField(
                      controller: _code,
                      textCapitalization: TextCapitalization.characters,
                      autocorrect: false,
                      style: tt.titleMedium?.copyWith(letterSpacing: 3.2, fontWeight: FontWeight.w800),
                      textAlign: TextAlign.center,
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        hintText: 'KOD',
                        hintStyle: tt.titleMedium?.copyWith(
                          letterSpacing: 3,
                          color: scheme.onSurfaceVariant.withValues(alpha: 0.35),
                          fontWeight: FontWeight.w700,
                        ),
                        prefixIcon: Icon(Icons.tag_rounded, color: scheme.primary.withValues(alpha: 0.85)),
                        suffixIcon: IconButton(
                          tooltip: 'Panodan yapıştır',
                          onPressed: _paste,
                          icon: Icon(Icons.content_paste_go_rounded, color: scheme.primary),
                        ),
                      ),
                      onSubmitted: (_) => _next(),
                    ),
                  ),
                ),
                const SizedBox(height: 22),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: () => Navigator.of(context).pop(),
                        child: const Text('Vazgeç'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: FilledButton(
                        style: FilledButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: _next,
                        child: const Text('Devam'),
                      ),
                    ),
                  ],
                ),
              ] else ...[
                _gradientDialogTitle(context, 'Kendini tanıt'),
                const SizedBox(height: 12),
                _instructionPanel(
                  context,
                  'Masada görünecek adın; host ve raporlarda bu şekilde görünür.',
                ),
                const SizedBox(height: 22),
                _PolishedNameField(
                  controller: _name,
                  hintText: 'Örn. Eren',
                  onSubmitted: (_) => _submit(),
                ),
                const SizedBox(height: 22),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: _back,
                        icon: const Icon(Icons.arrow_back_rounded, size: 20),
                        label: const Text('Geri'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: FilledButton(
                        style: FilledButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        ),
                        onPressed: _submit,
                        child: const Text('Odaya gir'),
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Host adı — ortalanmış diyalog.
class HostNameDialog extends StatefulWidget {
  const HostNameDialog({super.key});

  @override
  State<HostNameDialog> createState() => _HostNameDialogState();
}

class _HostNameDialogState extends State<HostNameDialog> {
  final _c = TextEditingController(text: 'Host');

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _confirm() {
    final t = _c.text.trim();
    if (t.isEmpty) return;
    Navigator.of(context).pop(t);
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: _dialogTextTheme(context),
      child: _KkDialogChrome(
        child: SingleChildScrollView(
          padding: EdgeInsets.only(
            left: 24,
            right: 24,
            top: 24,
            bottom: MediaQuery.viewInsetsOf(context).bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const KimKimiAppBarTitle(showTagline: false),
              const SizedBox(height: 12),
              _gradientDialogTitle(context, 'Oda Aç'),
              const SizedBox(height: 12),
              _instructionPanel(
                context,
                'Arkadaşın bu isimle seni görecek. Odayı oluşturduktan sonra kodu paylaşman yeterli.',
              ),
              const SizedBox(height: 22),
              _PolishedNameField(
                controller: _c,
                hintText: 'Örn. Host',
                onSubmitted: (_) => _confirm(),
              ),
              const SizedBox(height: 22),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: () => Navigator.of(context).pop(),
                      child: const Text('Vazgeç'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: FilledButton(
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: _confirm,
                      child: const Text('Oluştur'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
