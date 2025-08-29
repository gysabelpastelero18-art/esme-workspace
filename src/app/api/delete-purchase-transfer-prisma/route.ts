import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();
    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'Missing date range.' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Delete Purchase records (InvoiceDate is string, so filter manually)
    const purchases = await prisma.purchase.findMany();
    const toDeleteIds = purchases
      .filter(p => {
        const d = new Date(p.InvoiceDate);
        return d >= start && d <= end;
      })
      .map(p => p.id);
    if (toDeleteIds.length > 0) {
      await prisma.purchase.deleteMany({
        where: { id: { in: toDeleteIds } }
      });
    }
    // Delete Transfer records
    await prisma.transfer.deleteMany({
      where: {
        TransDate: {
          gte: start,
          lte: end,
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}
