import 'package:flutter/material.dart';

/// Ana ekran kategori kartlarıyla aynı “panel” dilini paylaşır.
BoxDecoration kkFigmaPanelDecoration(
  BuildContext context, {
  Color? color,
  double borderRadius = 22,
}) {
  final scheme = Theme.of(context).colorScheme;
  final isDark = Theme.of(context).brightness == Brightness.dark;
  final fill = color ?? scheme.surfaceContainerHigh.withValues(alpha: isDark ? 0.72 : 0.94);
  return BoxDecoration(
    color: fill,
    borderRadius: BorderRadius.circular(borderRadius),
    border: Border.all(
      color: scheme.outlineVariant.withValues(alpha: isDark ? 0.35 : 0.5),
    ),
    boxShadow: [
      BoxShadow(
        color: scheme.shadow.withValues(alpha: isDark ? 0.35 : 0.12),
        blurRadius: 24,
        offset: const Offset(0, 10),
      ),
    ],
  );
}

class KkSurfaceCard extends StatelessWidget {
  const KkSurfaceCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.margin,
    this.backgroundColor,
    this.borderRadius = 22,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry? margin;
  final Color? backgroundColor;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    final inner = DecoratedBox(
      decoration: kkFigmaPanelDecoration(
        context,
        color: backgroundColor,
        borderRadius: borderRadius,
      ),
      child: Padding(padding: padding, child: child),
    );
    if (margin != null) {
      return Padding(padding: margin!, child: inner);
    }
    return inner;
  }
}
