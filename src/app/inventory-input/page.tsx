"use client";

const handleBack = () => {
  window.location.href = '/maindashboard';
};

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type ItemType = {
  MID: number;
  Item: string;
  ItemDesc: string;
  Price?: number;
  CUOMQty?: number;
  Category?: string;
  Unit?: string;
  UInv?: string;
};

type TableRow = {
  item: string;
  pcsKg: string;
  grams: string;
  price: string;
  amount: string;
  category?: string;
  unit?: string;
  dateEncoded?: string;
  branch?: string;
  department?: string;
  group?: string;
};

// Helper to safely get localStorage value
function getLocalStorage(key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key) || '';
  }
  return '';
}

export default function InventoryInputPage() {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [cuomqty, setCuomqty] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const branch = searchParams.get('branch');
  const group = searchParams.get('group');
  const department = searchParams.get('department');
  // Use searchParams or localStorage to initialize countedBy and checkedBy
  const initialCountedBy = searchParams.get('countedBy') || getLocalStorage('countedBy');
  const initialCheckedBy = searchParams.get('checkedBy') || getLocalStorage('checkedBy');
  // Use searchParams or localStorage to initialize encodedBy
  const initialEncodedBy = searchParams.get('username') || getLocalStorage('encodedBy');
  const [items, setItems] = useState<ItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [pcsKg, setPcsKg] = useState('');
  const [grams, setGrams] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [encodedBy, setEncodedBy] = useState(initialEncodedBy);
  const [countedBy, setCountedBy] = useState(initialCountedBy);
  const [checkedBy, setCheckedBy] = useState(initialCheckedBy);
  const [showCountedCheckedModal, setShowCountedCheckedModal] = useState(false);
  const [modalCountedBy, setModalCountedBy] = useState('');
  const [modalCheckedBy, setModalCheckedBy] = useState('');
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCUOMQty, setNewItemCUOMQty] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemUInv, setNewItemUInv] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemError, setNewItemError] = useState("");
  // Set default dateEncoded to today's date in mm/dd/yyyy format
  const [dateEncoded, setDateEncoded] = useState(() => {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  // Auto-calculate amount when pcsKg or price changes
  useEffect(() => {
    // Auto-calculate grams if cuomqty is available
    if (cuomqty && pcsKg) {
      const pcs = parseFloat(pcsKg) || 0;
      const cuom = parseFloat(cuomqty) || 0;
      setGrams(String(pcs * cuom));
    }
    const pcs = parseFloat(pcsKg) || 0;
    const prc = parseFloat(price) || 0;
    if (prc === 0) {
      setAmount("0.00");
    } else {
      setAmount(pcs && prc ? String(pcs * prc) : "");
    }
  }, [pcsKg, price]);

  useEffect(() => {
    // Fetch ItemDesc values from the API route
    async function fetchItems() {
      const res = await fetch('/api/items');
      const itemsList = await res.json();
      setItems(itemsList);
    }
    fetchItems();
  }, []);

  // Add useEffect to fetch inventory records from backend
  useEffect(() => {
    async function fetchInventory() {
      const params = new URLSearchParams();
      if (branch) params.append('branch', branch);
      if (department) params.append('department', department);
      if (group) params.append('group', group);
      if (dateEncoded) params.append('dateEncoded', dateEncoded);
      const res = await fetch(`/api/inventory?${params.toString()}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setTableData(result.data);
      } else {
        setTableData([]);
      }
    }
    fetchInventory();
  }, [branch, department, group, dateEncoded]);

  // Remove modal trigger on item selection

  // Filter ItemDesc for autocomplete
  const filteredItems = items
    .filter((item: any) => (item.ItemDesc || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a: any, b: any) => (a.ItemDesc || '').localeCompare(b.ItemDesc || ''));

  const handleSave = async () => {
    if (!selectedItem || !pcsKg || !grams || !price || !amount) {
      setSaveStatus('Please fill in all required fields.');
      return;
    }
    setSaveStatus(null);
    try {
      if (editIndex !== null) {
        // Edit mode: update tableData at editIndex
        const updated = [...tableData];
        updated[editIndex] = {
          item: selectedItem,
          pcsKg,
          grams,
          price,
          amount,
          category: category || group || '',
          unit,
          dateEncoded,
          branch: branch ?? undefined,
          department: department ?? undefined,
          group: group ?? undefined,
        };
        setTableData(updated);
        setEditIndex(null);
        setSaveStatus('Updated successfully!');
      } else {
        // Add mode: send to backend and add to tableData
        const res = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item: selectedItem,
            pcsKg: parseFloat(pcsKg),
            grams: parseFloat(grams),
            price: parseFloat(price),
            amount: parseFloat(amount),
            category: category || group || '',
            department: department || '',
            group: group || '',
            branch: branch || '',
            unit,
            dateEncoded,
            encodedBy: encodedBy, // logged in username
            countedBy: countedBy, // from modal
            checkedBy: checkedBy, // from modal
            // createdAt is auto-generated by Prisma
          }),
        });
        const result = await res.json();
        if (result.success) {
          setTableData([
            ...tableData,
            {
              item: selectedItem,
              pcsKg,
              grams,
              price,
              amount,
              category: category || group || '',
              unit,
              dateEncoded,
            }
          ]);
          setSaveStatus('Saved successfully!');
        } else {
          setSaveStatus('Save failed: ' + (result.error || 'Unknown error'));
        }
      }
      setSelectedItem('');
      setPcsKg('');
      setGrams('');
      setPrice('');
      setAmount('');
      setSearch('');
      setCategory('');
      setUnit('');
      setEncodedBy('');
      setCountedBy('');
      setCheckedBy('');
      // REMOVE: setDateEncoded(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setSaveStatus('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Remove tableData filtering, show all fetched records
  const filteredRows = tableData;

  // Save countedBy and checkedBy to localStorage when they change
  useEffect(() => {
    localStorage.setItem('countedBy', countedBy);
  }, [countedBy]);
  useEffect(() => {
    localStorage.setItem('checkedBy', checkedBy);
  }, [checkedBy]);
  // Save encodedBy to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('encodedBy', encodedBy);
  }, [encodedBy]);
  // Persist EncodedBy, CountedBy, CheckedBy to localStorage on change
  useEffect(() => {
    if (encodedBy) localStorage.setItem('encodedBy', encodedBy);
  }, [encodedBy]);
  useEffect(() => {
    if (countedBy) localStorage.setItem('countedBy', countedBy);
  }, [countedBy]);
  useEffect(() => {
    if (checkedBy) localStorage.setItem('checkedBy', checkedBy);
  }, [checkedBy]);
  // On mount, initialize from localStorage if available
  useEffect(() => {
    const storedEncodedBy = localStorage.getItem('encodedBy');
    if (storedEncodedBy) setEncodedBy(storedEncodedBy);
    const storedCountedBy = localStorage.getItem('countedBy');
    if (storedCountedBy) setCountedBy(storedCountedBy);
    const storedCheckedBy = localStorage.getItem('checkedBy');
    if (storedCheckedBy) setCheckedBy(storedCheckedBy);
  }, []);

  // Add useEffect to always fetch inventory records after reset or filter change
  useEffect(() => {
    async function fetchInventory() {
      const params = new URLSearchParams();
      if (branch) params.append('branch', branch);
      if (department) params.append('department', department);
      if (group) params.append('group', group);
      if (dateEncoded) params.append('dateEncoded', dateEncoded);
      const res = await fetch(`/api/inventory?${params.toString()}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setTableData(result.data);
      } else {
        setTableData([]);
      }
    }
    fetchInventory();
  }, [branch, department, group, dateEncoded]);

  // Add print handler
  const handlePrint = () => {
  // Build query string with filters and always use latest countedBy/checkedBy
  const params = new URLSearchParams();
  if (branch) params.append('branch', branch);
  if (department) params.append('department', department);
  if (group) params.append('group', group);
  if (dateEncoded) params.append('dateEncoded', dateEncoded);
  // Use modal values if modal is open, else use state
  const counted = showCountedCheckedModal ? modalCountedBy : countedBy;
  const checked = showCountedCheckedModal ? modalCheckedBy : checkedBy;
  if (counted) params.append('countedBy', counted);
  if (checked) params.append('checkedBy', checked);
  router.push(`/inventory-print-summary?${params.toString()}`);
  };

  // Compute category summary for print
  const categorySummary: Record<string, number> = tableData.reduce((acc, row) => {
    const cat = row.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + (parseFloat(row.amount) || 0);
    return acc;
  }, {} as Record<string, number>);
  const categories = Object.keys(categorySummary);

  // Add useEffect to set dateEncoded to today's date when page loads or when modal closes
  useEffect(() => {
    if (!showCountedCheckedModal) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDateEncoded(`${yyyy}-${mm}-${dd}`);
    }
  }, [showCountedCheckedModal]);

  // Ensure dateEncoded is set to today's date if empty when modal closes
  useEffect(() => {
    if (!showCountedCheckedModal && (!dateEncoded || dateEncoded === '')) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDateEncoded(`${yyyy}-${mm}-${dd}`);
    }
  }, [showCountedCheckedModal, dateEncoded]);

  // Ensure dateEncoded is set to today's date on initial mount
  useEffect(() => {
    if (!dateEncoded || dateEncoded === '') {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDateEncoded(`${yyyy}-${mm}-${dd}`);
    }
  }, []);

  // New function to handle item selection from dropdown
  const handleDropdownSelect = (itemDesc: string) => {
    setEditIndex(null); // ensure new item
    setSelectedItem(itemDesc);
    setPcsKg('');
    setGrams('');
    // Optionally clear other fields if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-4 px-2 sm:px-8">
      {saveStatus && (
        <div className={`mb-2 text-center font-semibold ${typeof saveStatus === 'string' && saveStatus.startsWith('Saved') ? 'text-green-700' : 'text-red-600'}`}>{saveStatus}</div>
      )}
      {showCountedCheckedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            {/* X icon to close modal */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
              aria-label="Close"
              onClick={() => setShowCountedCheckedModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              &times;
            </button>
            {/* Back icon to go to previous modal (inventory selection modal) */}
            <button
              className="absolute top-3 left-3 text-gray-500 hover:text-green-700 text-2xl font-bold"
              aria-label="Back"
              onClick={() => {
                setShowCountedCheckedModal(false);
                // Optionally trigger showing inventory selection modal if you have a state for it
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              &#8592;
            </button>
            <h2 className="text-lg font-bold mb-4 text-green-900 text-center">Enter Counted By & Checked By</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-green-800">Counted By</label>
              <input
                type="text"
                className="border-2 border-gray-300 rounded-lg p-3 w-full"
                value={modalCountedBy}
                onChange={e => setModalCountedBy(e.target.value)}
                placeholder="Counted By"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-green-800">Checked By</label>
              <input
                type="text"
                className="border-2 border-gray-300 rounded-lg p-3 w-full"
                value={modalCheckedBy}
                onChange={e => setModalCheckedBy(e.target.value)}
                placeholder="Checked By"
              />
            </div>
            <button
              className="w-full bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-emerald-800 transition"
              onClick={() => {
                setCountedBy(modalCountedBy);
                setCheckedBy(modalCheckedBy);
                setShowCountedCheckedModal(false);
              }}
              disabled={!modalCountedBy || !modalCheckedBy}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      {/* New Item Modal */}
      {showNewItemModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
      {/* X icon to close modal */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
        aria-label="Close"
        onClick={() => setShowNewItemModal(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        &times;
      </button>
      <h2 className="text-lg font-bold mb-4 text-green-900 text-center">Add New Item</h2>
      <div className="mb-3">
        <label className="block mb-1 font-semibold text-green-900">Category</label>
        <select
          className="border-2 border-gray-300 rounded-lg p-2 w-full"
          value={newItemCategory}
          onChange={e => {
            const val = e.target.value;
            setNewItemCategory(val);
            // Auto-set UInv, CUOMQty, Unit based on category
            if (["Produce", "Poultry", "Meat", "Seafood"].includes(val)) {
              setNewItemUInv("KG");
              setNewItemCUOMQty("1000");
              setNewItemUnit("G");
            } else if (["Grocery", "Dairy"].includes(val)) {
              setNewItemUInv("pc");
              setNewItemCUOMQty("");
              setNewItemUnit("");
            } else {
              setNewItemUInv("");
              setNewItemCUOMQty("");
              setNewItemUnit("");
            }
          }}
        >
          <option value="">Select Category</option>
          <option value="DAIRY">DAIRY</option>
          <option value="GROCERY">GROCERY</option>
          <option value="MEAT">MEAT</option>
          <option value="POULTRY">POULTRY</option>
          <option value="PRODUCE">PRODUCE</option>
          <option value="SEAFOOD">SEAFOOD</option>
          <option value="WIP">WIP</option>
        </select>
      </div>
      {/* Item Name input below Category */}
      <div className="mb-3">
        <label className="block mb-1 font-semibold text-green-900">Item Name</label>
        <input type="text" className="border-2 border-gray-300 rounded-lg p-2 w-full" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Item Name" />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-semibold text-green-900">CUOMQty</label>
        <input type="number" className="border-2 border-gray-300 rounded-lg p-2 w-full" value={newItemCUOMQty} onChange={e => setNewItemCUOMQty(e.target.value)} placeholder="CUOMQty" />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-semibold text-green-900">Unit</label>
        <input type="text" className="border-2 border-gray-300 rounded-lg p-2 w-full" value={newItemUnit} onChange={e => setNewItemUnit(e.target.value)} placeholder="Unit" />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-semibold text-green-900">UInv</label>
        <input type="text" className="border-2 border-gray-300 rounded-lg p-2 w-full" value={newItemUInv} onChange={e => setNewItemUInv(e.target.value)} placeholder="UInv" />
      </div>
      {newItemError && (
        <div className="mb-2 text-center font-semibold" style={{ color: '#b91c1c', background: '#fff0f0', borderRadius: '6px', padding: '8px' }}>{newItemError}</div>
      )}
      <button
        className="w-full px-6 py-3 rounded-xl font-bold text-lg shadow-md transition"
        style={{ backgroundColor: '#4b6f44', color: 'white' }}
        onClick={() => {
          if (!newItemName || !newItemCUOMQty || !newItemUnit || !newItemUInv || !newItemCategory) {
            setNewItemError("All fields must be filled up.");
            return;
          }
          setNewItemError("");
          // Add new item to items list and select it
          const newItem = {
            MID: Date.now(),
            Item: newItemName, // required property
            ItemDesc: newItemName,
            CUOMQty: Number(newItemCUOMQty),
            Unit: newItemUnit,
            UInv: newItemUInv,
            Category: newItemCategory,
            Price: 0
          };
          setItems([...items, newItem]);
          setSelectedItem(newItemName);
          setCuomqty(newItemCUOMQty);
          setCategory(newItemCategory);
          setUnit(newItemUnit);
          setPrice("0");
          setShowNewItemModal(false);
        }}
        disabled={!newItemName}
      >
        OK
      </button>
    </div>
  </div>
)}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 relative flex flex-col">
        {/* Move ←Back button to the top above Inventory Entry */}
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={handleBack} style={{ fontSize: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            &larr; Back
          </button>
        </div>
        {/* Elegant header: Mayon - Bakery, RawMats below */}
        {(branch || department) && (
          <div className="w-full flex flex-col items-center justify-center mb-4">
            <div
              className="bg-emerald-900 text-white rounded-xl px-2 py-3 sm:px-8 text-2xl font-bold shadow-md flex flex-col items-center w-full max-w-4xl mx-auto"
              style={{ letterSpacing: '1px' }}
            >
              <span className="block text-xl sm:text-3xl text-center break-words w-full">
                {branch || ''}{branch && department ? ' - ' : ''}{department || ''}
              </span>
              {group && (
                <span className="block text-base sm:text-xl font-semibold text-emerald-200 mt-1 tracking-wide text-center break-words w-full">
                  {group}
                </span>
              )}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Inventory Entry</h2>
          <div>
            <label htmlFor="dateEncoded" style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>Date Encoded:</label>
            <input
              type="date"
              id="dateEncoded"
              name="dateEncoded"
              value={dateEncoded}
              onChange={e => setDateEncoded(e.target.value)}
              style={{ padding: '0.25rem', fontSize: '1rem' }}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-green-800">Item Name</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setSelectedItem('');
                setPrice('');
              }}
              placeholder="Search item..."
            />
            <button
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-emerald-800 transition"
              onClick={() => {
                setNewItemName("");
                setNewItemCUOMQty("");
                setNewItemUnit("");
                setNewItemUInv("");
                setNewItemCategory("");
                setNewItemError("");
                setShowNewItemModal(true);
              }}
              style={{ whiteSpace: 'nowrap', backgroundColor: '#88b04b' }} // Sage green
            >
              + Add New Item
            </button>
          </div>
          {search && !selectedItem && (
            <ul className="border-2 border-gray-200 bg-white max-h-40 overflow-y-auto mt-2 rounded-lg shadow-sm">
              {filteredItems.map(item => (
                <li
                  key={item.MID}
                  className="p-2 cursor-pointer hover:bg-green-100 transition"
                  onClick={() => {
                    setSelectedItem(item.ItemDesc);
                    setSearch(item.ItemDesc);
                    setPrice(item.Price !== undefined ? String(item.Price) : "");
                    setCuomqty(item.CUOMQty !== undefined ? String(item.CUOMQty) : "");
                    setCategory(item.Category !== undefined ? String(item.Category) : "");
                    setUnit(item.UInv !== undefined ? String(item.UInv) : "");
                    setPcsKg(""); // Clear PCS/KG box when item is selected
                  }}
                >
                  {item.ItemDesc} <span className="text-xs text-gray-500">({item.UInv || '-'})</span>
                </li>
              ))}
              {filteredItems.length === 0 && (
                <li className="p-2 text-gray-400">No items found</li>
              )}
            </ul>
          )}
          {selectedItem && (
            <div style={{ fontSize: 14, color: '#4A6741', marginTop: 8, marginBottom: 8 }}>
              Selected: <span style={{ fontWeight: 600 }}>{selectedItem}</span> &nbsp; | &nbsp; CUOMQty: <span style={{ fontWeight: 600 }}>{cuomqty || '0'}</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 font-semibold text-green-800">PCS/KG</label>
            <input
              type="number"
              inputMode="decimal"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
              value={pcsKg}
              onChange={e => {
                setPcsKg(e.target.value);
                // Always calculate grams as pcsKg * cuomqty
                const pcs = parseFloat(e.target.value) || 0;
                const cuom = parseFloat(cuomqty) || 0;
                setGrams(String(pcs * cuom));
              }}
              placeholder="PCS/KG"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-green-800">Grams</label>
            <input
              type="number"
              inputMode="decimal"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
              value={grams}
              onChange={e => {
                setGrams(e.target.value);
                // Auto-calculate PCS/KG when typing in grams
                const g = parseFloat(e.target.value) || 0;
                const cuom = parseFloat(cuomqty) || 0;
                setPcsKg(cuom ? String(g / cuom) : '');
              }}
              placeholder="Grams"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-green-800">Price</label>
            <input
              type="number"
              inputMode="decimal"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Price"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-green-800">Amount</label>
            <input
              type="text"
              inputMode="decimal"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
              value={amount && !isNaN(Number(amount)) ? Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
              readOnly
              placeholder="Amount"
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button
            className="w-full bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-md hover:bg-emerald-800 transition mb-6"
            onClick={handleSave}
          >
            Save Item
          </button>
        </div>
  {/* Reset status message removed */}
        <div className="mt-10">
          <h3 className="font-bold text-xl text-green-900 mb-4 text-center">Inventory List</h3>
          {/* Add Print button to UI, e.g. above or next to the table */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: '#2a4d4f', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: '6px', border: 'none', marginTop: '24px', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 2px 8px rgba(49,130,206,0.08)'
              }}
            >
              Print
            </button>
          </div>
          <div className="overflow-x-auto">
        {/* Show Delete Selected button above table for phone view when editing an item */}
        {editIndex !== null && (
          <div className="block sm:hidden mb-2">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={async () => {
                const row = tableData[editIndex];
                try {
                  const res = await fetch('/api/inventory', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      item: row.item,
                      dateEncoded: row.dateEncoded,
                      branch: row.branch,
                      department: row.department,
                      group: row.group
                    })
                  });
                  const result = await res.json();
                  if (!result.success) {
                    alert('Failed to delete record from database: ' + (result.error || 'Unknown error'));
                  }
                } catch (err) {
                  alert('Error deleting record from database: ' + (err instanceof Error ? err.message : String(err)));
                }
                // Remove from UI
                const updated = [...tableData];
                updated.splice(editIndex, 1);
                setTableData(updated);
                setEditIndex(null);
                setSelectedItem('');
                setPcsKg('');
                setGrams('');
                setPrice('');
                setAmount('');
                setCategory('');
                setUnit('');
                setCuomqty('');
              }}
            >Delete Selected</button>
          </div>
        )}
            <table className="w-full min-w-[400px] sm:min-w-0 border border-gray-300 rounded-lg text-sm sm:text-base">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-2 sm:p-3 border-b text-left sticky top-0 bg-green-100 z-10">Category</th>
                  <th className="p-2 sm:p-3 border-b text-left sticky top-0 bg-green-100 z-10">Item</th>
                  <th className="p-2 sm:p-3 border-b text-center sticky top-0 bg-green-100 z-10">Qty</th>
                  <th className="p-2 sm:p-3 border-b text-center sticky top-0 bg-green-100 z-10">Unit</th>
                  <th className="p-2 sm:p-3 border-b text-center sticky top-0 bg-green-100 z-10">Grams</th>
                  <th className="p-2 sm:p-3 border-b text-center sticky top-0 bg-green-100 z-10">Price</th>
                  <th className="p-2 sm:p-3 border-b text-right sticky top-0 bg-green-100 z-10">Amount</th>
                  {/* Only show Delete column in desktop view */}
                  <th className="p-2 sm:p-3 border-b text-center hidden sm:table-cell sticky top-0 bg-green-100 z-10">Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-green-50 cursor-pointer"
                    onClick={() => {
                      setEditIndex(idx);
                      setSelectedItem(row.item);
                      setPcsKg(row.pcsKg);
                      setGrams(row.grams);
                      setPrice(row.price);
                      setAmount(row.amount);
                      setCategory(row.category || '');
                      setUnit(row.unit || '');
                      // Fetch CUOMQty from items list
                      const matchedItem = items.find(i => i.ItemDesc === row.item);
                      setCuomqty(matchedItem && matchedItem.CUOMQty !== undefined ? String(matchedItem.CUOMQty) : '');
                    }}
                  >
                    <td className="border border-gray-300 p-3">{row.category || '-'}</td>
                    <td className="border border-gray-300 p-3">{row.item}</td>
                    <td className="border border-gray-300 p-3 text-center">{row.pcsKg}</td>
                    <td className="border border-gray-300 p-3 text-center">{row.unit || '-'}</td>
                    <td className="border border-gray-300 p-3 text-center">{row.grams ? Number(row.grams).toLocaleString() : ''}</td>
                    <td className="border border-gray-300 p-3 text-center">{row.price}</td>
                    <td className="border border-gray-300 p-3 text-right">
                      {Number(row.price) === 0 ? "0.00" : (row.amount ? Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00')}
                    </td>
                    {/* Only show Delete cell in desktop view */}
                    <td className="border border-gray-300 p-3 text-center hidden sm:table-cell">
                      <span className="hidden sm:inline">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                          onClick={async e => {
                            e.stopPropagation();
                            // Attempt to delete from backend via API
                            try {
                              const res = await fetch('/api/inventory', {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  item: row.item,
                                  dateEncoded: row.dateEncoded,
                                  branch: row.branch,
                                  department: row.department,
                                  group: row.group
                                })
                              });
                              const result = await res.json();
                              if (!result.success) {
                                alert('Failed to delete record from database: ' + (result.error || 'Unknown error'));
                              }
                            } catch (err) {
                              alert('Error deleting record from database: ' + (err instanceof Error ? err.message : String(err)));
                            }
                            // Remove from UI
                            const updated = [...tableData];
                            updated.splice(idx, 1);
                            setTableData(updated);
                          }}
                        >Delete</button>
                      </span>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border border-gray-300 p-3 text-center text-gray-400 sm:col-span-8">No data yet</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-green-100 font-bold">
                  <td className="border border-gray-300 p-3 text-right" colSpan={5}></td>
                  <td className="border border-gray-300 p-3 text-right">Total Amount:</td>
                  <td className="border border-gray-300 p-3 text-right">
                    {tableData.length > 0
                      ? tableData.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : '0.00'}
                  </td>
                  {/* Only show extra cell for desktop view */}
                  <td className="border border-gray-300 p-3 text-center hidden sm:table-cell"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
