import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuestionPhase } from '@prisma/client';
import { PublicService } from './public.service';

@ApiTags('public')
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('categories')
  categories() {
    return this.publicService.categories();
  }

  @Get('categories/:slug/questions')
  questions(
    @Param('slug') slug: string,
    @Query('phase') phase?: QuestionPhase,
    @Query('secretId') secretId?: string,
  ) {
    return this.publicService.questions(slug, phase, secretId);
  }
}
