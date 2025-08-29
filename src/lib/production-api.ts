// Frontend utility functions for production database operations

export interface ProductionItem {
  id: number;
  item: string;
  beg: number;
  production: number;
  del: number;
  used: number;
  cashier: number;
  bar: number;
  kitchen: number;
  oneBalete: number;
  oneB?: number; // 1B column for One Balete Branch
  foodtrays: number;
  event: number;
  spoilage: number;
  return: number;
  short: number;
  over: number;
  ending: number;
  sold: number;
}

export interface ProductionRecord {
  id: string;
  date: string;
  branch: string;
  department: string;
  data: ProductionItem[];
  savedAt: string;
  updatedAt: string;
}

// Save production data to database
export async function saveProductionData(
  date: string,
  branch: string,
  department: string,
  data: ProductionItem[]
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/production', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        branch,
        department,
        data
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving production data:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

// Load production data from database
export async function loadProductionData(
  date: string,
  branch: string,
  department: string
): Promise<{ success: boolean; data?: ProductionRecord; message?: string }> {
  try {
    const params = new URLSearchParams({ date, branch, department });
    const response = await fetch(`/api/production?${params}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error loading production data:', error);
    return { success: false, message: 'Network error occurred' };
  }
}

// Delete production record
export async function deleteProductionData(
  date: string,
  branch: string,
  department: string
): Promise<{ success: boolean; message: string }> {
  try {
    const params = new URLSearchParams({ date, branch, department });
    const response = await fetch(`/api/production?${params}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting production data:', error);
    return { success: false, message: 'Network error occurred' };
  }
}
