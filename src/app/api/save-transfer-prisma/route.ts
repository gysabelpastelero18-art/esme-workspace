import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    if (!Array.isArray(data)) {
      return NextResponse.json({ success: false, error: 'No data to import.' });
    }
    // Map and clean up each row for Prisma
    const rows = data.map(row => ({
      Group: String(row.Group ?? ''),
      TransDate: row.TransDate ? new Date(row.TransDate) : new Date(),
      DRNo: String(row.DRNo ?? ''),
      Branch: String(row.Branch ?? ''),
      Department: String(row.Department ?? ''),
      Category: String(row.Category ?? ''),
      Item: String(row.Item ?? ''),
      Qty: Number(row.Qty ?? 0),
      Unit: String(row.Unit ?? ''),
      Price: Number(row.Price ?? 0),
      Amount: Number(row.Amount ?? 0),
    }));
    // Bulk create
    await prisma.transfer.createMany({ data: rows });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}
