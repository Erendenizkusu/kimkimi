import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PlayerTokenGuard } from './player-token.guard';
import { RoomStateNotifier } from './room-state-notifier.service';
import { ScoringModule } from '../scoring/scoring.module';

@Module({
  imports: [ScoringModule],
  controllers: [RoomsController],
  providers: [RoomsService, PlayerTokenGuard, RoomStateNotifier],
  exports: [RoomsService, RoomStateNotifier],
})
export class RoomsModule {}
