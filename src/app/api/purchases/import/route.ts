import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';

// Helper: convert Excel/CSV buffer to PurchaseRow[]
function parseFileToPurchases(buffer: Buffer, filename: string): any[] {
  if (filename.endsWith('.csv')) {
    const csv = buffer.toString('utf8');
    return parse(csv, { columns: true, skip_empty_lines: true });
  } else if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  } else if (filename.endsWith('.json')) {
    return JSON.parse(buffer.toString('utf8'));
  }
  return [];
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  const fileData = Buffer.from(await file.arrayBuffer());
  const filename = file.name;

  // Parse file to purchases
  let purchases;
  try {
    purchases = parseFileToPurchases(fileData, filename);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 400 });
  }

  // Save to local file (data/purchases.json)
  const savePath = path.join(process.cwd(), 'data', 'purchases.json');
  await writeFile(savePath, JSON.stringify(purchases, null, 2), 'utf8');

  return NextResponse.json({ success: true, purchases });
}
