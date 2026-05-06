import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;

import '../api_config.dart';
import '../category_emoji.dart';
import '../models/public_question.dart';
import '../questions_util.dart';
import '../room_session_store.dart';
import '../user_facing_errors.dart';
import '../services/kimkimi_room_api.dart';
import '../widgets/kk_surface_card.dart';

Map<String, dynamic> _asStringKeyMap(dynamic raw) {
  if (raw == null || raw is! Map) return {};
  return raw.map((k, v) => MapEntry(k.toString(), v));
}

String _formatResultValue(dynamic v) {
  if (v == null) return '—';
  if (v is List) return v.map((e) => e.toString()).join(', ');
  if (v is Map) return jsonEncode(v);
  return v.toString();
}

({String host, String guest}) _namesFromPlayers(List<dynamic> players) {
  var host = 'Host';
  var guest = 'Misafir';
  for (final p in players) {
    final m = _asStringKeyMap(p);
    final seat = m['seat']?.toString() ?? '';
    final n = m['displayName']?.toString().trim() ?? '';
    if (n.isEmpty) continue;
    if (seat == 'host') host = n;
    if (seat == 'guest') guest = n;
  }
  return (host: host, guest: guest);
}

List<({String label, String value})> _parseChoices(dynamic raw) {
  if (raw == null || raw is! List) return [];
  final out = <({String label, String value})>[];
  for (final e in raw) {
    if (e is String) {
      out.add((label: e, value: e));
    } else if (e is Map) {
      final m = _asStringKeyMap(e);
      final v = m['value'] ?? m['id'] ?? m['key'];
      final l = m['label'] ?? m['title'] ?? v;
      if (v != null) {
        out.add((label: l.toString(), value: v.toString()));
      }
    }
  }
  return out;
}

int _wordCount(String s) =>
    s.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).length;

bool _needsMaxTwoWords(PublicQuestion q) {
  if (q.type == 'number' || q.type == 'date' || q.type == 'multi_choice') return false;
  if (q.type == 'single_choice' && _parseChoices(q.choicesJson).isNotEmpty) return false;
  return true;
}

Widget _questionPromptShell(BuildContext context, String prompt, Widget child) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      Text(
        prompt,
        style: Theme.of(context).textTheme.titleSmall?.copyWith(height: 1.4),
      ),
      const SizedBox(height: 8),
      child,
    ],
  );
}

class RoomScreen extends StatefulWidget {
  const RoomScreen({
    super.key,
    required this.secretId,
    required this.playerToken,
    required this.shortCode,
    required this.isHost,
  });

  final String secretId;
  final String playerToken;
  final String shortCode;
  final bool isHost;

  @override
  State<RoomScreen> createState() => _RoomScreenState();
}

class _RoomScreenState extends State<RoomScreen> {
  io.Socket? _socket;
  Map<String, dynamic> _state = {};
  String? _httpError;
  String? _socketMsg;
  bool _booting = true;

  dynamic _results;
  bool _loadingResults = false;

  String? _gameSentQuestionId;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final api = KimKimiRoomApi(secretId: widget.secretId, playerToken: widget.playerToken);
    try {
      final s = await api.getState();
      if (mounted) {
        setState(() {
          _state = s;
          _httpError = null;
        });
      }
    } catch (e) {
      if (e is StateException && (e.statusCode == 403 || e.statusCode == 404)) {
        await RoomSessionStore.clear();
      }
      if (mounted) {
        final msg = e is StateException
            ? userFacingApiMessage(e.statusCode ?? 500, e.body)
            : describeClientNetworkError(e);
        setState(() => _httpError = msg);
      }
    } finally {
      if (mounted) setState(() => _booting = false);
    }
    _connectSocket();
  }

  void _applyIncoming(dynamic data) {
    final next = _asStringKeyMap(data);
    if (next.isEmpty) return;
    final curQ = _state['currentQuestionId']?.toString();
    final newQ = next['currentQuestionId']?.toString();
    if (curQ != newQ) {
      _gameSentQuestionId = null;
    }
    setState(() => _state = next);
    final st = next['status']?.toString();
    if (st == 'finished' && _results == null && !_loadingResults) {
      _loadResults();
    }
  }

  Future<void> _loadResults() async {
    setState(() => _loadingResults = true);
    try {
      final api = KimKimiRoomApi(secretId: widget.secretId, playerToken: widget.playerToken);
      final r = await api.getResults();
      if (mounted) setState(() => _results = r);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
      }
    } finally {
      if (mounted) setState(() => _loadingResults = false);
    }
  }

  void _connectSocket() {
    final s = io.io(
      kApiBase,
      io.OptionBuilder().setTransports(['websocket']).disableAutoConnect().build(),
    );
    _socket = s;
    s.onConnect((_) {
      s.emit('join_room', {'secretId': widget.secretId, 'playerToken': widget.playerToken});
    });
    s.on('state_sync', _applyIncoming);
    s.on('room_state', _applyIncoming);
    s.on('error', (data) {
      final msg = data is Map ? data['message']?.toString() : data.toString();
      if (mounted) setState(() => _socketMsg = msg ?? 'Socket hatası');
    });
    s.connect();
  }

  @override
  void dispose() {
    _socket?.dispose();
    super.dispose();
  }

  String get _mySeat => widget.isHost ? 'host' : 'guest';

  String _statusLabel(String? s) {
    switch (s) {
      case 'waiting':
        return 'Oyuncu bekleniyor';
      case 'profile':
        return 'Profil soruları';
      case 'playing':
        return 'Oyun';
      case 'finished':
        return 'Bitti';
      default:
        return s ?? '…';
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    if (_booting) {
      return Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              SvgPicture.asset('assets/brand/kimkimi_mark.svg', width: 30, height: 30),
              const SizedBox(width: 10),
              Text('Oda', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
            ],
          ),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }
    if (_httpError != null && _state.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: Row(
            children: [
              SvgPicture.asset('assets/brand/kimkimi_mark.svg', width: 30, height: 30),
              const SizedBox(width: 10),
              Text('Oda', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Icon(Icons.error_outline_rounded, size: 48, color: scheme.error),
              const SizedBox(height: 16),
              Text(_httpError!, style: Theme.of(context).textTheme.bodyMedium),
              const SizedBox(height: 24),
              FilledButton(onPressed: _bootstrap, child: const Text('Tekrar dene')),
            ],
          ),
        ),
      );
    }

    final status = _state['status']?.toString() ?? '';
    final category = _asStringKeyMap(_state['category']);
    final title = category['title']?.toString() ?? 'Oda';
    final slug = category['slug']?.toString() ?? '';
    final titleWithEmoji = categoryTitleWithEmoji(title: title, slug: slug);

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 8,
        title: Row(
          children: [
            SvgPicture.asset('assets/brand/kimkimi_mark.svg', width: 32, height: 32),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    titleWithEmoji,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  Text(
                    'Kod: ${widget.shortCode} · ${_statusLabel(status)}',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: Theme.of(context).colorScheme.onSurfaceVariant,
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          if (_socketMsg != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Material(
                color: scheme.errorContainer,
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(Icons.warning_rounded, color: scheme.onErrorContainer),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          _socketMsg!,
                          style: TextStyle(color: scheme.onErrorContainer),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          _RoomPlayersCard(state: _state, mySeat: _mySeat),
          const SizedBox(height: 16),
          if (status == 'waiting') _WaitingBody(shortCode: widget.shortCode, isHost: widget.isHost),
          if (status == 'profile')
            _ProfileBody(
              categorySlug: category['slug']?.toString() ?? '',
              secretId: widget.secretId,
              playerToken: widget.playerToken,
              state: _state,
              mySeat: _mySeat,
            ),
          if (status == 'playing')
            _PlayingBody(
              categorySlug: category['slug']?.toString() ?? '',
              secretId: widget.secretId,
              playerToken: widget.playerToken,
              state: _state,
              gameSentQuestionId: _gameSentQuestionId,
              onSubmitted: (qid) => setState(() => _gameSentQuestionId = qid),
            ),
          if (status == 'finished')
            _FinishedBody(
              loading: _loadingResults,
              results: _results,
              players: (_state['players'] as List<dynamic>?) ?? [],
            ),
        ],
      ),
    );
  }
}

class _RoomPlayersCard extends StatelessWidget {
  const _RoomPlayersCard({required this.state, required this.mySeat});

  final Map<String, dynamic> state;
  final String mySeat;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final players = (state['players'] as List<dynamic>?) ?? [];
    return KkSurfaceCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Oyuncular', style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          ...players.map((p) {
            final m = _asStringKeyMap(p);
            final seat = m['seat']?.toString() ?? '';
            final name = m['displayName']?.toString() ?? '';
            final me = seat == mySeat;
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  Icon(
                    seat == 'host' ? Icons.star_rounded : Icons.person_rounded,
                    size: 20,
                    color: me ? scheme.primary : scheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 8),
                  Expanded(child: Text(name.isEmpty ? seat : name)),
                  if (me)
                    Text(
                      'Sen',
                      style: Theme.of(context).textTheme.labelSmall?.copyWith(
                            color: scheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _WaitingBody extends StatelessWidget {
  const _WaitingBody({required this.shortCode, required this.isHost});

  final String shortCode;
  final bool isHost;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return KkSurfaceCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            isHost ? 'Arkadaşını bekle' : 'Bağlandın',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 12),
          Text(
            isHost
                ? 'Aşağıdaki kodu paylaş. Arkadaşın ana ekrandan «Koda katıl» ile girebilir.'
                : 'Host soruları tamamlayana kadar ekranı takip edebilirsin.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: scheme.onSurfaceVariant,
                ),
          ),
          if (isHost) ...[
            const SizedBox(height: 20),
            FilledButton.tonal(
              onPressed: () async {
                await Clipboard.setData(ClipboardData(text: shortCode));
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Kod panoya kopyalandı')),
                  );
                }
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    shortCode,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          letterSpacing: 4,
                          fontWeight: FontWeight.w700,
                        ),
                  ),
                  const SizedBox(width: 12),
                  const Icon(Icons.copy_rounded),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ProfileBody extends StatefulWidget {
  const _ProfileBody({
    required this.categorySlug,
    required this.secretId,
    required this.playerToken,
    required this.state,
    required this.mySeat,
  });

  final String categorySlug;
  final String secretId;
  final String playerToken;
  final Map<String, dynamic> state;
  final String mySeat;

  @override
  State<_ProfileBody> createState() => _ProfileBodyState();
}

class _ProfileBodyState extends State<_ProfileBody> {
  List<PublicQuestion>? _questions;
  String? _loadErr;
  final Map<String, Object?> _values = {};
  bool _submitting = false;

  @override
  void initState() {
    super.initState();
    _loadQs();
  }

  Future<void> _loadQs() async {
    try {
      final qs = await KimKimiRoomApi.fetchPublicQuestions(widget.categorySlug, 'profile',
          secretId: widget.secretId);
      if (mounted) setState(() => _questions = sortPublicQuestions(qs));
    } catch (e) {
      if (mounted) setState(() => _loadErr = e.toString());
    }
  }

  Map<String, dynamic>? _progressForMe() {
    final list = (widget.state['profileProgress'] as List<dynamic>?) ?? [];
    for (final e in list) {
      final m = _asStringKeyMap(e);
      if (m['seat']?.toString() == widget.mySeat) return m;
    }
    return null;
  }

  Future<void> _submit() async {
    final qs = _questions;
    if (qs == null) return;
    final answers = <Map<String, dynamic>>[];
    for (final q in qs) {
      final v = _values[q.id];
      if (q.type == 'number' && v is! num) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('«${q.prompt}» için geçerli bir sayı gir')),
        );
        return;
      }
      if (v == null || (v is String && v.trim().isEmpty)) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('«${q.prompt}» için cevap gir')),
        );
        return;
      }
      if (q.type == 'multi_choice' && v is List && v.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('«${q.prompt}» için en az bir seçenek işaretle')),
        );
        return;
      }
      if (_needsMaxTwoWords(q)) {
        final s = v is String ? v.trim() : v.toString().trim();
        if (_wordCount(s) > 2) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                '«${q.prompt}»: Metin cevapları en fazla 2 kelime olsun (tahmin doğruluğu için).',
              ),
            ),
          );
          return;
        }
      }
      answers.add({'questionId': q.id, 'value': v});
    }
    setState(() => _submitting = true);
    try {
      final api = KimKimiRoomApi(secretId: widget.secretId, playerToken: widget.playerToken);
      await api.submitProfileAnswers(answers);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profil cevapların kaydedildi')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final prog = _progressForMe();
    final done = prog?['done'] == true;

    if (_loadErr != null) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(16),
        child: Text(_loadErr!, style: TextStyle(color: scheme.error)),
      );
    }
    if (_questions == null) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(24),
        child: const Center(child: CircularProgressIndicator()),
      );
    }

    if (done) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Icon(Icons.check_circle_rounded, color: scheme.primary),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                'Profilini tamamladın. Partner de bitirince oyun başlayacak.',
                style: Theme.of(context).textTheme.bodyLarge,
              ),
            ),
          ],
        ),
      );
    }

    return KkSurfaceCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text('Profil', style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          ..._questions!.map((q) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _QuestionField(
                  q: q,
                  value: _values[q.id],
                  onChanged: (v) => setState(() => _values[q.id] = v),
                ),
              )),
          FilledButton(
            onPressed: _submitting ? null : _submit,
            child: _submitting
                ? const SizedBox(
                    height: 22,
                    width: 22,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text('Profili gönder'),
          ),
        ],
      ),
    );
  }
}

class _QuestionField extends StatelessWidget {
  const _QuestionField({
    required this.q,
    required this.value,
    required this.onChanged,
  });

  final PublicQuestion q;
  final Object? value;
  final ValueChanged<Object?> onChanged;

  @override
  Widget build(BuildContext context) {
    final choices = _parseChoices(q.choicesJson);
    final promptStyle = Theme.of(context).textTheme.titleSmall?.copyWith(height: 1.4);

    switch (q.type) {
      case 'single_choice':
        if (choices.isEmpty) {
          return _questionPromptShell(
            context,
            q.prompt,
            _StableTextField(
              key: ValueKey('sc-fallback-${q.id}'),
              hint: 'En fazla 2 kelime',
              initial: value?.toString() ?? '',
              onChanged: onChanged,
            ),
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(q.prompt, style: promptStyle),
            const SizedBox(height: 8),
            ...choices.map((c) {
              final sel = value == c.value;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Material(
                  color: sel
                      ? Theme.of(context).colorScheme.primaryContainer
                      : Theme.of(context).colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(12),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () => onChanged(c.value),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      child: Row(
                        children: [
                          Icon(
                            sel ? Icons.radio_button_checked : Icons.radio_button_off,
                            size: 22,
                          ),
                          const SizedBox(width: 12),
                          Expanded(child: Text(c.label, softWrap: true)),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),
          ],
        );
      case 'multi_choice':
        final cur = (value as List<dynamic>?)?.map((e) => e.toString()).toList() ?? <String>[];
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(q.prompt, style: promptStyle),
            const SizedBox(height: 8),
            ...choices.map(
              (c) {
                final sel = cur.contains(c.value);
                return CheckboxListTile(
                  title: Text(c.label, softWrap: true),
                  value: sel,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (on) {
                    final next = [...cur];
                    if (on == true) {
                      if (!next.contains(c.value)) next.add(c.value);
                    } else {
                      next.remove(c.value);
                    }
                    onChanged(next);
                  },
                );
              },
            ),
          ],
        );
      case 'number':
        return _questionPromptShell(
          context,
          q.prompt,
          _StableTextField(
            key: ValueKey('n-${q.id}'),
            hint: 'Sayı gir',
            initial: value?.toString() ?? '',
            keyboardType: TextInputType.number,
            onChanged: (s) => onChanged(num.tryParse(s as String)),
          ),
        );
      case 'date':
        return _questionPromptShell(
          context,
          q.prompt,
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: Text(
              value?.toString().isNotEmpty == true ? value.toString() : 'Tarih seçmek için dokun',
            ),
            trailing: const Icon(Icons.calendar_month_rounded),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            onTap: () async {
              final now = DateTime.now();
              final d = await showDatePicker(
                context: context,
                initialDate: now,
                firstDate: DateTime(1900),
                lastDate: DateTime(now.year + 2),
              );
              if (d != null) {
                final iso =
                    '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
                onChanged(iso);
              }
            },
          ),
        );
      default:
        return _questionPromptShell(
          context,
          q.prompt,
          _StableTextField(
            key: ValueKey('t-${q.id}'),
            hint: 'En fazla 2 kelime',
            initial: value?.toString() ?? '',
            onChanged: onChanged,
          ),
        );
    }
  }
}

class _StableTextField extends StatefulWidget {
  const _StableTextField({
    super.key,
    this.hint,
    required this.initial,
    required this.onChanged,
    this.keyboardType,
  });

  final String? hint;
  final String initial;
  final ValueChanged<Object?> onChanged;
  final TextInputType? keyboardType;

  @override
  State<_StableTextField> createState() => _StableTextFieldState();
}

class _StableTextFieldState extends State<_StableTextField> {
  late final TextEditingController _c = TextEditingController(text: widget.initial);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _c,
      keyboardType: widget.keyboardType,
      minLines: 1,
      maxLines: 3,
      decoration: InputDecoration(
        hintText: widget.hint,
        alignLabelWithHint: true,
      ),
      onChanged: (s) => widget.onChanged(s),
    );
  }
}

class _PlayingBody extends StatefulWidget {
  const _PlayingBody({
    required this.categorySlug,
    required this.secretId,
    required this.playerToken,
    required this.state,
    required this.gameSentQuestionId,
    required this.onSubmitted,
  });

  final String categorySlug;
  final String secretId;
  final String playerToken;
  final Map<String, dynamic> state;
  final String? gameSentQuestionId;
  final ValueChanged<String> onSubmitted;

  @override
  State<_PlayingBody> createState() => _PlayingBodyState();
}

class _PlayingBodyState extends State<_PlayingBody> {
  List<PublicQuestion>? _gameQs;
  String? _err;
  Object? _value;
  bool _sending = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void didUpdateWidget(covariant _PlayingBody oldWidget) {
    super.didUpdateWidget(oldWidget);
    final oldId = oldWidget.state['currentQuestionId']?.toString();
    final newId = widget.state['currentQuestionId']?.toString();
    if (oldId != newId) {
      _value = null;
    }
  }

  Future<void> _load() async {
    try {
      final qs = await KimKimiRoomApi.fetchPublicQuestions(widget.categorySlug, 'game',
          secretId: widget.secretId);
      if (mounted) setState(() => _gameQs = sortPublicQuestions(qs));
    } catch (e) {
      if (mounted) setState(() => _err = e.toString());
    }
  }

  PublicQuestion? _currentQuestion() {
    final id = widget.state['currentQuestionId']?.toString();
    if (id == null || _gameQs == null) return null;
    for (final q in _gameQs!) {
      if (q.id == id) return q;
    }
    return null;
  }

  Future<void> _send(PublicQuestion q) async {
    if (_value == null || (_value is String && (_value as String).isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Önce bir cevap seç veya yaz')),
      );
      return;
    }
    if (_needsMaxTwoWords(q)) {
      final s = _value is String ? (_value as String).trim() : _value.toString().trim();
      if (_wordCount(s) > 2) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Metin cevabı en fazla 2 kelime olmalı.'),
          ),
        );
        return;
      }
    }
    setState(() => _sending = true);
    try {
      final api = KimKimiRoomApi(secretId: widget.secretId, playerToken: widget.playerToken);
      await api.submitGameAnswer(q.id, _value as Object);
      widget.onSubmitted(q.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Cevabın kaydedildi. Partnerini bekliyoruz.')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
      }
    } finally {
      if (mounted) setState(() => _sending = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    if (_err != null) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(16),
        child: Text(_err!),
      );
    }
    if (_gameQs == null) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(24),
        child: const Center(child: CircularProgressIndicator()),
      );
    }

    final q = _currentQuestion();
    final idx = widget.state['currentQuestionIndex'];
    final total = widget.state['totalGameQuestions'];
    final sent = widget.gameSentQuestionId == q?.id;

    if (q == null) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(20),
        child: Text(
          'Soru yükleniyor veya tur tamamlandı…',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      );
    }

    return KkSurfaceCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Tur ${idx is int ? idx + 1 : '?'} / ${total is int ? total : '?'}',
            style: Theme.of(context).textTheme.labelLarge?.copyWith(color: scheme.primary),
          ),
          const SizedBox(height: 8),
          _QuestionField(
            q: q,
            value: _value,
            onChanged: (v) => setState(() => _value = v),
          ),
          const SizedBox(height: 12),
          if (sent)
            Text(
              'Bu soru için cevabın iletildi; partner de yanıtlayınca sıradaki soruya geçilecek.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
            )
          else
            FilledButton(
              onPressed: _sending ? null : () => _send(q),
              child: _sending
                  ? const SizedBox(
                      height: 22,
                      width: 22,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Cevabı gönder'),
            ),
        ],
      ),
    );
  }
}

class _FinishedBody extends StatelessWidget {
  const _FinishedBody({
    required this.loading,
    required this.results,
    required this.players,
  });

  final bool loading;
  final dynamic results;
  final List<dynamic> players;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    if (loading) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(24),
        child: const Center(child: CircularProgressIndicator()),
      );
    }
    if (results == null) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(16),
        child: Text('Sonuçlar hesaplanıyor…', style: Theme.of(context).textTheme.bodyLarge),
      );
    }

    if (results is! Map) {
      return KkSurfaceCard(
        padding: const EdgeInsets.all(12),
        child: SelectableText(JsonEncoder.withIndent('  ').convert(results)),
      );
    }

    final m = _asStringKeyMap(results);
    final winner = m['winnerSeat']?.toString();
    final per = (m['perPlayer'] as List<dynamic>?) ?? [];
    final names = _namesFromPlayers(players);
    final winnerName = winner == 'host' ? names.host : winner == 'guest' ? names.guest : null;
    final loserName = winner == 'host' ? names.guest : winner == 'guest' ? names.host : null;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        KkSurfaceCard(
          backgroundColor: scheme.primaryContainer,
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Oyun bitti', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              if (winner != null && winnerName != null && loserName != null)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text.rich(
                      TextSpan(
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              color: scheme.onPrimaryContainer,
                              height: 1.35,
                            ),
                        children: [
                          TextSpan(
                            text: winnerName,
                            style: const TextStyle(fontWeight: FontWeight.w800),
                          ),
                          TextSpan(
                            text: ', ',
                            style: TextStyle(
                              fontWeight: FontWeight.normal,
                              color: scheme.onPrimaryContainer.withValues(alpha: 0.85),
                            ),
                          ),
                          TextSpan(text: loserName),
                          TextSpan(
                            text: '\u2019i daha iyi tanıyor ',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                              color: scheme.onPrimaryContainer.withValues(alpha: 0.9),
                            ),
                          ),
                          const TextSpan(text: '\u00a0🏆'),
                        ],
                      ),
                      textAlign: TextAlign.center,
                    ),
                    if (kWebPublicBase.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.network(
                          '$kWebPublicBase/media/sayMyName.gif',
                          height: 176,
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) {
                            return Image.network(
                              '$kWebPublicBase/media/SayMyName.gif',
                              height: 176,
                              fit: BoxFit.contain,
                              errorBuilder: (context, error, stackTrace) => const SizedBox.shrink(),
                            );
                          },
                        ),
                      ),
                    ],
                  ],
                )
              else
                Text(
                  'Berabere — ikiniz de efsanesiniz.',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        color: scheme.onPrimaryContainer,
                      ),
                ),
              const SizedBox(height: 12),
              Text(
                'Aşağıda her turda partnerin gerçek cevabı ile senin tahminini yan yana görebilirsin.',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: scheme.onPrimaryContainer.withValues(alpha: 0.88),
                    ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        ...per.map((raw) {
          final p = _asStringKeyMap(raw);
          final seat = p['seat']?.toString() ?? '';
          final score = p['score'];
          final max = p['max'];
          final details = (p['details'] as List<dynamic>?) ?? [];
          final label = seat == 'host' ? names.host : names.guest;
          return KkSurfaceCard(
            margin: const EdgeInsets.only(bottom: 10),
            padding: EdgeInsets.zero,
            child: ExpansionTile(
              title: Text(label),
              subtitle: Text('$score / $max doğru'),
              children: details.map((d) {
                final dm = _asStringKeyMap(d);
                final ok = dm['correct'] == true;
                final prompt = dm['prompt']?.toString() ?? '';
                return Padding(
                  padding: const EdgeInsets.fromLTRB(12, 6, 12, 10),
                  child: Material(
                    color: scheme.surfaceContainerHighest.withValues(alpha: 0.35),
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            ok ? Icons.check_circle_rounded : Icons.cancel_rounded,
                            color: ok ? Colors.green.shade700 : scheme.error,
                            size: 22,
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(prompt, style: Theme.of(context).textTheme.titleSmall),
                                const SizedBox(height: 8),
                                Text(
                                  'Partner cevabı: ${_formatResultValue(dm['expected'])}',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Tahminin: ${_formatResultValue(dm['answered'])}',
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        color: scheme.onSurfaceVariant,
                                      ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  ok ? 'Doğru' : 'Yanlış',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: ok ? Colors.green.shade800 : scheme.error,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          );
        }),
      ],
    );
  }
}
