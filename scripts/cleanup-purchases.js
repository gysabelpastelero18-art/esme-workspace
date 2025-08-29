// Run this script once to clean up InvoiceDate fields in purchases.json
const fs = require('fs');
const path = require('path');

const DB_FILE = 'C:/Users/Shiela/ESMERALDA FINANCE/esme-workspace/data/purchases.json';
console.log('Resolved purchases.json path:', DB_FILE);

function formatDateMMDDYYYY(date) {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function normalizeInvoiceDate(invoiceDate) {
  if (invoiceDate === 0 || invoiceDate === null || invoiceDate === '') {
    return '';
  }
  if (typeof invoiceDate === 'string' && /^\d+$/.test(invoiceDate)) {
    invoiceDate = Number(invoiceDate);
  }
  if (typeof invoiceDate === 'number' && invoiceDate > 40000 && invoiceDate < 60000) {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + invoiceDate * 24 * 60 * 60 * 1000);
    return formatDateMMDDYYYY(jsDate);
  } else if (typeof invoiceDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
    const jsDate = new Date(invoiceDate);
    return formatDateMMDDYYYY(jsDate);
  }
  return invoiceDate;
}

function runCleanup() {
  if (!fs.existsSync(DB_FILE)) {
    console.error('purchases.json not found:', DB_FILE);
    return;
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const cleaned = data.map(row => ({
    ...row,
    InvoiceDate: normalizeInvoiceDate(row.InvoiceDate),
    Qty: typeof row.Qty === 'number' ? row.Qty : Number(row.Qty) || 0,
    Price: typeof row.Price === 'number' ? row.Price : Number(row.Price) || 0,
    Amount: typeof row.Amount === 'number' ? row.Amount : Number(row.Amount) || 0,
    GramsQty: typeof row.GramsQty === 'number' ? row.GramsQty : Number(row.GramsQty) || 0,
  }));
  fs.writeFileSync(DB_FILE, JSON.stringify(cleaned, null, 2));
  console.log('Cleanup complete. All InvoiceDate fields normalized.');
}

runCleanup();
