import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: { category?: string; search?: string }) {
    const where: Prisma.ProductWhereInput = { isPublished: true };
    if (params.category) {
      where.category = { slug: params.category };
    }
    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { blurb: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        blurb: dto.blurb,
        description: dto.description,
        categoryId: dto.categoryId,
        leadTime: dto.leadTime,
        stock: dto.stock ?? 0,
        isPublished: dto.isPublished ?? true,
        features: dto.features ?? [],
        gallery: dto.gallery ?? [],
        specs: (dto.specs as Prisma.InputJsonValue) ?? [],
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.ensureExists(id);
    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        specs: dto.specs as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    return this.prisma.product.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.product.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Product not found');
  }
}
