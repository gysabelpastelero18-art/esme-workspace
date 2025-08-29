
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export interface PurchaseRow {
  Group: string;
  InvoiceDate: string;
  InvoiceNo: string;
  Supplier: string;
  Category: string;
  Item: string;
  Qty: number;
  Unit: string;
  Price: number;
  Amount: number;
  GramsQty: number;
  Branch: string;
}


export async function loadPurchases(): Promise<PurchaseRow[]> {
  // Load all purchases from the database
  const purchases = await prisma.purchase.findMany({ orderBy: { createdAt: 'desc' } });
  // Map to PurchaseRow type
  return purchases.map((row: any) => ({
    Group: row.Group,
    InvoiceDate: row.InvoiceDate,
    InvoiceNo: row.InvoiceNo,
    Supplier: row.Supplier,
    Category: row.Category,
    Item: row.Item,
    Qty: row.Qty,
    Unit: row.Unit,
    Price: row.Price,
    Amount: row.Amount,
    GramsQty: row.GramsQty,
    Branch: row.Branch,
  }));
}

export async function savePurchases(rows: PurchaseRow[]): Promise<void> {
  // Bulk insert new purchases, appending to existing data
  await prisma.purchase.createMany({
    data: rows.map(row => ({
      Group: row.Group,
      InvoiceDate: row.InvoiceDate,
      InvoiceNo: row.InvoiceNo,
      Supplier: row.Supplier,
      Category: row.Category,
      Item: row.Item,
      Qty: row.Qty,
      Unit: row.Unit,
      Price: row.Price,
      Amount: row.Amount,
      GramsQty: row.GramsQty,
      Branch: row.Branch,
    })),
    skipDuplicates: true,
  });
}
