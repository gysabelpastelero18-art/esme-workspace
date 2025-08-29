import fs from 'fs/promises';
import path from 'path';

export interface TransferRow {
  Group: string;
  TransDate: string;
  DRNo: string;
  Branch: string;
  Department: string;
  Category: string;
  Item: string;
  Qty: string;
  Unit: string;
  Price: string;
  Amount: string;
}

const DB_FILE = path.join(process.cwd(), 'data', 'transfers.json');

async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function loadTransfers(): Promise<TransferRow[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveTransfers(rows: TransferRow[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_FILE, JSON.stringify(rows, null, 2));
}
