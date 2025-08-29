import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateEncoded = searchParams.get('dateEncoded');
    const group = searchParams.get('group');
    const branch = searchParams.get('branch');
    const department = searchParams.get('department');
    // Build where clause for Prisma
    const where: any = {};
    if (dateEncoded) {
      // Compare only the date part
      where.dateEncoded = {
        equals: new Date(dateEncoded)
      };
    }
    if (group) where.group = group;
    if (branch) where.branch = branch;
    if (department) where.department = department;
    const data = await prisma.warehouseNF.findMany({ where });
    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    console.error('Fetch error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Incoming data:', data);
    // Save to WarehouseNF table
    const saved = await prisma.warehouseNF.create({
      data: data,
    });
    return new Response(JSON.stringify({ success: true, data: saved }), { status: 200 });
  } catch (error) {
    console.error('Save error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }), { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const data = await req.json();
    const { item, dateEncoded, branch, department, group } = data;
    if (!item || !dateEncoded) {
      return new Response(JSON.stringify({ success: false, error: 'Missing item or dateEncoded for delete.' }), { status: 400 });
    }
    const where: any = {
      item,
      branch,
      department,
      group,
      dateEncoded: { equals: new Date(dateEncoded) }
    };
    const result = await prisma.warehouseNF.deleteMany({
      where,
    });
    if (result.count === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No matching record found.' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : String(error) }), { status: 500 });
  }
}
