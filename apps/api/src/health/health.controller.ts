import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /** Render vb. yük dengeleyici için DB’siz canlılık (yalnızca süreç ayakta mı). */
  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get()
  async health() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', db: true };
  }
}
