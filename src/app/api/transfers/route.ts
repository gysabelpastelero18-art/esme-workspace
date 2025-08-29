import { loadTransfers } from '@/lib/transfers-database';

export async function GET() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const transfers = await prisma.transfer.findMany();
    return NextResponse.json({ success: true, data: transfers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}

import { NextResponse } from 'next/server';
import { saveTransfers } from '@/lib/transfers-database';

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    // Bulk insert transfers
    await prisma.transfer.createMany({
      data,
      skipDuplicates: false // allow all rows
    });
    // Return updated transfers array
    const transfers = await prisma.transfer.findMany();
    return NextResponse.json({ success: true, data: transfers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}

export async function DELETE(request: Request) {
  try {
    const { startDate, endDate } = await request.json();
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const start = new Date(startDate);
    const end = new Date(endDate);
    // Find all transfers in date range
    const transfersToDelete = await prisma.transfer.findMany();
    const idsToDelete = transfersToDelete
      .filter((row: { TransDate: string | Date }) => {
        const rowDate = new Date(row.TransDate);
        return rowDate >= start && rowDate <= end;
      })
      .map((row: { id: number }) => row.id);
    await prisma.transfer.deleteMany({
      where: { id: { in: idsToDelete } }
    });
    return NextResponse.json({ success: true, deleted: idsToDelete.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}
