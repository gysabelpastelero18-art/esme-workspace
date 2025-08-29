import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transfers = await prisma.transfer.findMany();
    return NextResponse.json({ success: true, data: transfers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}
