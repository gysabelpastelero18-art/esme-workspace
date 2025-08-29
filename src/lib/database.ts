// Simple file-based database for production records
import fs from 'fs/promises';
import path from 'path';

export interface ProductionRecord {
  id: string;
  date: string;
  branch: string;
  department: string;
  data: Array<{
    id: number;
    item: string;
    beg: number;
    production: number;
    used: number;
    kitchen: number;
    oneBalete: number;
    foodtrays: number;
    event: number;
    spoilage: number;
    return: number;
    ending: number;
    sold: number;
  }>;
  savedAt: string;
  updatedAt: string;
}

const DB_FILE = path.join(process.cwd(), 'data', 'production-records.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load all records from file
async function loadRecords(): Promise<ProductionRecord[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is corrupted, return empty array
    return [];
  }
}

// Save all records to file
async function saveRecords(records: ProductionRecord[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_FILE, JSON.stringify(records, null, 2));
}

// Generate unique ID for record
function generateRecordId(date: string, branch: string, department: string): string {
  return `${date}_${branch.replace(/\s+/g, '-')}_${department.replace(/\s+/g, '-')}`;
}

// Save production record
export async function saveProductionRecord(
  date: string,
  branch: string,
  department: string,
  data: ProductionRecord['data']
): Promise<{ success: boolean; message: string }> {
  try {
    const records = await loadRecords();
    const recordId = generateRecordId(date, branch, department);
    const existingIndex = records.findIndex(r => r.id === recordId);
    
    const record: ProductionRecord = {
      id: recordId,
      date,
      branch,
      department,
      data,
      savedAt: existingIndex === -1 ? new Date().toISOString() : records[existingIndex].savedAt,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }

    await saveRecords(records);
    return { success: true, message: 'Record saved successfully' };
  } catch (error) {
    console.error('Error saving production record:', error);
    return { success: false, message: 'Failed to save record' };
  }
}

// Load production record
export async function loadProductionRecord(
  date: string,
  branch: string,
  department: string
): Promise<ProductionRecord | null> {
  try {
    const records = await loadRecords();
    const recordId = generateRecordId(date, branch, department);
    const found = records.find(r => r.id === recordId) || null;
    if (found && Array.isArray(found.data)) {
      // For Cashier department, map foodtrays to sold
      if (found.department === 'Cashier') {
        found.data = found.data.map(item => ({
          ...item,
          sold: typeof item.foodtrays === 'number' ? item.foodtrays : (typeof item.sold === 'number' ? item.sold : 0)
        }));
      } else {
        // Ensure every item has 'sold' property
        found.data = found.data.map(item => ({
          ...item,
          sold: typeof item.sold === 'number' ? item.sold : 0
        }));
      }
    }
    return found;
  } catch (error) {
    console.error('Error loading production record:', error);
    return null;
  }
}

// Delete production record
export async function deleteProductionRecord(
  date: string,
  branch: string,
  department: string
): Promise<{ success: boolean; message: string }> {
  try {
    const records = await loadRecords();
    const recordId = generateRecordId(date, branch, department);
    const filteredRecords = records.filter(r => r.id !== recordId);
    
    if (filteredRecords.length === records.length) {
      return { success: false, message: 'Record not found' };
    }
    
    await saveRecords(filteredRecords);
    return { success: true, message: 'Record deleted successfully' };
  } catch (error) {
    console.error('Error deleting production record:', error);
    return { success: false, message: 'Failed to delete record' };
  }
}

// Get all records for a specific date and branch
export async function getRecordsByDateAndBranch(
  date: string,
  branch: string
): Promise<ProductionRecord[]> {
  try {
    const records = await loadRecords();
    return records.filter(r => r.date === date && r.branch === branch);
  } catch (error) {
    console.error('Error getting records:', error);
    return [];
  }
}
