"use client";

// Format date as 'MMMM/dd/yyyy' for print
function formatDateLong(dateString: string) {
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}
import React, { useState, useEffect } from "react";
import { loadProductionData, ProductionItem } from "@/lib/production-api";

export default function DeliveryForm() {
  // Example default values; in a real app, get from router/query or context
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [fromBranch, setFromBranch] = useState("Mayon Branch");
  const [fromDept, setFromDept] = useState("Bakery");
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState("");
  const [toDept, setToDept] = useState("");
  type ItemRow = { item: string; qty: string; unit: string; price: string; amount: string };
  const [items, setItems] = useState<ItemRow[]>([
    { item: "", qty: "", unit: "", price: "", amount: "" },
  ]);

  // Load production data from database on mount or when date/branch/department changes
  useEffect(() => {
    setLoading(true);
    async function fetchProduction() {
      const result = await loadProductionData(date, fromBranch, fromDept);
      if (result.success && result.data) {
        let newItems: ItemRow[] = [];
        if (fromDept === "Cashier") {
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.production ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Bakery" && toDept === "Cashier" && to === "Mayon Branch") {
          // Show Bakery's cashier column as qty if To: is Cashier and To branch is Mayon Branch
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.cashier ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Bakery" && toDept === "Cashier" && to === "One Balete Branch") {
          // Show Bakery's oneBalete column as qty if To: is Cashier and To branch is One Balete Branch
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.oneBalete ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Bakery" && toDept === "Cashier") {
          // Show Bakery's used column as qty if To: is Cashier (other branches)
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.used ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Bakery" && toDept === "Mayon Branch Main Kitchen") {
          // Show Bakery's used column as qty if To: is Mayon Branch Main Kitchen
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.used ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (toDept === "1B" && to === "One Balete Branch") {
          // Show oneBalete column as qty if To: is 1B and To branch is One Balete Branch
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.oneBalete ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Bakery" && toDept === "One Balete Branch Bar") {
          // Show Bakery's oneBalete column as qty if To: is One Balete Branch Bar
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.oneBalete ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Bakery" && toDept === "Mayon Branch Bar") {
          // Show Bakery's oneBalete column as qty if To: is Mayon Branch Bar
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.oneBalete ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Commissary" && toDept === "Main Kitchen" && to === "Mayon Branch") {
          // Show Commissary's kitchen column as qty if To: is Main Kitchen and To branch is Mayon Branch
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.kitchen ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else if (fromDept === "Commissary" && toDept === "Main Kitchen") {
          // Show Commissary's kitchen column as qty if To: is Main Kitchen (other branches)
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: String(prod.kitchen ?? ""),
            unit: "",
            price: "",
            amount: ""
          }));
        } else {
          newItems = result.data.data.map((prod: ProductionItem) => ({
            item: prod.item,
            qty: "",
            unit: "",
            price: "",
            amount: ""
          }));
        }
        setItems(newItems.length > 0 ? newItems : [{ item: "", qty: "", unit: "", price: "", amount: "" }]);
      } else {
        setItems([{ item: "", qty: "", unit: "", price: "", amount: "" }]);
      }
      setLoading(false);
    }
    fetchProduction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, fromBranch, fromDept, toDept]);
  const [releasedBy, setReleasedBy] = useState("");
  const [encodedBy, setEncodedBy] = useState("");
  const [receivedBy, setReceivedBy] = useState("");

  const handleItemChange = (idx: number, field: keyof ItemRow, value: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      // Auto-calc amount if qty and price are numbers
      if ((field === "qty" || field === "price") && updated[idx].qty && updated[idx].price) {
        const qty = parseFloat(updated[idx].qty);
        const price = parseFloat(updated[idx].price);
        if (!isNaN(qty) && !isNaN(price)) {
          updated[idx].amount = (qty * price).toFixed(2);
        } else {
          updated[idx].amount = "";
        }
      }
      return updated;
    });
  };

  const addRow = () => setItems([...items, { item: "", qty: "", unit: "", price: "", amount: "" }]);
  const removeRow = (idx: number) => setItems(items.length > 1 ? items.filter((_, i) => i !== idx) : items);

  const handlePrint = () => window.print();
  return (
    <React.Fragment>
      <div style={{ minHeight: "100vh", background: "#f8fdf8", padding: 0, margin: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #0001", padding: 32, paddingTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button onClick={handlePrint} style={{ background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0002', transition: 'background 0.2s' }}>Print</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: 15, color: '#4A6741', fontWeight: 500 }}>
              <span style={{ fontWeight: 600, marginBottom: 4 }}>To</span>
              <span className="print-hide" style={{ display: 'block' }}>
                <select value={to} onChange={e => setTo(e.target.value)} style={{ border: '1px solid #9CAF88', borderRadius: 6, padding: '4px 10px', fontSize: 15, color: '#4A6741', minWidth: 160, marginBottom: 8 }}>
                  <option value="">Select Branch</option>
                  <option>Mayon Branch</option>
                  <option>One Balete Branch</option>
                </select>
                <select value={toDept} onChange={e => setToDept(e.target.value)} style={{ border: '1px solid #9CAF88', borderRadius: 6, padding: '4px 10px', fontSize: 15, color: '#4A6741', minWidth: 160 }}>
                  <option value="">Select Department</option>
                  <option>Bakery</option>
                  <option>Cashier</option>
                  <option>Main Kitchen</option>
                  <option>Commissary</option>
                  <option>Bar</option>
                  <option>1B</option>
                </select>
              </span>
              <span className="print-only" style={{ display: 'none', fontSize: 15, color: '#4A6741', fontWeight: 500 }}>
                {to ? to.replace(' Branch', '') : '-'} {toDept ? `(${toDept})` : ''}
              </span>
            </div>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, color: '#4A6741', fontWeight: 500, marginBottom: 2 }}>Production Items</span>
                    <h1 style={{ fontSize: 24, color: '#006400', fontWeight: 700, textAlign: 'center', margin: 0, letterSpacing: 1 }}>Esmeralda - Delivery Form</h1>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 0 }}>
                      <span className="print-hide">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ border: '1px solid #9CAF88', borderRadius: 6, padding: '4px 10px', fontSize: 15, color: '#4A6741' }} />
                      </span>
                      <span className="print-only" style={{ display: 'none', fontSize: 15, color: '#4A6741', fontWeight: 500 }}>{formatDateLong(date)}</span>
                    </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: 15, color: '#4A6741', fontWeight: 500, marginLeft: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: 600, marginBottom: 4 }}>From</span>
                <span className="print-hide" style={{ display: 'block' }}>
                  <select value={fromBranch} onChange={e => setFromBranch(e.target.value)} style={{ border: '1px solid #9CAF88', borderRadius: 6, padding: '4px 10px', fontSize: 15, color: '#4A6741', marginBottom: 8, minWidth: 160, textAlign: 'right' }}>
                    <option>Mayon Branch</option>
                    <option>One Balete Branch</option>
                  </select>
                  <select value={fromDept} onChange={e => setFromDept(e.target.value)} style={{ border: '1px solid #9CAF88', borderRadius: 6, padding: '4px 10px', fontSize: 15, color: '#4A6741', minWidth: 160, textAlign: 'right' }}>
                    <option>Bakery</option>
                    <option>Cashier</option>
                    <option>Main Kitchen</option>
                    <option>Commissary</option>
                    <option>Bar</option>
                  </select>
                </span>
                <span className="print-only" style={{ display: 'none', fontSize: 15, color: '#4A6741', fontWeight: 500 }}>
                  {fromBranch ? fromBranch.replace(' Branch', '') : '-'} {fromDept ? `(${fromDept})` : ''}
                </span>
              </div>
            </div>
          </div>
          <div style={{ overflowX: "auto", marginBottom: 32 }}>
            
            {loading ? (
              <div style={{ textAlign: "center", color: "#4A6741", fontWeight: 500, padding: 24 }}>Loading data...</div>
            ) : (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, background: "#fff" }}>
                  <thead>
                    <tr style={{ background: "#f0f8f0" }}>
                      <th style={{ border: "1px solid #9CAF88", padding: 8 }}>Item</th>
                      <th style={{ border: "1px solid #9CAF88", padding: 8 }}>Qty</th>
                      <th style={{ border: "1px solid #9CAF88", padding: 8 }}>Unit</th>
                      <th style={{ border: "1px solid #9CAF88", padding: 8 }}>Price</th>
                      <th style={{ border: "1px solid #9CAF88", padding: 8 }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items
                      .filter(row => {
                        // Hide rows with zero or empty qty (for Cashier, qty is string of a number)
                        const qtyNum = parseFloat(row.qty);
                        return !isNaN(qtyNum) && qtyNum !== 0;
                      })
                      .map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ border: "1px solid #9CAF88", padding: 6 }}>
                            <input type="text" value={row.item} onChange={e => handleItemChange(idx, "item", e.target.value)} style={{ width: '40ch', minWidth: '40ch', maxWidth: '40ch', border: "none", outline: "none", background: "#f8fdf8", padding: 4 }} />
                          </td>
                            <td style={{ border: "1px solid #9CAF88", padding: 6, textAlign: 'center' }}>
                              <input type="text" value={row.qty} readOnly tabIndex={-1} style={{ width: '7.5ch', minWidth: '7.5ch', maxWidth: '7.5ch', border: "none", outline: "none", background: "#f8fdf8", padding: 4, textAlign: "center", fontVariantNumeric: 'tabular-nums', letterSpacing: '1px', fontSize: 15, pointerEvents: "none" }} />
                          </td>
                          <td style={{ border: "1px solid #9CAF88", padding: 6 }}>
                            <input type="text" value={row.unit} onChange={e => handleItemChange(idx, "unit", e.target.value)} style={{ width: 60, border: "none", outline: "none", background: "#f8fdf8", padding: 4 }} />
                          </td>
                          <td style={{ border: "1px solid #9CAF88", padding: 6 }}>
                            <input type="text" value={row.price} onChange={e => handleItemChange(idx, "price", e.target.value)} style={{ width: 80, border: "none", outline: "none", background: "#f8fdf8", padding: 4, textAlign: "right" }} />
                          </td>
                          <td style={{ border: "1px solid #9CAF88", padding: 6, background: "#f8fdf8" }}>
                            <input type="text" value={row.amount} readOnly style={{ width: 90, border: "none", outline: "none", background: "#f8fdf8", padding: 4, textAlign: "right", color: "#006400", fontWeight: 600 }} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

              </>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, fontSize: 15, color: "#4A6741", fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                Released By: <input type="text" value={releasedBy} onChange={e => setReleasedBy(e.target.value)} style={{ border: "1px solid #9CAF88", borderRadius: 6, padding: "4px 10px", fontSize: 15, color: "#4A6741", minWidth: 90, maxWidth: 120, width: '100%' }} />
              </div>
              <div style={{ flex: 1, fontSize: 15, color: "#4A6741", fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Encoded By: <input type="text" value={encodedBy} onChange={e => setEncodedBy(e.target.value)} style={{ border: "1px solid #9CAF88", borderRadius: 6, padding: "4px 10px", fontSize: 15, color: "#4A6741", minWidth: 90, maxWidth: 120, width: '100%' }} />
              </div>
              <div style={{ flex: 1, fontSize: 15, color: "#4A6741", fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                Received By: <input type="text" value={receivedBy} onChange={e => setReceivedBy(e.target.value)} style={{ border: "1px solid #9CAF88", borderRadius: 6, padding: "4px 10px", fontSize: 15, color: "#4A6741", minWidth: 90, maxWidth: 120, width: '100%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media print {
          @page {
            size: legal portrait;
          }
          body, #print-summary {
            zoom: 0.8;
          }
          button { display: none !important; }
        }
      `}</style>
    </React.Fragment>
  );
}
