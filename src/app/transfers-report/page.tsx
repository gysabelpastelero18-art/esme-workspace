"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TransfersReport() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [transferRows, setTransferRows] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  useEffect(() => {
    fetch("/api/transfers")
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data)) {
          setTransferRows(json.data);
        } else {
          setTransferRows([]);
        }
      });
  }, []);

  // Filter logic
  const filteredTransfers = transferRows.filter(row => {
    let rowDate: Date;
    if (typeof row.InvoiceDate === "string") {
      const parts = row.InvoiceDate.split("/");
      if (parts.length === 3) {
        rowDate = new Date(Number(parts[2]), Number(parts[0]) - 1, Number(parts[1]));
      } else {
        rowDate = new Date(row.InvoiceDate);
      }
    } else {
      rowDate = new Date(row.InvoiceDate);
    }
    if (startDate && rowDate < startDate) return false;
    if (endDate && rowDate > endDate) return false;
    if (selectedGroup && row.Group !== selectedGroup) return false;
    if (selectedBranch && row.Branch !== selectedBranch) return false;
    return true;
  });

  // Summary by group and branch
  function getSummary(branch: string) {
    const groups = ["RawMats", "Employees Meal", "NonFood"];
    return groups.map(group => {
      const total = filteredTransfers.filter(row => row.Group === group && row.Branch === branch)
        .reduce((sum, row) => sum + (Number(row.Amount) || 0), 0);
      return { group, total };
    });
  }

  // Top 10 transfers
  function getTopTransfers(branch: string) {
    const agg: Record<string, number> = {};
    filteredTransfers.forEach(row => {
      if (row.Branch === branch && row.Item) {
        agg[row.Item] = (agg[row.Item] || 0) + (Number(row.Amount) || 0);
      }
    });
    return Object.entries(agg)
      .map(([item, amount]) => ({ item, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3e7e3] via-[#e6ede6] to-[#c7d1c0] p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-[#006400] text-center mb-8">Transfers Report</h1>
      <div className="flex gap-4 mb-8">
        <label className="font-semibold text-[#4A6741]">Date Range:</label>
        <DatePicker selected={startDate} onChange={date => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} dateFormat="MM/dd/yyyy" className="px-4 py-2 rounded-lg border border-[#b5c9a3]" placeholderText="Start Date" />
        <span className="mx-2 text-[#4A6741]">to</span>
        <DatePicker selected={endDate} onChange={date => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate ?? undefined} dateFormat="MM/dd/yyyy" className="px-4 py-2 rounded-lg border border-[#b5c9a3]" placeholderText="End Date" />
      </div>
      <div className="flex gap-4 mb-8">
        <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="px-4 py-2 rounded-lg border border-[#b5c9a3]">
          <option value="">All Groups</option>
          <option value="RawMats">RawMats</option>
          <option value="Employees Meal">Employees Meal</option>
          <option value="NonFood">NonFood</option>
        </select>
        <select value={selectedBranch} onChange={e => setSelectedBranch(e.target.value)} className="px-4 py-2 rounded-lg border border-[#b5c9a3]">
          <option value="">All Branches</option>
          <option value="Mayon">Mayon</option>
          <option value="One Balete">One Balete</option>
        </select>
      </div>
      {/* Summary Table */}
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl border border-[#b5c9a3] p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#006400] mb-6 text-center">Summary by Group and Branch</h2>
        <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden mb-4">
          <thead>
            <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
              <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wide">Branch</th>
              <th className="px-6 py-4 text-right font-bold text-white uppercase tracking-wide">RawMats</th>
              <th className="px-6 py-4 text-right font-bold text-white uppercase tracking-wide">Employees Meal</th>
              <th className="px-6 py-4 text-right font-bold text-white uppercase tracking-wide">NonFood</th>
            </tr>
          </thead>
          <tbody>
            {["Mayon", "One Balete"].map(branch => {
              const summary = getSummary(branch);
              return (
                <tr key={branch} className="hover:bg-[#f0f8f0] transition-colors font-semibold">
                  <td className="px-6 py-4 text-left text-[#4A6741]">{branch}</td>
                  {summary.map(s => (
                    <td key={s.group} className="px-6 py-4 text-right text-[#006400]">{s.total === 0 ? '-' : `₱${s.total.toLocaleString()}`}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Top 10 Transfers */}
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl border border-[#b5c9a3] p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#006400] mb-6 text-center">Top 10 Transfers by Item</h2>
        <div className="flex gap-8">
          {["Mayon", "One Balete"].map(branch => (
            <div key={branch} className="flex-1">
              <h3 className="text-xl font-bold text-[#4A6741] mb-4 text-center">{branch}</h3>
              <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden mb-4">
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
                    <th className="px-6 py-4 text-left font-bold text-white uppercase tracking-wide">Item</th>
                    <th className="px-6 py-4 text-right font-bold text-white uppercase tracking-wide">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {getTopTransfers(branch).map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#f0f8f0] transition-colors">
                      <td className="px-6 py-4 text-left text-[#4A6741] font-medium">{row.item}</td>
                      <td className="px-6 py-4 text-right text-[#006400] font-bold">₱{Number(row.amount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      {/* Detailed Table */}
      <div className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-2xl border border-[#b5c9a3] p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#006400] mb-6 text-center">All Transfers (Filtered)</h2>
        <table className="w-full border-separate border-spacing-0 text-base bg-white rounded-xl overflow-hidden mb-4">
          <thead>
            <tr style={{ background: 'linear-gradient(90deg, #9CAF88 0%, #4A6741 100%)' }}>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Date</th>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Group</th>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Department</th>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Item</th>
              <th className="px-4 py-2 text-right font-bold text-white uppercase tracking-wide">Qty</th>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Unit</th>
              <th className="px-4 py-2 text-right font-bold text-white uppercase tracking-wide">Amount</th>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Source Branch</th>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Destination Branch</th>
              <th className="px-4 py-2 text-left font-bold text-white uppercase tracking-wide">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransfers.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#f0f8f0] transition-colors">
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.InvoiceDate}</td>
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.Group}</td>
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.Department}</td>
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.Item}</td>
                <td className="px-4 py-2 text-right text-[#006400]">{row.Qty}</td>
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.Unit}</td>
                <td className="px-4 py-2 text-right text-[#006400]">₱{Number(row.Amount).toLocaleString()}</td>
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.SourceBranch || '-'}</td>
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.DestinationBranch || '-'}</td>
                <td className="px-4 py-2 text-left text-[#4A6741]">{row.Remarks || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Export/Print Buttons */}
      <div className="flex gap-4 mb-8">
        <button className="px-6 py-2 rounded-xl font-bold shadow transition border border-[#b5c9a3] bg-[#006400] text-white">Export to Excel</button>
        <button className="px-6 py-2 rounded-xl font-bold shadow transition border border-[#b5c9a3] bg-[#4A6741] text-white">Print</button>
      </div>
    </div>
  );
}
