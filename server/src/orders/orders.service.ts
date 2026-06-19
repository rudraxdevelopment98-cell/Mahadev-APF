import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products do not exist');
    }

    const priceById = new Map(products.map((p) => [p.id, p.price ?? new Prisma.Decimal(0)]));
    let total = new Prisma.Decimal(0);
    const items = dto.items.map((item) => {
      const unitPrice = priceById.get(item.productId) as Prisma.Decimal;
      total = total.add(unitPrice.mul(item.quantity));
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    return this.prisma.order.create({
      data: {
        userId,
        number: this.generateOrderNumber(),
        notes: dto.notes,
        total,
        items: { create: items },
      },
      include: { items: true },
    });
  }

  findForUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateOrderNumber(): string {
    const stamp = Date.now().toString(36).toUpperCase();
    return `APF-${stamp}`;
  }
}
