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
  location?: string;
};

// Helper to safely get localStorage value
function getLocalStorage(key: string) {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key) || '';
  }
  return '';
}

// Convert mm/dd/yyyy to ISO string before saving
function mmddyyyyToISO(dateStr: string) {
  // Accept both mm/dd/yyyy and yyyy-mm-dd formats
  if (dateStr.includes('/')) {
    const [mm, dd, yyyy] = dateStr.split('/');
    return new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`).toISOString();
  } else if (dateStr.includes('-')) {
    // yyyy-mm-dd from <input type="date">
    return new Date(`${dateStr}T00:00:00.000Z`).toISOString();
  }
  return '';
}

export default function InventoryInputPage() {
  // Edit handler: populate fields for selected row
  const handleEdit = (row: TableRow, index: number) => {
    setEditIndex(index);
    setSelectedItem(row.item);
    setPcsKg(row.pcsKg);
    setGrams(row.grams);
    setPrice(row.price);
    setAmount(row.amount);
    setCategory(row.category || '');
    setUnit(row.unit || '');
    // Optionally set dateEncoded, branch, department, group, location if needed
  };

  // When user selects from dropdown, always clear editIndex so it saves as new item
  const handleDropdownSelect = (itemDesc: string) => {
    setEditIndex(null); // ensure new item
    setSelectedItem(itemDesc);
    setPcsKg(''); // clear PCS/KG
    setGrams(''); // clear Grams
    // Optionally clear other fields if needed
  };

  // Delete handler: remove from WarehouseInv via API and refetch
  const handleDelete = async (row: TableRow) => {
    if (!row || !row.item || !row.dateEncoded) return;
    try {
      const res = await fetch('/api/warehouseInv', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: row.item,
          dateEncoded: row.dateEncoded,
          group: row.group,
          branch: row.branch,
          department: row.department,
        }),
      });
      const result = await res.json();
      if (result.success) {
        // Refetch table data
        const params = new URLSearchParams();
        if (branch) params.append('branch', branch);
        if (department) params.append('department', department);
        if (group) params.append('group', group);
        if (dateEncoded) params.append('dateEncoded', dateEncoded);
        const fetchRes = await fetch(`/api/warehouseInv?${params.toString()}`);
        const fetchResult = await fetchRes.json();
        if (fetchResult.success && Array.isArray(fetchResult.data)) {
          setTableData(fetchResult.data);
        } else {
          setTableData([]);
        }
      }
    } catch (err) {
      setSaveStatus('Delete failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [cuomqty, setCuomqty] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const branch = searchParams.get('branch');
  const group = 'NonFood'; // Replace all instances of 'RawMats' with 'NonFood' for group
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
  const [dateEncoded, setDateEncoded] = useState(() => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [uInv, setUInv] = useState(""); // Add state for UInv to fix undefined variable error in warehouse-nonfood page

  // New item modal states
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCUOMQty, setNewItemCUOMQty] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemUInv, setNewItemUInv] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemError, setNewItemError] = useState("");

  // Auto-calculate amount when pcsKg or price changes
  useEffect(() => {
    const pcs = parseFloat(pcsKg) || 0;
    const prc = parseFloat(price) || 0;
    if (prc === 0) {
      setAmount("0.00");
    } else {
      setAmount(pcs && prc ? String(pcs * prc) : "");
    }
  }, [pcsKg, price]);

  useEffect(() => {
    // Fetch NonFoodItem values from the API route
    async function fetchItems() {
      const res = await fetch('/api/nonfooditems');
      const itemsList = await res.json();
      setItems(itemsList);
    }
    fetchItems();
  }, []);

  // Add useEffect to fetch inventory records from backend
  useEffect(() => {
    async function fetchInventory() {
      // Only fetch if both dateEncoded and group are set
      if (!dateEncoded || !group) {
        setTableData([]);
        return;
      }
      const params = new URLSearchParams();
      if (branch) params.append('branch', branch);
      if (department) params.append('department', department);
      params.append('group', group);
      params.append('dateEncoded', dateEncoded);
      const res = await fetch(`/api/warehouseInv?${params.toString()}`);
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
    .filter((item: any) => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        (item.Item && item.Item.toLowerCase().includes(searchLower)) ||
        (item.Brand && item.Brand.toLowerCase().includes(searchLower)) ||
        (item.Category && item.Category.toLowerCase().includes(searchLower)) ||
        (item.Supplier && item.Supplier.toLowerCase().includes(searchLower)) ||
        (item.Barcode && item.Barcode.toLowerCase().includes(searchLower))
      );
    })
  .sort((a: any, b: any) => (a.Item || '').localeCompare(b.Item || ''))
  .sort((a: any, b: any) => (a.Item || '').localeCompare(b.Item || ''));

  const handleSave = async () => {
  const locationValue = '--';
    if (!selectedItem || !pcsKg || !grams || !price || !amount) {
      setSaveStatus('Please fill in all required fields.');
      return;
    }
    setSaveStatus(null);
    try {
      // Always default department and branch if not set
      const departmentValue = department || 'Warehouse';
      const branchValue = branch || 'Mayon';
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
          branch: branchValue,
          department: departmentValue,
          group: group ?? undefined,
          location: locationValue,
        };
        setTableData(updated);
        setEditIndex(null);
        setSaveStatus('Updated successfully!');
      } else {
        // Add mode: send to backend and refetch from WarehouseInv
        const res = await fetch('/api/warehouseInv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item: selectedItem,
            pcsKg: parseFloat(pcsKg),
            grams: parseFloat(grams),
            price: parseFloat(price),
            amount: parseFloat(amount),
            category: category || group || '',
            department: departmentValue,
            group: group || '',
            branch: branchValue,
            unit: uInv, // Use UInv input value for Unit
            location: locationValue,
            dateEncoded: mmddyyyyToISO(dateEncoded), // always send ISO string
            encodedBy: encodedBy, // logged in username
            countedBy: countedBy, // from modal
            checkedBy: checkedBy, // from modal
            // createdAt is auto-generated by Prisma
          }),
        });
        const result = await res.json();
        if (result.success) {
          // Refetch from WarehouseInv to get latest data
          const params = new URLSearchParams();
          if (branchValue) params.append('branch', branchValue);
          if (departmentValue) params.append('department', departmentValue);
          params.append('group', group || '');
          params.append('dateEncoded', dateEncoded);
          const fetchRes = await fetch(`/api/warehouseInv?${params.toString()}`);
          const fetchResult = await fetchRes.json();
          if (fetchResult.success && Array.isArray(fetchResult.data)) {
            setTableData(fetchResult.data);
          } else {
            setTableData([]);
          }
          setSaveStatus('Saved successfully!');
        } else {
          setSaveStatus('Save failed: ' + (result.error || 'Unknown error'));
        }
      }
      // After saving, reset fields but keep dateEncoded and user fields
      setSelectedItem('');
      setPcsKg('');
      setGrams('');
      setPrice('');
      setAmount('');
      setSearch('');
      setCategory('');
      setUnit('');
      // Do NOT reset encodedBy, countedBy, checkedBy, or dateEncoded here
      setEncodedBy(username || '');
      setCountedBy(username || '');
      setCheckedBy(username || '');
    } catch (err) {
      setSaveStatus('Save failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Filter table data by Date Encoded and Group only
  function isSameDate(rowDate: string | undefined, selectedDate: string) {
    if (!rowDate || !selectedDate) return false;
    // rowDate is ISO string, selectedDate is mm/dd/yyyy or yyyy-mm-dd
    const d = new Date(rowDate);
    let mm, dd, yyyy;
    if (selectedDate.includes('/')) {
      [mm, dd, yyyy] = selectedDate.split('/');
    } else if (selectedDate.includes('-')) {
      [yyyy, mm, dd] = selectedDate.split('-');
    }
    return (
      d.getFullYear() === Number(yyyy) &&
      d.getMonth() + 1 === Number(mm) &&
      d.getDate() === Number(dd)
    );
  }
  const filteredRows = tableData.filter(row => isSameDate(row.dateEncoded, dateEncoded) && row.group === group);

  // Calculate footer amount for only existing (visible) rows
  // Footer amount is sum of 'amount' from visible WarehouseInv rows
  const footerAmount = filteredRows.length === 0 ? 0.00 : filteredRows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

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

  // Add useEffect to always fetch inventory records after reset or filter change
  useEffect(() => {
    async function fetchInventory() {
      const params = new URLSearchParams();
      if (branch) params.append('branch', branch);
      if (department) params.append('department', department);
      if (group) params.append('group', group);
      if (dateEncoded) params.append('dateEncoded', dateEncoded);
  const res = await fetch(`/api/warehouseInv?${params.toString()}`);
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
  // Build query string with filters for /wh-print
  const params = new URLSearchParams();
  if (branch) params.append('branch', branch);
  if (department) params.append('department', department);
  if (group) params.append('group', group);
  if (dateEncoded) params.append('dateEncoded', dateEncoded);
  window.location.href = `/wh-printNF?${params.toString()}`;
  };

  // Compute category summary for print
  const categorySummary: Record<string, number> = tableData.reduce((acc, row) => {
    const cat = row.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + (parseFloat(row.amount) || 0);
    return acc;
  }, {} as Record<string, number>);
  const categories = Object.keys(categorySummary);

  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await fetch('/api/auth/session', { method: 'GET', credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUsername(data.user.username || '');
          }
        }
      } catch (error) {
        // fallback to localStorage if available
        const localUser = getLocalStorage('username');
        if (localUser) setUsername(localUser);
      }
    }
    fetchUsername();
  }, []);

  // Set default encodedBy, countedBy, checkedBy to username when it changes
  useEffect(() => {
    if (username) {
      setEncodedBy(username);
      setCountedBy(username);
      setCheckedBy(username);
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-4 px-2 sm:px-8">
      {saveStatus && (
        <div className={`mb-2 text-center font-semibold ${typeof saveStatus === 'string' && saveStatus.startsWith('Saved') ? 'text-green-700' : 'text-red-600'}`}>{saveStatus}</div>
      )}
      {showCountedCheckedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4 text-green-900">Enter Counted By & Checked By</h2>
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
      {newItemError && (
        <div className="mb-2 text-center font-semibold" style={{ color: '#b91c1c', background: '#fff0f0', borderRadius: '6px', padding: '8px' }}>{newItemError}</div>
      )}
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
        <input
          type="text"
          className="border-2 border-gray-300 rounded-lg p-2 w-full"
          value={newItemUInv}
          onChange={e => setNewItemUInv(e.target.value)}
          placeholder="UInv"
        />
      </div>
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
          setSearch(newItemName);
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
          <button onClick={() => window.location.href = '/maindashboard'} style={{ fontSize: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>
            &larr; Back
          </button>
        </div>
        {/* Presentable header for branch, group, department */}
        <div style={{
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#065f46', // emerald-900, same as Save Item button
  color: 'white',
  borderRadius: '1rem',
  padding: '1.2rem 2rem',
  marginBottom: '2rem',
  boxShadow: '0 2px 12px rgba(49,130,206,0.10)'
}}>
  <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>
    {`${branch || 'Mayon'} - ${department || 'Warehouse'}`}
  </div>
  <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
    {group || 'RawMats'}
  </div>
</div>
  {/* Removed duplicate header block for branch, group, department. Only the presentable header remains above. */}
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
              onChange={e => setSearch(e.target.value)}
              placeholder="Search item..."
            />
            <button
              className="px-4 py-2 rounded-lg font-bold shadow transition"
              style={{ whiteSpace: 'nowrap', backgroundColor: '#88b04b', color: 'white' }}
              onClick={() => setShowNewItemModal(true)}
            >
              + Add New Item
            </button>
          </div>
          {search && !selectedItem && (
            <ul className="border-2 border-gray-200 bg-white max-h-40 overflow-y-auto mt-2 rounded-lg shadow-sm">
              {filteredItems.map(item => (
                <li
                  key={item.Item + '-' + (item.UInv || '')}
                  className="p-2 cursor-pointer hover:bg-green-100 transition"
                  onClick={() => {
                    handleDropdownSelect(item.Item);
                    setSearch(item.Item);
                    setPrice(item.Price !== undefined ? String(item.Price) : "");
                    setCuomqty(item.CUOMQty !== undefined ? String(item.CUOMQty) : "");
                    setCategory(item.Category !== undefined ? String(item.Category) : "");
                    setUnit(item.Unit !== undefined ? String(item.Unit) : "");
                    setUInv(item.UInv !== undefined ? String(item.UInv) : "");
                    setPcsKg(""); // Clear PCS/KG box when item is selected
                  }}
                >
                  {item.Item} <span className="text-xs text-gray-500">({item.UInv || '-'})</span>
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
            <label className="block mb-2 font-semibold text-green-800">Qty</label>
            <input
              type="number"
              inputMode="decimal"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              style={{ MozAppearance: 'textfield' }}
              value={pcsKg}
              onChange={e => {
                setPcsKg(e.target.value);
                setGrams('0'); // Always set grams to zero when typing in PCS/KG
              }}
              placeholder="Qty"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-green-800">Unit</label>
            <input
              type="text"
              className="border-2 border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              value={uInv}
              onChange={e => setUInv(e.target.value)}
              placeholder="Unit"
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
              value={amount ? Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
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
          {/* Reset button removed */}
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
                await handleDelete(row);
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
                  <th className="p-2 sm:p-3 border-b text-left">Category</th>
                  <th className="p-2 sm:p-3 border-b text-left">Item</th>
                  <th className="p-2 sm:p-3 border-b text-center">Qty</th>
                  <th className="p-2 sm:p-3 border-b text-center">Unit</th>
                  {/* <th className="p-2 sm:p-3 border-b text-center">Grams</th> */}
                  <th className="p-2 sm:p-3 border-b text-center">Price</th>
                  <th className="p-2 sm:p-3 border-b text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-green-50 cursor-pointer`}
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
                    {/* <td className="border border-gray-300 p-2 text-center">{row.grams ? Number(row.grams).toLocaleString() : ''}</td> */}
                    <td className="border border-gray-300 p-3 text-center">{row.price}</td>
                    <td className="border border-gray-300 p-3 text-right">
                      {row.amount ? Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </td>
                    <td className="border border-gray-300 p-3 text-center hidden sm:table-cell">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(row);
                        }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border border-gray-300 p-3 text-center text-gray-400">No data yet</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-green-100">
                <tr>
                  <td className="p-2 sm:p-3 border-b text-left" colSpan={4}></td>
                  <td className="p-2 sm:p-3 border-b text-right font-bold text-green-800">Total Amount:</td>
                  <td className="p-2 sm:p-3 border-b text-right font-bold text-green-800">{filteredRows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
