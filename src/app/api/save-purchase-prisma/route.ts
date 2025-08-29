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
      InvoiceDate: String(row.InvoiceDate ?? ''),
      InvoiceNo: String(row.InvoiceNo ?? ''),
      Supplier: String(row.Supplier ?? ''),
      Category: String(row.Category ?? ''),
      Item: String(row.Item ?? ''),
      Qty: Number(row.Qty ?? 0),
      Unit: String(row.Unit ?? ''),
      Price: Number(row.Price ?? 0),
      Amount: Number(row.Amount ?? 0),
      GramsQty: Number(row.GramsQty ?? 0),
      Branch: String(row.Branch ?? ''),
    }));
    // Bulk create
    await prisma.purchase.createMany({ data: rows });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}