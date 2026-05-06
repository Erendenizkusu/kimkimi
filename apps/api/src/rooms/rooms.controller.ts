import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomDto } from './dto/join-room.dto';
import { ProfileAnswersDto } from './dto/profile-answers.dto';
import { GameAnswerDto } from './dto/game-answer.dto';
import { PlayerTokenGuard } from './player-token.guard';

@Controller()
export class RoomsController {
  constructor(private readonly rooms: RoomsService) {}

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('rooms')
  create(@Body() dto: CreateRoomDto) {
    return this.rooms.createRoom(dto);
  }

  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @Post('rooms/join')
  join(@Body() dto: JoinRoomDto) {
    return this.rooms.joinRoom(dto);
  }

  @UseGuards(PlayerTokenGuard)
  @Get('rooms/:secretId/state')
  state(@Param('secretId') secretId: string) {
    return this.rooms.getPublicRoomState(secretId);
  }

  @UseGuards(PlayerTokenGuard)
  @Post('rooms/:secretId/profile-answers')
  profileAnswers(
    @Param('secretId') secretId: string,
    @Req() req: Request,
    @Body() dto: ProfileAnswersDto,
  ) {
    const token = req.roomPlayer!.playerToken;
    return this.rooms.submitProfileAnswers(secretId, token, dto);
  }

  @UseGuards(PlayerTokenGuard)
  @Post('rooms/:secretId/game-answers')
  gameAnswer(@Param('secretId') secretId: string, @Req() req: Request, @Body() dto: GameAnswerDto) {
    const token = req.roomPlayer!.playerToken;
    return this.rooms.submitGameAnswer(secretId, token, dto);
  }

  @UseGuards(PlayerTokenGuard)
  @Get('rooms/:secretId/results')
  results(@Param('secretId') secretId: string, @Req() req: Request) {
    const token = req.roomPlayer!.playerToken;
    return this.rooms.getResults(secretId, token);
  }
}
