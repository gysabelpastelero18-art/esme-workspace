"use client";
import React, { useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';

// Helper to format date as MM/dd/yyyy
function formatDateMMDDYYYY(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// Helper to format date for backend
function formatDate(date: Date | null) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Type for a purchase row
export type PurchaseRow = {
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
};

export default function PurchasesDashboard() {
  const router = useRouter();
  const [showExportBox, setShowExportBox] = useState(false);
  // Handler for export option click
  const handleExportOption = (option: string) => {
    setShowExportBox(false);
    // TODO: Implement export logic for each option
    setErrorMsg(`Exporting: ${option}`);
  };
  // TODO: Replace with actual authentication logic
  const isAdmin = true; // Set to true for admin, false for non-admin
  const [selectedGroup, setSelectedGroup] = useState<string>('RawMats');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [search, setSearch] = useState("");
  const [purchaseRows, setPurchaseRows] = useState<PurchaseRow[]>([]);
  const [transferRows, setTransferRows] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Fetch purchases and transfers when date range changes
  React.useEffect(() => {
    const s = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const e = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const startStr = s ? `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, '0')}-${String(s.getDate()).padStart(2, '0')}` : '';
    const endStr = e ? `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, '0')}-${String(e.getDate()).padStart(2, '0')}` : '';
    // Auto-select RawMats group when date range changes
    setSelectedGroup('RawMats');
    fetch(`/api/purchases?startDate=${startStr}&endDate=${endStr}`)
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setPurchaseRows(json.data);
        } else {
          setPurchaseRows([]);
        }
      })
      .catch(err => {
        setErrorMsg('Error loading purchases: ' + (err?.toString() || 'Unknown error'));
        setPurchaseRows([]);
      });
    fetch('/api/transfers')
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setTransferRows(json.data);
        } else {
          setTransferRows([]);
        }
      })
      .catch(err => {
        setErrorMsg('Error loading transfers: ' + (err?.toString() || 'Unknown error'));
        setTransferRows([]);
      });
  }, [startDate, endDate]);

  // Parse file (CSV/Excel)
  const parseFile = (file: File, cb: (rows: any[]) => void) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          console.log('PapaParse results:', results);
          if (results.errors && results.errors.length > 0) {
            results.errors.forEach((err: any) => {
              console.error('PapaParse error:', err);
            });
            cb([]); // Pass empty array to indicate error
          } else {
            cb(results.data);
          }
        },
        error: (error: any) => {
          console.error('PapaParse fatal error:', error);
          cb([]); // Pass empty array to indicate error
        },
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          cb(rows);
        } catch (error) {
          console.error('XLSX parse error:', error);
          cb([]);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Normalize imported rows to correct types
  const normalizeRows = (rows: any[]): PurchaseRow[] =>
    rows.map(row => {
      let invoiceDate = row.InvoiceDate;
      // If InvoiceDate is 0, null, or empty string, set to today's date
      if (!invoiceDate || invoiceDate === 0 || invoiceDate === '') {
        invoiceDate = formatDateMMDDYYYY(new Date());
      } else {
        // Convert numeric strings to numbers
        if (typeof invoiceDate === 'string' && /^\d+$/.test(invoiceDate)) {
          invoiceDate = Number(invoiceDate);
        }
        // Handle Excel serial date
        if (typeof invoiceDate === 'number' && invoiceDate > 40000 && invoiceDate < 60000) {
          const excelEpoch = new Date(1899, 11, 30);
          const jsDate = new Date(excelEpoch.getTime() + invoiceDate * 24 * 60 * 60 * 1000);
          invoiceDate = formatDateMMDDYYYY(jsDate); // MM/DD/YYYY
        } else if (typeof invoiceDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(invoiceDate)) {
          // Already in YYYY-MM-DD, convert to MM/DD/YYYY
          const jsDate = new Date(invoiceDate);
          invoiceDate = formatDateMMDDYYYY(jsDate);
        } else if (typeof invoiceDate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(invoiceDate)) {
          // Already in MM/DD/YYYY, do nothing
        } else {
          // Fallback: try to parse as date
          const jsDate = new Date(invoiceDate);
          if (!isNaN(jsDate.getTime())) {
            invoiceDate = formatDateMMDDYYYY(jsDate);
          } else {
            invoiceDate = formatDateMMDDYYYY(new Date());
          }
        }
      }
      return {
        ...row,
        InvoiceDate: invoiceDate,
        Qty: Number(row.Qty) || 0,
        Price: Number(row.Price) || 0,
        Amount: Number(row.Amount) || 0,
        GramsQty: Number(row.GramsQty) || 0,
      };
    });

  // Normalize imported transfer rows to correct types
  const normalizeTransferRows = (rows: any[]): any[] =>
    rows.map(row => {
      let transDate = row.TransDate;
      if (!transDate || transDate === 0 || transDate === '') {
        transDate = new Date();
      } else {
        if (typeof transDate === 'string' && /^\d+$/.test(transDate)) {
          transDate = Number(transDate);
        }
        // Excel serial date
        if (typeof transDate === 'number' && transDate > 40000 && transDate < 60000) {
          const excelEpoch = new Date(1899, 11, 30);
          transDate = new Date(excelEpoch.getTime() + transDate * 24 * 60 * 60 * 1000);
        } else if (typeof transDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(transDate)) {
          transDate = new Date(transDate);
        } else if (typeof transDate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(transDate)) {
          // MM/DD/YYYY
          const [mm, dd, yyyy] = transDate.split('/');
          transDate = new Date(`${yyyy}-${mm}-${dd}`);
        } else {
          const jsDate = new Date(transDate);
          if (!isNaN(jsDate.getTime())) {
            transDate = jsDate;
          } else {
            transDate = new Date();
          }
        }
      }
      return {
        ...row,
        TransDate: transDate,
        Qty: Number(row.Qty) || 0,
        Price: Number(row.Price) || 0,
        Amount: Number(row.Amount) || 0,
      };
    });

  // Handle file import for purchases
  // Handle file import for transfers
  const handleTransferImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseFile(file, async (rows) => {
      try {
        if (!rows || rows.length === 0) {
          setErrorMsg('Error importing transfers: File could not be parsed. Check format and headers.');
          return;
        }
        const normalizedRows = normalizeTransferRows(rows);
        // Fetch current transfers from backend to check for duplicates
        const currentRes = await fetch('/api/transfers');
        const currentJson = await currentRes.json();
        const currentData = (currentJson.success && Array.isArray(currentJson.data)) ? currentJson.data : [];
        // Define a function to check if a row is duplicate (by Date, Department, Item, Branch, and Amount)
        const isDuplicate = (row: any): boolean => {
          return currentData.some((existing: any) =>
            existing.Date === row.Date &&
            existing.Department === row.Department &&
            existing.Item === row.Item &&
            existing.Branch === row.Branch &&
            existing.Amount === row.Amount
          );
        };
        // Filter out duplicates
        const newRows = normalizedRows.filter(row => !isDuplicate(row));
        if (newRows.length === 0) {
          setErrorMsg('No new transfers to import. All rows are duplicates.');
          return;
        }
        // Save only new rows to backend
        const saveRes = await fetch('/api/transfers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: newRows })
        });
        const saveJson = await saveRes.json();
        if (saveJson.success && Array.isArray(saveJson.data)) {
          setTransferRows(saveJson.data);
          setErrorMsg(`Successfully imported ${newRows.length} transfers. Duplicates were skipped.`);
        } else {
          setErrorMsg('Import completed, but no data returned from backend.');
        }
      } catch (err) {
        setErrorMsg('Error importing transfers: ' + (err?.toString() || 'Unknown error'));
      }
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };
  const handlePurchaseImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseFile(file, async (rows) => {
      try {
        if (!rows || rows.length === 0) {
          setErrorMsg('Error importing purchases: File could not be parsed. Check format and headers.');
          return;
        }
        const normalizedRows = normalizeRows(rows);
        // Fetch current purchases from backend to check for duplicates
        const currentRes = await fetch('/api/purchases');
        const currentJson = await currentRes.json();
        const currentData = (currentJson.success && Array.isArray(currentJson.data)) ? currentJson.data : [];
        // Define a function to check if a row is duplicate (by InvoiceNo, Supplier, Category, Item, Branch, and Amount)
        const isDuplicate = (row: any): boolean => {
          return currentData.some((existing: any) =>
            existing.InvoiceNo === row.InvoiceNo &&
            existing.Supplier === row.Supplier &&
            existing.Category === row.Category &&
            existing.Item === row.Item &&
            existing.Branch === row.Branch &&
            existing.Amount === row.Amount
          );
        };
        // Filter out duplicates
        const newRows = normalizedRows.filter(row => !isDuplicate(row));
        if (newRows.length === 0) {
          setErrorMsg('No new purchases to import. All rows are duplicates.');
          return;
        }
        // Save only new rows to backend
        const saveRes = await fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: newRows })
        });
        const saveJson = await saveRes.json();
        if (saveJson.success) {
          // Reload purchases from backend
          fetch('/api/purchases')
            .then(res => res.json())
            .then(json => {
              if (json.success && Array.isArray(json.data)) {
                setPurchaseRows(json.data);
                setErrorMsg(`Successfully imported ${newRows.length} purchases. Duplicates were skipped.`);
              } else {
                setPurchaseRows([]);
                setErrorMsg('Import completed, but no data returned from backend.');
              }
            });
        } else {
          setErrorMsg('Error saving purchases: ' + (saveJson.error || 'Unknown error'));
        }
      } catch (err) {
        setErrorMsg('Error importing purchases: ' + (err?.toString() || 'Unknown error'));
      }
    });
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const purchases: PurchaseRow[] = purchaseRows;

  // Helper: aggregate rows by item and sum amounts
  function getTopItems(rows: any[], branch: string, itemField: string = 'Item', amountField: string = 'Amount') {
    const agg: Record<string, number> = {};
    rows.forEach(row => {
      if (row.Branch === branch && row[itemField]) {
        const key = row[itemField];
        agg[key] = (agg[key] || 0) + (Number(row[amountField]) || 0);
      }
    });
    // Convert to array and sort
    return Object.entries(agg)
      .map(([item, amount]) => ({ item, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }

  // Filter logic
  const filteredPurchases = purchases.filter((row: PurchaseRow) => {
    const rowDate = new Date(row.InvoiceDate);
    const s = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const e = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const matchesDate = s && e ? rowDate >= s && rowDate <= e : true;
    const matchesGroup = row.Group === selectedGroup;
    const matchesSearch = search === "" || Object.values(row).some(val => String(val).toLowerCase().includes(search.toLowerCase()));
    return matchesDate && matchesGroup && matchesSearch;
  });
  const filteredTransfers = transferRows.filter((row: any) => {
    // Convert Excel serial date to JS Date
    let rowDate: Date;
    if (typeof row.TransDate === 'number') {
      // Excel serial date: days since Jan 1, 1900
      rowDate = new Date(Date.UTC(1900, 0, row.TransDate - 1));
    } else {
      rowDate = new Date(row.TransDate);
    }
    const s = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const e = typeof endDate === 'string' ? new Date(endDate) : endDate;
    const matchesDate = s && e ? rowDate >= s && rowDate <= e : true;
    const matchesGroup = row.Group === selectedGroup;
    const matchesSearch = search === "" || Object.values(row).some(val => String(val).toLowerCase().includes(search.toLowerCase()));
    return matchesDate && matchesGroup && matchesSearch;
  });

  // Department normalization map for transfers
  const transferDeptMap: Record<string, string> = {
    '1B ADMIN': 'ADMIN',
    '1B BAKERY': 'BAKERY',
    '1B BAR': 'BAR',
    '1B CASHIER': 'CASHIER',
    '1B COMMISSARY': 'COMMISSARY',
    '1B DESSERT': 'DESSERT',
    '1B FOH (DINING)': 'FOH (DINING)',
    '1B KITCHEN': 'MAIN KITCHEN',
    'EMPLOYEES MEAL 1B': 'EMPLOYEES MEAL',
    '1B MAINTENANCE': 'MAINTENANCE',
  };
  const defaultTransferDepts = [
    'ADMIN',
    'BAKERY',
    'BAR',
    'CASHIER',
    'COMMISSARY',
    'DESSERT',
    'FOH (DINING)',
    'EMPLOYEES MEAL',
    'MAIN KITCHEN',
    'MAINTENANCE',
  ];
  const normalizedTransferDepts = [...new Set(filteredTransfers.map((row: any) => transferDeptMap[row.Department] || row.Department))].filter(Boolean);

  // Reset handler (delete all purchases)
  const handleReset = async () => {
    try {
      // Delete purchases
      const resPurchase = await fetch('/api/purchases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: '1900-01-01', endDate: '2100-12-31' })
      });
      // Delete transfers
      const resTransfer = await fetch('/api/transfers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: '1900-01-01', endDate: '2100-12-31' })
      });
      const jsonPurchase = await resPurchase.json();
      const jsonTransfer = await resTransfer.json();
      if (jsonPurchase.success && jsonTransfer.success) {
        setErrorMsg('All purchase and transfer data has been reset.');
      } else {
        setErrorMsg('Reset failed: ' + (jsonPurchase.error || jsonTransfer.error || 'Unknown error'));
      }
      // Reload purchases and transfers from backend
      fetch('/api/purchases')
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setPurchaseRows(json.data);
          } else {
            setPurchaseRows([]);
          }
        });
      fetch('/api/transfers')
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setTransferRows(json.data);
          } else {
            setTransferRows([]);
          }
        });
    } catch (err) {
      setErrorMsg('Error resetting purchases and transfers: ' + (err?.toString() || 'Unknown error'));
    }
  };
  const handleResetAll = async () => {
    try {
      // Delete all purchases
      const resPurchase = await fetch('/api/purchases', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: '1900-01-01', endDate: '2100-12-31' })
      });
      // Delete all transfers
      const resTransfer = await fetch('/api/transfers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: '1900-01-01', endDate: '2100-12-31' })
      });
      const jsonPurchase = await resPurchase.json();
      const jsonTransfer = await resTransfer.json();
      if (jsonPurchase.success && jsonTransfer.success) {
        setErrorMsg('All purchase and transfer records have been deleted.');
      } else {
        setErrorMsg('Reset all failed: ' + (jsonPurchase.error || jsonTransfer.error || 'Unknown error'));
      }
      // Reload purchases and transfers from backend
      fetch('/api/purchases')
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setPurchaseRows(json.data);
          } else {
            setPurchaseRows([]);
          }
        });
      fetch('/api/transfers')
        .then(res => res.json())
        .then(json => {
          if (json.success && Array.isArray(json.data)) {
            setTransferRows(json.data);
          } else {
            setTransferRows([]);
          }
        });
    } catch (err) {
      setErrorMsg('Error resetting all: ' + (err?.toString() || 'Unknown error'));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#e3e7e3] via-[#e6ede6] to-[#c7d1c0] p-8 flex flex-col items-center" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 400, fontSize: '1.08rem', letterSpacing: '0.01em' }}>
        {/* Top Action Bar - flush top, horizontal layout */}
      <div className="w-full max-w-7xl flex flex-row items-center justify-between mb-6">
        <button className="flex items-center gap-2 px-5 py-2 bg-[#006400] text-white rounded-xl font-bold shadow hover:bg-[#2d3a2e] transition"
          onClick={() => router.push('/maindashboard')}
        >
          <span style={{ fontSize: '1.5rem' }}>🏠</span>
          <span>Dashboard</span>
        </button>
        {/* Group selection dropdown */}
        <div className="flex flex-wrap gap-4 justify-end items-center">
          <label htmlFor="group-select" className="font-bold text-[#006400] mr-2">Group:</label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={e => setSelectedGroup(e.target.value)}
            className="px-3 py-2 rounded border border-[#b5c9a3] bg-white text-[#006400] font-bold"
          >
            {/* Dynamically list all groups from purchases and transfers */}
            {[...new Set([...purchaseRows.map(r => r.Group), ...transferRows.map(r => r.Group)])].filter(Boolean).map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          {isAdmin && (
            <>
              <label className="flex items-center gap-2 px-5 py-2 bg-[#9CAF88] text-white rounded-xl font-bold shadow hover:bg-[#4A6741] transition cursor-pointer">
                <span style={{ fontSize: '1.3rem' }}>⬆️</span>
                <span>Import Purchase</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".csv,.xlsx,.xls"
                  onChange={handlePurchaseImport}
                />
              </label>
              <label className="flex items-center gap-2 px-5 py-2 bg-[#9CAF88] text-white rounded-xl font-bold shadow hover:bg-[#4A6741] transition cursor-pointer">
                <span style={{ fontSize: '1.3rem' }}>⬆️</span>
                <span>Import Transfer</span>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept=".csv,.xlsx,.xls"
                  onChange={handleTransferImport}
                />
              </label>
              <button
                className="flex items-center gap-2 px-5 py-2 bg-[#e6ede6] text-[#006400] rounded-xl font-bold shadow hover:bg-[#b5c9a3] transition border border-[#b5c9a3]"
                onClick={handleReset}
              >
                <span style={{ fontSize: '1.3rem' }}>🔄</span>
                <span>Reset</span>
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-xl font-bold shadow hover:bg-red-800 transition border border-red-700"
                onClick={handleResetAll}
              >
                <span style={{ fontSize: '1.3rem' }}>🗑️</span>
                <span>Reset All</span>
              </button>
            </>
          )}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              className="flex items-center gap-2 px-5 py-2 bg-[#4A6741] text-white rounded-xl font-bold shadow hover:bg-[#2d3a2e] transition"
              onClick={() => setShowExportBox(v => !v)}
            >
              <span style={{ fontSize: '1.3rem' }}>📤</span>
              <span>Export</span>
            </button>
            {showExportBox && (
              <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 10 }} className="bg-white border border-[#b5c9a3] rounded-xl shadow-lg p-4 flex flex-col gap-2 min-w-[160px]">
                <button className="w-full px-4 py-2 rounded font-bold text-[#006400] hover:bg-[#e6ede6] transition" onClick={() => handleExportOption('Details')}>Details</button>
                <button className="w-full px-4 py-2 rounded font-bold text-[#006400] hover:bg-[#e6ede6] transition" onClick={() => handleExportOption('Summary')}>Summary</button>
                <button className="w-full px-4 py-2 rounded font-bold text-[#006400] hover:bg-[#e6ede6] transition" onClick={() => handleExportOption('Weekly')}>Weekly</button>
                <button className="w-full px-4 py-2 rounded font-bold text-[#006400] hover:bg-[#e6ede6] transition" onClick={() => handleExportOption('Monthly')}>Monthly</button>
              </div>
            )}
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-[#006400] text-white rounded-xl font-bold shadow hover:bg-[#2d3a2e] transition">
            <span style={{ fontSize: '1.3rem' }}>🖨️</span>
            <span>Print</span>
          </button>
        </div>
      </div>
      {/* Error Message */}
      {errorMsg && (
        <div className="w-full max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
          {errorMsg}
        </div>
      )}
      <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-2xl border border-[#b5c9a3] p-16 mb-10">
        <h1 className="text-4xl font-extrabold text-[#006400] text-center mb-12 tracking-tight drop-shadow-lg flex items-center justify-center gap-3" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 800, letterSpacing: '0.02em' }}>
          Purchase vs Transfer
        </h1>
        {/* Date Range Picker below title */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <label className="font-semibold text-[#4A6741]">Date Range:</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="MM/dd/yyyy"
            className="px-4 py-2 rounded-lg border border-[#b5c9a3] focus:outline-none focus:ring-2 focus:ring-[#9CAF88]"
            placeholderText="Start Date"
          />
          <span className="mx-2 text-[#4A6741]">to</span>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ?? undefined}
            dateFormat="MM/dd/yyyy"
            className="px-4 py-2 rounded-lg border border-[#b5c9a3] focus:outline-none focus:ring-2 focus:ring-[#9CAF88]"
            placeholderText="End Date"
          />
        </div>
        <div className="flex gap-4 justify-center mb-10">
          {['RawMats', 'Employees Meal', 'NonFood'].map(group => (
            <button
              key={group}
              className={`px-6 py-2 rounded-xl font-bold shadow transition border border-[#b5c9a3] ${selectedGroup === group ? 'bg-[#006400] text-white' : 'bg-[#e6ede6] text-[#006400]'}`}
              onClick={() => setSelectedGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
          {/* Purchases Summary Table */}
          <div className="flex-1 bg-white/95 rounded-2xl shadow-lg border border-[#e5e7eb] p-10 mb-8 md:mb-0" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 500, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
              <h2 className="text-2xl font-bold text-[#006400] mb-8 text-center tracking-tight flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 700 }}>
                <span style={{ fontSize: '1.7rem' }}>🛒</span> Purchases Summary
              </h2>
              <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden" style={{ borderCollapse: 'collapse', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '1.08rem', boxShadow: '0 2px 12px rgba(156,175,136,0.08)', border: '4px solid #2d3a2e' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
                    <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em' }}>Category</th>
                    <th className="px-10 py-4 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em', minWidth: '160px' }}>Mayon</th>
                    <th className="px-10 py-4 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em', minWidth: '160px' }}>One Balete</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Dynamically get all categories from filteredPurchases, sorted alphabetically, with LessFee logic (subtract only from matching supplier and category) */}
                  {/* Dynamically get all categories from filteredPurchases, sorted alphabetically, strictly excluding LessFee. */}
                  {/* Fixed category order for Purchases Summary */}
                  {['BEVERAGE','DAIRY','GROCERY','MEAT','POULTRY','PRODUCE','SEAFOOD'].map((category) => {
                    const mayonTotal = filteredPurchases.filter((row: PurchaseRow) => row.Branch === 'Mayon' && row.Category && String(row.Category).trim().toUpperCase() === category).reduce((sum: number, row: PurchaseRow) => sum + (row.Amount || 0), 0);
                    const baleteTotal = filteredPurchases.filter((row: PurchaseRow) => row.Branch === 'One Balete' && row.Category && String(row.Category).trim().toUpperCase() === category).reduce((sum: number, row: PurchaseRow) => sum + (row.Amount || 0), 0);
                    return (
                      <tr key={category} className="hover:bg-[#f0f8f0] transition-colors" style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <td className="px-6 py-4 text-left font-medium text-[#4A6741]" style={{ fontSize: '1rem' }}>{category}</td>
                        <td className="px-10 py-4 text-right font-bold text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>{mayonTotal === 0 ? '-' : `₱${Number(mayonTotal).toLocaleString()}`}</td>
                        <td className="px-10 py-4 text-right font-bold text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>{baleteTotal === 0 ? '-' : `₱${Number(baleteTotal).toLocaleString()}`}</td>
                      </tr>
                    );
                  })}
                  {/* Total Row for Purchases: sum only displayed categories (single row) */}
                  {/* ...existing code... */}
                  {/* Total Row for Purchases, including LessFee as a separate line in the footer */}
                  {(() => {
                    const mayonTotal = filteredPurchases.filter((row: PurchaseRow) => row.Branch === 'Mayon' && row.Category !== 'LessFee').reduce((sum: number, row: PurchaseRow) => sum + (row.Amount || 0), 0);
                    const baleteTotal = filteredPurchases.filter((row: PurchaseRow) => row.Branch === 'One Balete' && row.Category !== 'LessFee').reduce((sum: number, row: PurchaseRow) => sum + (row.Amount || 0), 0);
                    const mayonLessFee = filteredPurchases.filter((row: PurchaseRow) => row.Branch === 'Mayon' && row.Category === 'LessFee').reduce((sum: number, row: PurchaseRow) => sum + (row.Amount || 0), 0);
                    const baleteLessFee = filteredPurchases.filter((row: PurchaseRow) => row.Branch === 'One Balete' && row.Category === 'LessFee').reduce((sum: number, row: PurchaseRow) => sum + (row.Amount || 0), 0);
                    return (
                      <>
                        <tr className="bg-[#f0f8f0] font-bold" style={{ borderTop: '4px solid #2d3a2e' }}>
                          <td className="px-6 py-4 text-left text-[#4A6741]" style={{ fontSize: '1rem' }}>Total</td>
                          <td className="px-10 py-4 text-right text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>
                            ₱{Number(mayonTotal).toLocaleString()}
                          </td>
                          <td className="px-10 py-4 text-right text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>
                            ₱{Number(baleteTotal).toLocaleString()}
                          </td>
                        </tr>
                        {(mayonLessFee !== 0 || baleteLessFee !== 0) && (
                          <tr className="bg-[#f8e6e6] font-bold">
                            <td className="px-6 py-4 text-left text-[#a94442]" style={{ fontSize: '1rem' }}>LessFee</td>
                            <td className="px-10 py-4 text-right text-[#a94442]" style={{ fontSize: '1rem', minWidth: '160px' }}>
                              {mayonLessFee === 0 ? '-' : `₱${Number(mayonLessFee).toLocaleString()}`}
                            </td>
                            <td className="px-10 py-4 text-right text-[#a94442]" style={{ fontSize: '1rem', minWidth: '160px' }}>
                              {baleteLessFee === 0 ? '-' : `₱${Number(baleteLessFee).toLocaleString()}`}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          {/* Transfers Summary Table */}
          <div className="flex-1 bg-white/95 rounded-2xl shadow-lg border border-[#e5e7eb] p-10" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 500, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)' }}>
            <h2 className="text-2xl font-bold text-[#006400] mb-8 text-center tracking-tight flex items-center justify-center gap-2" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 700 }}>
              <span style={{ fontSize: '1.7rem' }}>🔄</span> Transfers Summary
            </h2>
            <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden" style={{ borderCollapse: 'collapse', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '1.08rem', boxShadow: '0 2px 12px rgba(156,175,136,0.08)', border: '4px solid #2d3a2e' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
                  <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em' }}>Department</th>
                  <th className="px-10 py-4 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em', minWidth: '160px' }}>Mayon</th>
                  <th className="px-10 py-4 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.04em', minWidth: '160px' }}>One Balete</th>
                </tr>
              </thead>
              <tbody>
                {defaultTransferDepts.map(dept => {
                  const mayonTotal = filteredTransfers.filter((row: any) => (transferDeptMap[row.Department] || row.Department) === dept && row.Branch === 'Mayon').reduce((sum: number, row: any) => sum + (Number(row.Amount) || 0), 0);
                  const baleteTotal = filteredTransfers.filter((row: any) => (transferDeptMap[row.Department] || row.Department) === dept && row.Branch === 'One Balete').reduce((sum: number, row: any) => sum + (Number(row.Amount) || 0), 0);
                  return (
                    <tr key={dept} className="hover:bg-[#f0f8f0] transition-colors" style={{ borderBottom: '2px solid #e5e7eb' }}>
                      <td className="px-6 py-4 text-left font-medium text-[#4A6741]" style={{ fontSize: '1rem' }}>{dept}</td>
                      <td className="px-10 py-4 text-right font-bold text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>{mayonTotal === 0 ? '-' : `₱${Number(mayonTotal).toLocaleString()}`}</td>
                      <td className="px-10 py-4 text-right font-bold text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>{baleteTotal === 0 ? '-' : `₱${Number(baleteTotal).toLocaleString()}`}</td>
                    </tr>
                  );
                })}
                {/* Total Row for Transfers */}
                <tr className="bg-[#f0f8f0] font-bold" style={{ borderTop: '4px solid #2d3a2e' }}>
                  <td className="px-6 py-4 text-left text-[#4A6741]" style={{ fontSize: '1rem' }}>Total</td>
                  <td className="px-10 py-4 text-right text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>
                    ₱{defaultTransferDepts.reduce((sum: number, dept: string) => {
                      return sum + filteredTransfers.filter((row: any) => (transferDeptMap[row.Department] || row.Department) === dept && row.Branch === 'Mayon').reduce((s: number, row: any) => s + (Number(row.Amount) || 0), 0);
                    }, 0).toLocaleString()}
                  </td>
                  <td className="px-10 py-4 text-right text-[#006400]" style={{ fontSize: '1rem', minWidth: '160px' }}>
                    ₱{defaultTransferDepts.reduce((sum: number, dept: string) => {
                      return sum + filteredTransfers.filter((row: any) => (transferDeptMap[row.Department] || row.Department) === dept && row.Branch === 'One Balete').reduce((s: number, row: any) => s + (Number(row.Amount) || 0), 0);
                    }, 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
                  {/* Top 10 Forms Section (Styled like summary above) */}
                  <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-2xl border border-[#b5c9a3] p-16 mb-10 mt-2">
                    <div className="w-full flex flex-col md:flex-row gap-12 justify-center items-start">
                      {/* Mayon Form */}
                      <div className="flex-1 min-w-[320px] max-w-md bg-white/95 rounded-2xl shadow-lg border border-[#2d3a2e] p-6 flex flex-col gap-8" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 500 }}>
                        <h2 className="text-2xl font-extrabold text-[#2d3a2e] text-center mb-4 tracking-tight" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 800 }}>Mayon Form</h2>
                        <div className="grid grid-cols-1 gap-6">
                          {/* Top 10 Highest Purchase Table */}
                          <div>
                            <h3 className="text-xl font-bold text-[#006400] mb-2 text-center">Top 10 Highest Purchase</h3>
                            <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden" style={{ borderCollapse: 'collapse', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '0.95rem', border: '3px solid #2d3a2e' }}>
                              <thead>
                                <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
                                  <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Item</th>
                                  <th className="px-4 py-2 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getTopItems(filteredPurchases, 'Mayon').map((row, idx) => (
                                  <tr key={idx} className="hover:bg-[#f0f8f0] transition-colors" style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <td className="px-4 py-2 text-left text-[#4A6741] font-medium">{row.item}</td>
                                    <td className="px-4 py-2 text-right text-[#006400] font-bold">₱{Number(row.amount).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* Top 10 Highest Transfer Table */}
                          <div>
                            <h3 className="text-xl font-bold text-[#006400] mb-2 text-center">Top 10 Highest Transfer</h3>
                            <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden" style={{ borderCollapse: 'collapse', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '0.95rem', border: '3px solid #2d3a2e' }}>
                              <thead>
                                <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
                                  <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Item</th>
                                  <th className="px-4 py-2 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getTopItems(filteredTransfers, 'Mayon').map((row, idx) => (
                                  <tr key={idx} className="hover:bg-[#f0f8f0] transition-colors" style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <td className="px-4 py-2 text-left text-[#4A6741] font-medium">{row.item}</td>
                                    <td className="px-4 py-2 text-right text-[#006400] font-bold">₱{Number(row.amount).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      {/* One Balete Form */}
                      <div className="flex-1 min-w-[320px] max-w-md bg-white/95 rounded-2xl shadow-lg border border-[#2d3a2e] p-6 flex flex-col gap-8" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 500 }}>
                        <h2 className="text-2xl font-extrabold text-[#2d3a2e] text-center mb-4 tracking-tight" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontWeight: 800 }}>One Balete Form</h2>
                        <div className="grid grid-cols-1 gap-6">
                          {/* Top 10 Highest Purchase Table */}
                          <div>
                            <h3 className="text-xl font-bold text-[#006400] mb-2 text-center">Top 10 Highest Purchase</h3>
                            <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden" style={{ borderCollapse: 'collapse', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '0.95rem', border: '3px solid #2d3a2e' }}>
                              <thead>
                                <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
                                  <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Item</th>
                                  <th className="px-4 py-2 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getTopItems(filteredPurchases, 'One Balete').map((row, idx) => (
                                  <tr key={idx} className="hover:bg-[#f0f8f0] transition-colors" style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <td className="px-4 py-2 text-left text-[#4A6741] font-medium">{row.item}</td>
                                    <td className="px-4 py-2 text-right text-[#006400] font-bold">₱{Number(row.amount).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* Top 10 Highest Transfer Table */}
                          <div>
                            <h3 className="text-xl font-bold text-[#006400] mb-2 text-center">Top 10 Highest Transfer</h3>
                            <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden" style={{ borderCollapse: 'collapse', fontFamily: 'Inter, Arial, Helvetica, sans-serif', fontSize: '0.95rem', border: '3px solid #2d3a2e' }}>
                              <thead>
                                <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
                                  <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Item</th>
                                  <th className="px-4 py-2 text-right font-bold text-white uppercase tracking-wide" style={{ fontWeight: 700 }}>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {getTopItems(filteredTransfers, 'One Balete').map((row, idx) => (
                                  <tr key={idx} className="hover:bg-[#f0f8f0] transition-colors" style={{ borderBottom: '2px solid #e5e7eb' }}>
                                    <td className="px-4 py-2 text-left text-[#4A6741] font-medium">{row.item}</td>
                                    <td className="px-4 py-2 text-right text-[#006400] font-bold">₱{Number(row.amount).toLocaleString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    </div>
    </>
  );
}
