import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const items = await req.json();
    let errorLog = [];
    for (const item of items) {
      try {
        await prisma.item.upsert({
          where: { MID: item.MID },
          update: { ...item },
          create: { ...item }
        });
      } catch (err) {
        errorLog.push({ MID: item.MID, error: err?.toString() });
      }
    }
    if (errorLog.length > 0) {
      console.error('Item import errors:', errorLog);
      return NextResponse.json({ success: false, errorLog });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}
