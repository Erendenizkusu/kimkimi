export type Category = {
  id: string;
  slug: string;
  title: string;
  sortOrder?: number;
};

export type PublicQuestion = {
  id: string;
  phase: string;
  type: string;
  prompt: string;
  choicesJson: unknown;
  orderIndex?: number;
  mapsToQuestionId?: string | null;
};

export type RoomStatePayload = Record<string, unknown>;
