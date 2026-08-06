-- Oda başına rastgele oyun sorusu seçiminde, üst üste aynı kategoride öncelik için son tur id’leri
ALTER TABLE "categories" ADD COLUMN "last_game_question_ids" JSONB;
