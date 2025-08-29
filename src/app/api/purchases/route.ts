import { NextResponse } from 'next/server';
import { savePurchases, loadPurchases } from '@/lib/purchases-database';
export async function GET() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const purchases = await prisma.purchase.findMany();
    return NextResponse.json({ success: true, data: purchases });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}

export async function POST(request: Request) {
	try {
		const { data } = await request.json();
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    // Bulk insert purchases
    await prisma.purchase.createMany({
      data,
      skipDuplicates: false // allow all rows, even with same InvoiceNo
    });
    // Return updated purchases array
    const purchases = await prisma.purchase.findMany();
    return NextResponse.json({ success: true, data: purchases });
	} catch (error) {
		return NextResponse.json({ success: false, error: error?.toString() });
	}
}

export async function DELETE(request: Request) {
  try {
    const { startDate, endDate } = await request.json();
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    // If date range covers all possible dates, delete all records
    if (startDate === '1900-01-01' && endDate === '2100-12-31') {
      const deleted = await prisma.purchase.deleteMany({});
      return NextResponse.json({ success: true, deleted: deleted.count });
    }
    // Otherwise, delete by date range
    const allPurchases = await prisma.purchase.findMany();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const idsToDelete = allPurchases
      .filter((row: { InvoiceDate: string; id: number }) => {
        // Parse InvoiceDate as mm/dd/yyyy
        const [mm, dd, yyyy] = row.InvoiceDate.split('/');
        const rowDate = new Date(`${yyyy}-${mm}-${dd}`);
        return rowDate >= start && rowDate <= end;
      })
      .map((row: { id: number }) => row.id);
    const deleted = await prisma.purchase.deleteMany({
      where: { id: { in: idsToDelete } }
    });
    return NextResponse.json({ success: true, deleted: deleted.count });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.toString() });
  }
}
