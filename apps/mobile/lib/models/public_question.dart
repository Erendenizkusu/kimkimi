class PublicQuestion {
  const PublicQuestion({
    required this.id,
    required this.phase,
    required this.type,
    required this.prompt,
    this.choicesJson,
    this.orderIndex,
    this.mapsToQuestionId,
  });

  final String id;
  final String phase;
  final String type;
  final String prompt;
  final dynamic choicesJson;
  final int? orderIndex;
  final String? mapsToQuestionId;

  factory PublicQuestion.fromJson(Map<String, dynamic> j) {
    return PublicQuestion(
      id: j['id'] as String,
      phase: j['phase'] as String? ?? '',
      type: j['type'] as String? ?? 'text',
      prompt: j['prompt'] as String? ?? '',
      choicesJson: j['choicesJson'],
      orderIndex: j['orderIndex'] as int?,
      mapsToQuestionId: j['mapsToQuestionId'] as String?,
    );
  }
}
