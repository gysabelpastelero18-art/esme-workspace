"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Link from "next/link";

// Replace button with Next.js Link for navigation
const HomeButton = () => (
  <Link href="/" className="mb-4 flex items-center text-green-700 hover:text-green-900 font-semibold" aria-label="Go to Main Dashboard">
    <span className="material-icons mr-2" style={{ fontSize: '22px' }}>home</span>
    Home
  </Link>
);

// Columns for NonFoodItems
const columns = [
  "NFID", "Group", "GCode", "Category", "CCode", "SubCategory", "SCCode", "Brand", "Item", "Supplier", "Price", "Barcode", "BIRGroup", "Size", "Model", "Serial", "EncodeDate", "EncodedBy", "PCSPerPack", "PricePc", "Unit", "SUInv", "UInv"
];

export default function ItemsPage() {
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to delete all NonFood items from the database?')) {
      setItems([]);
      await fetch('/api/nonfooditems', {
        method: 'DELETE',
      });
      setError('All NonFood items have been deleted.');
    }
  };
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Fetch item price from database by Item name
  const fetchItemPrice = async (itemName: string) => {
    setLoadingPrice(true);
    try {
      const res = await fetch(`/api/items?item=${encodeURIComponent(itemName)}`);
      const data = await res.json();
      if (data && data.price !== undefined) {
        setSelectedItem((prev: any) => ({ ...prev, Price: data.price }));
      }
    } catch (err) {
      setError('Failed to fetch item price from database.');
    } finally {
      setLoadingPrice(false);
    }
  };
  // Fetch NonFoodItems from database by search
  useEffect(() => {
    const url = search
      ? `/api/nonfooditems?search=${encodeURIComponent(search)}`
      : '/api/nonfooditems';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItems(data);
      })
      .catch(() => setItems([]));
  }, [search]);

  // Import Excel and filter out duplicates by Item name
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const imported = XLSX.utils.sheet_to_json(sheet);
      // Convert Excel serial dates in MDate to mm/dd/yyyy
      const fixDate = (val: any) => {
        if (typeof val === 'number') {
          // Excel serial date to JS date
          const d = new Date(Math.round((val - 25569) * 86400 * 1000));
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const yyyy = d.getFullYear();
          return `${mm}/${dd}/${yyyy}`;
        }
        return val;
      };
        const cleaned = imported.map((row: any) => {
          return {
            NFID: row.NFID,
            Group: row.Group,
            GCode: row.GCode,
            Category: row.Category,
            CCode: row.CCode,
            SubCategory: row.SubCategory,
            SCCode: row.SCCode,
            Brand: row.Brand,
            Item: row.Item,
            Supplier: row.Supplier,
            Price: row.Price ? Number(row.Price) : null,
            Barcode: row.Barcode,
            BIRGroup: row.BIRGroup,
            Size: row.Size,
            Model: row.Model,
            Serial: row.Serial,
            EncodeDate: row.EncodeDate ? new Date(row.EncodeDate) : null,
            EncodedBy: row.EncodedBy,
            PCSPerPack: row.PCSPerPack ? Number(row.PCSPerPack) : null,
            PricePc: row.PricePc ? Number(row.PricePc) : null,
            Unit: row.Unit,
            SUInv: row.SUInv,
            UInv: row.UInv,
          };
        });
      // Import all rows, including those with blank ItemDesc, and keep duplicates
      setError("");
      const res = await fetch('/api/nonfooditems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleaned)
      });
      const result = await res.json();
      if (result.success) {
        setError('Successfully imported items to database.');
        // Reload items from NonFoodItem table via Prisma
        fetch('/api/nonfooditems')
          .then(res => res.json())
          .then(data => setItems(data))
          .catch(() => setItems([]));
      } else {
        setError('Error importing items: ' + (result.error || JSON.stringify(result.errorLog)));
      }
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-2">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-green-900 text-xl mr-4">NonFood</span>
        </div>
        <div className="flex items-center mb-4 justify-between">
          <h1 className="text-2xl font-extrabold text-green-900 mb-0">Items Database</h1>
          <button
            onClick={() => window.location.href = '/maindashboard'}
            title="Go to Main Dashboard"
            className="flex items-center bg-[#A7BCA1] border-2 border-[#4A6741] rounded-lg px-3 py-2 shadow hover:bg-[#8AA88A] transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#4A6741" viewBox="0 0 24 24" className="mr-2">
              <path d="M3 11.5V21a1 1 0 0 0 1 1h5v-6h6v6h5a1 1 0 0 0 1-1v-9.5a1 1 0 0 0-.293-.707l-9-9a1 1 0 0 0-1.414 0l-9 9A1 1 0 0 0 3 11.5z"/>
            </svg>
            <span className="text-[#4A6741] font-semibold text-lg">Home</span>
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-center">
          <label className="font-semibold text-green-700">Import Excel:</label>
          <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="border rounded px-2 py-1" />
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold"
              onClick={handleReset}
            >Reset Items</button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-center">
          {!selectedItem ? (
            <div className="w-full max-w-xs relative">
              <input
                type="text"
                placeholder="Search item..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              />
              {search ? (
                <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto z-10">
                  {items.filter(row => row.ItemDesc && row.ItemDesc.toLowerCase().includes(search.toLowerCase())).length > 0
                    ? items.filter(row => row.ItemDesc && row.ItemDesc.toLowerCase().includes(search.toLowerCase())).map((row, idx) => {
                        console.log('Rendering ItemDesc:', row.ItemDesc);
                        return (
                          <li
                            key={idx}
                            className="px-3 py-2 cursor-pointer hover:bg-green-100"
                            onClick={async () => {
                              setSelectedItem({ ...row, Item: row.ItemDesc });
                              setSearch("");
                              const res = await fetch(`/api/items?itemdesc=${encodeURIComponent(row.ItemDesc)}`);
                              const data = await res.json();
                              setSelectedItem((prev: any) => ({ ...prev, Price: data.price }));
                            }}
                          >
                            {row.ItemDesc}
                          </li>
                        );
                      })
                    : <li className="px-3 py-2 text-gray-400">No items found</li>
                  }
                </ul>
              ) : null}
            </div>
          ) : (
            <>
              <div className="font-semibold text-green-700">Selected Item: {selectedItem.ItemDesc}</div>
              <input
                type="number"
                value={selectedItem.Price !== undefined && selectedItem.Price !== null ? selectedItem.Price : ''}
                onChange={e => {
                  const price = e.target.value;
                  setSelectedItem({ ...selectedItem, Price: price });
                }}
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs no-spinner"
                placeholder={loadingPrice ? "Loading price..." : "Price"}
                style={{ MozAppearance: 'textfield' }}
                disabled={loadingPrice}
              />
              <input
                type="number"
                value={selectedItem.UOMQty !== undefined && selectedItem.UOMQty !== null ? selectedItem.UOMQty : ''}
                onChange={e => {
                  const qty = e.target.value;
                  setSelectedItem({ ...selectedItem, UOMQty: qty });
                }}
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs no-spinner"
                placeholder="pcs/kg"
                style={{ MozAppearance: 'textfield' }}
              />
              <input
                type="number"
                value={(() => {
                  const price = parseFloat(selectedItem.Price) || 0;
                  const qty = parseFloat(selectedItem.UOMQty) || 0;
                  return price * qty;
                })()}
                readOnly
                className="border border-gray-300 rounded px-3 py-2 w-full max-w-xs no-spinner"
                placeholder="Amount (pcs/kg * price)"
                style={{ MozAppearance: 'textfield' }}
              />
      <style jsx>{`
        input[type=number].no-spinner::-webkit-inner-spin-button,
        input[type=number].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number].no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
              <button
                className="ml-2 px-3 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300"
                onClick={() => setSelectedItem(null)}
              >Change Item</button>
            </>
          )}
        </div>
        {selectedItem && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-green-800 mb-2 text-center">Item Details</h2>
            <table className="mx-auto border border-gray-300 rounded-xl overflow-hidden shadow-sm text-sm">
              <thead>
                <tr className="bg-green-50 text-green-900">
                  <th className="border border-gray-300 p-3">Supplier</th>
                  <th className="border border-gray-300 p-3">Category</th>
                  <th className="border border-gray-300 p-3">ItemDesc</th>
                  <th className="border border-gray-300 p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">{selectedItem.Supplier ?? ""}</td>
                  <td className="border border-gray-300 p-3">{selectedItem.Category ?? ""}</td>
                  <td className="border border-gray-300 p-3">{selectedItem.ItemDesc ?? ""}</td>
                  <td className="border border-gray-300 p-3">{selectedItem.Price ?? ""}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {!selectedItem && (
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border border-gray-300 rounded-xl overflow-hidden shadow-sm text-xs sm:text-sm">
              <thead>
                <tr className="bg-green-50 text-green-900">
                  {columns.map((col) => (
                    <th key={col} className="border border-gray-300 p-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="border border-gray-300 p-3 text-center text-gray-400">No items imported yet</td>
                  </tr>
                )}
                {items
                  .filter(row => {
                    if (!search) return true;
                    const searchLower = search.toLowerCase();
                    return (
                      (row.Item && row.Item.toLowerCase().includes(searchLower)) ||
                      (row.Brand && row.Brand.toLowerCase().includes(searchLower)) ||
                      (row.Category && row.Category.toLowerCase().includes(searchLower)) ||
                      (row.Supplier && row.Supplier.toLowerCase().includes(searchLower)) ||
                      (row.Barcode && row.Barcode.toLowerCase().includes(searchLower))
                    );
                  })
                  .map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-green-50 cursor-pointer"
                      onClick={() => setSelectedItem({ ...row, Item: row.ItemDesc })}
                    >
                      {columns.map((col) => {
                        let value = row[col] ?? "";
                        if (col === "MDate" && value) {
                          let d = new Date(value);
                          if (!isNaN(d.getTime())) {
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            const dd = String(d.getDate()).padStart(2, '0');
                            const yyyy = d.getFullYear();
                            value = `${mm}/${dd}/${yyyy}`;
                          } else if (typeof value === 'string' && value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                            value = value;
                          }
                        }
                        return <td key={col} className="border border-gray-300 p-3">{value}</td>;
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
