import { Injectable, NotFoundException } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  // Public — captured from the website contact / quote form
  create(dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        company: dto.company,
        phone: dto.phone,
        message: dto.message,
        source: dto.source ?? 'website',
        score: this.scoreLead(dto),
      },
    });
  }

  findAll(status?: LeadStatus) {
    return this.prisma.lead.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateLeadDto) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return this.prisma.lead.update({ where: { id }, data: dto });
  }

  // Simple deterministic lead-scoring heuristic
  private scoreLead(dto: CreateLeadDto): number {
    let score = 20;
    if (dto.company) score += 30;
    if (dto.phone) score += 20;
    if (dto.message.length > 120) score += 20;
    return Math.min(score, 100);
  }
}
