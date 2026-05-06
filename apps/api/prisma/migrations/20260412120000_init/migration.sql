-- CreateEnum
CREATE TYPE "QuestionPhase" AS ENUM ('profile', 'game');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('text', 'single_choice', 'multi_choice', 'date', 'number');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('waiting', 'profile', 'playing', 'finished');

-- CreateEnum
CREATE TYPE "PlayerSeat" AS ENUM ('host', 'guest');

-- CreateEnum
CREATE TYPE "AnswerPhase" AS ENUM ('profile', 'game');

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "phase" "QuestionPhase" NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'text',
    "prompt" TEXT NOT NULL,
    "choices_json" JSONB,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "status" "QuestionStatus" NOT NULL DEFAULT 'draft',
    "maps_to_question_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "short_code" TEXT NOT NULL,
    "secret_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'waiting',
    "current_question_index" INTEGER NOT NULL DEFAULT 0,
    "question_order_json" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_players" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "seat" "PlayerSeat" NOT NULL,
    "player_token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "room_player_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "phase" "AnswerPhase" NOT NULL,
    "value_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_results" (
    "id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "summary_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "questions_category_id_phase_status_idx" ON "questions"("category_id", "phase", "status");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_short_code_key" ON "rooms"("short_code");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_secret_id_key" ON "rooms"("secret_id");

-- CreateIndex
CREATE INDEX "rooms_short_code_idx" ON "rooms"("short_code");

-- CreateIndex
CREATE UNIQUE INDEX "room_players_player_token_key" ON "room_players"("player_token");

-- CreateIndex
CREATE UNIQUE INDEX "room_players_room_id_seat_key" ON "room_players"("room_id", "seat");

-- CreateIndex
CREATE UNIQUE INDEX "answers_room_player_id_question_id_phase_key" ON "answers"("room_player_id", "question_id", "phase");

-- CreateIndex
CREATE UNIQUE INDEX "game_results_room_id_key" ON "game_results"("room_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_maps_to_question_id_fkey" FOREIGN KEY ("maps_to_question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_players" ADD CONSTRAINT "room_players_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_room_player_id_fkey" FOREIGN KEY ("room_player_id") REFERENCES "room_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_results" ADD CONSTRAINT "game_results_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
