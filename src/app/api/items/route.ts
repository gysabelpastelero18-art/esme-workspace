
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemDescParam = searchParams.get('itemdesc');
  if (itemDescParam) {
    // Find items by partial ItemDesc match and return matching items
    const items = await prisma.item.findMany({
      where: { ItemDesc: { contains: itemDescParam, mode: 'insensitive' } },
      select: { MID: true, Item: true, ItemDesc: true, Price: true, CUOMQty: true, Category: true, UInv: true }
    });
    return NextResponse.json(items);
  }
  const itemName = searchParams.get('itemDesc');
  if (itemName) {
    // Find item by name and return its price
    const itemResult = await prisma.item.findFirst({
      where: { Item: itemName },
      select: { Price: true }
    });
    return NextResponse.json({ price: itemResult?.Price ?? null });
  }
  // Default: return all items (as before)
  const itemDesc = await prisma.item.findMany();
  return NextResponse.json(itemDesc);
}
