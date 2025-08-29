import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  // Expecting: item, pcsKg, grams, price, amount, category, department, branch, unit, dateEncoded, encodedBy, countedBy, checkedBy, group
  const { item, pcsKg, grams, price, amount, category, department, branch, unit, dateEncoded, encodedBy, countedBy, checkedBy, group } = body;
  try {
    const result = await prisma.inventory.create({
      data: {
        item,
        pcsKg,
        grams,
        price,
        amount,
        category,
        department,
        branch,
        unit,
        dateEncoded: dateEncoded ? new Date(dateEncoded) : new Date(),
        encodedBy,
        countedBy,
        checkedBy,
        group,
      },
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const branch = searchParams.get('branch');
  const department = searchParams.get('department');
  const group = searchParams.get('group');
  const dateEncoded = searchParams.get('dateEncoded');

  const where: any = {};
  if (branch) where.branch = branch;
  if (department) where.department = department;
  if (group) where.group = group;
  if (dateEncoded) {
    // Match records where dateEncoded is the same date (ignore time)
    const date = new Date(dateEncoded);
    const start = new Date(date);
    start.setHours(0,0,0,0);
    const end = new Date(date);
    end.setHours(23,59,59,999);
    where.dateEncoded = { gte: start, lte: end };
  }

  try {
    const data = await prisma.inventory.findMany({ where });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const body = await (arguments[0]?.json?.() ?? Promise.resolve({}));
    // Use item, dateEncoded, branch, department, group to identify record
    const { item, dateEncoded, branch, department, group } = body;
    if (!item || !dateEncoded) {
      return NextResponse.json({ success: false, error: 'Missing item or dateEncoded for delete.' }, { status: 400 });
    }
    // Try to delete a single record matching all fields
    const result = await prisma.inventory.deleteMany({
      where: {
        item,
        branch,
        department,
        group,
        dateEncoded: new Date(dateEncoded)
      }
    });
    if (result.count === 0) {
      return NextResponse.json({ success: false, error: 'No matching record found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
