export async function GET() {
  try {
    const items = await prisma.nonFoodItem.findMany();
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
export async function DELETE() {
  try {
    await prisma.nonFoodItem.deleteMany({});
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const items = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Invalid data format' });
    }
    // Bulk create NonFoodItems
    const result = await prisma.nonFoodItem.createMany({
      data: items.map(row => ({
        NFID: row.NFID,
        Group: row.Group,
        GCode: row.GCode,
        Category: row.Category,
        CCode: row.CCode,
        SubCategory: row.SubCategory,
        SCCode: row.SCCode,
        Brand: row.Brand,
        Item: row.Item,
        Supplier: row.Supplier,
        Price: row.Price ? Number(row.Price) : null,
        Barcode: row.Barcode,
        BIRGroup: row.BIRGroup,
        Size: row.Size,
        Model: row.Model,
        Serial: row.Serial,
        EncodeDate: row.EncodeDate ? new Date(row.EncodeDate) : null,
        EncodedBy: row.EncodedBy,
        PCSPerPack: row.PCSPerPack ? Number(row.PCSPerPack) : null,
        PricePc: row.PricePc ? Number(row.PricePc) : null,
        Unit: row.Unit,
        SUInv: row.SUInv,
        UInv: row.UInv,
      }))
    });
    return NextResponse.json({ success: true, count: result.count });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
