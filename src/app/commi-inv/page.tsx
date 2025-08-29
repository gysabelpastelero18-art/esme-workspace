"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadProductionData } from '@/lib/production-api';

const columns = [
  'item', 'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over', 'ending'
];

const branchOptions = ['Mayon Branch', 'One Balete Branch'];

export default function CommiInvPage() {
  // Print handler
  const handlePrint = () => {
    window.print();
  };
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const searchParams = useSearchParams();
  const initialDate = searchParams.get('date') || getTodayDate();
  const initialBranch = searchParams.get('branch') || 'Mayon Branch';

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedBranch, setSelectedBranch] = useState(initialBranch);
  const [commiData, setCommiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    loadProductionData(selectedDate, selectedBranch, 'Commissary').then(result => {
      if (result.success && result.data && Array.isArray(result.data.data)) {
        setCommiData(result.data.data);
      } else {
        setCommiData([]);
      }
      setLoading(false);
    });
  }, [selectedDate, selectedBranch]);

  return (
  <div style={{ padding: '16px 4px', fontFamily: 'Arial, sans-serif', background: 'rgba(255,255,255,0.95)', minHeight: '100vh' }}>
      {/* Header with logo and title */}
      <div className="commi-print-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <img src="/images/logo.png" alt="Logo" style={{ height: 60, marginRight: 24 }} />
        <h1 style={{ color: '#4A6741', fontWeight: 800, fontSize: 32, margin: 0 }}>Commissary Daily Inventory</h1>
      </div>
      {/* Print-only branch, department, date under title */}
      <div className="commi-print-info" style={{ display: 'none', textAlign: 'center', fontWeight: 600, color: '#4A6741', fontSize: 16, marginBottom: 16 }}>
        {selectedBranch} - Commissary&nbsp;
        {(() => {
          const dateObj = new Date(selectedDate);
          const month = dateObj.toLocaleString('default', { month: 'long' });
          const day = String(dateObj.getDate()).padStart(2, '0');
          const year = dateObj.getFullYear();
          return `${month} ${day}, ${year}`;
        })()}
      </div>
      {/* Date, Branch, Department Row with right-aligned Print Button (hidden in print) */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#4A6741', fontWeight: 500 }}>📅 Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #9CAF88', borderRadius: 8, padding: '8px 12px', color: '#4A6741', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#4A6741', fontWeight: 500 }}>🏢 Branch:</span>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid #9CAF88', borderRadius: 8, padding: '8px 12px', color: '#4A6741', outline: 'none' }}
            >
              {branchOptions.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, rgba(156,175,136,0.15), rgba(74,103,65,0.1))', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(156,175,136,0.3)', backdropFilter: 'blur(10px)' }}>
            <span style={{ color: '#4A6741', fontWeight: 600 }}>🏪 Department:</span>
            <span style={{ fontWeight: 700, color: '#2E7D32', fontSize: 18 }}>Commissary</span>
          </div>
        </div>
        <button
          onClick={handlePrint}
          style={{
            background: '#4A6741', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(74,103,65,0.08)' }}
        >
          🖨️ Print
        </button>
      </div>
  {/* Table */}
  <div className="commi-print-table" style={{ background: 'white', borderRadius: 20, border: '1px solid #e0e0e0', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '16px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#e8f5e9', color: '#2e7d32' }}>
              {columns.map(col => {
                let displayLabel = col;
                if (col === 'production') displayLabel = 'prod';
                if (col === 'oneBalete') displayLabel = '1B';
                // Columns from beg to over should fit 5 numbers
                const fit5Cols = [
                  'beg', 'production', 'cashier', 'bar', 'kitchen', 'oneBalete', 'sold', 'spoilage', 'return', 'short', 'over'
                ];
                let thStyle: React.CSSProperties = {
                  border: '1px solid #bdbdbd',
                  padding: 8,
                  textTransform: 'capitalize',
                  textAlign: col === 'item' ? 'left' : 'center',
                };
                if (col === 'item') {
                  thStyle.maxWidth = '25ch';
                  thStyle.width = '25ch';
                } else if (col === 'short' || col === 'over') {
                  thStyle.maxWidth = '1ch';
                  thStyle.width = '1ch';
                } else if (col === 'ending') {
                  thStyle.maxWidth = '8ch';
                  thStyle.width = '8ch';
                } else if (fit5Cols.includes(col)) {
                  thStyle.maxWidth = '5ch';
                  thStyle.width = '5ch';
                } else if (col === 'ending') {
                  thStyle.maxWidth = '8ch';
                  thStyle.width = '8ch';
                  thStyle.minWidth = '8ch';
                } else {
                  thStyle.maxWidth = '7ch';
                  thStyle.width = '7ch';
                }
                return (
                  <th
                    key={col}
                    style={thStyle}
                    className={col === 'short' ? 'short' : col === 'over' ? 'over' : undefined}
                  >
                    {displayLabel}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tr className="print-total-row" style={{ display: 'none' }}>
  {columns.map(col => {
    const sumColumns = [
      'item', 'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over', 'ending'
    ];
    const alwaysShowZero = [
      'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over', 'ending'
    ];
    if (col === 'item') {
      return <td key={col} style={{ border: '1px solid #bdbdbd', padding: 8, textAlign: 'left', fontWeight: 'bold', background: '#f5f5f5' }}>TOTAL</td>;
    }
    if (!sumColumns.includes(col)) {
      return <td key={col} style={{ border: '1px solid #bdbdbd', padding: 8, background: '#f5f5f5' }} />;
    }
    const sum = commiData.reduce((acc, row) => {
      const val = row[col];
      return acc + (typeof val === 'number' && !isNaN(val) ? val : 0);
    }, 0);
    const isEnding = col === 'ending';
    let displayValue = '';
    if (alwaysShowZero.includes(col)) {
      displayValue = sum.toString();
    }
    return (
      <td
        key={col}
        style={{
          border: '1px solid #bdbdbd',
          padding: 8,
          textAlign: 'center',
          fontWeight: isEnding ? 'bold' : undefined,
          background: '#f5f5f5',
          maxWidth: !isEnding ? '7ch' : undefined,
          width: !isEnding ? '7ch' : undefined,
        }}
      >
        {displayValue}
      </td>
    );
  })}
</tr>
          {/* Table Footer for Sums */}
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 24 }}>Loading...</td></tr>
            ) : commiData.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 24 }}>No data found.</td></tr>
            ) : (
              commiData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => {
                    const isEnding = col === 'ending';
                    const isBeg = col === 'beg';
                    const isItem = col === 'item';
                    // Columns from beg to over should fit 5 numbers
                    const fit5Cols = [
                      'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over'
                    ];
                    const isNumberCol = !isItem && !isEnding && !isBeg;
                    let value = row[col];
                    // Show 0 for beg and ending if value is 0, else blank for 0 in other columns
                    if (isBeg || isEnding) {
                      value = (value === 0) ? 0 : (value ?? '');
                    } else if (!isItem) {
                      value = (value === 0) ? '' : (value ?? '');
                    }
                    let tdStyle: React.CSSProperties = {
                      border: '1px solid #bdbdbd',
                      padding: 8,
                      textAlign: isItem ? 'left' : 'center',
                      fontWeight: isEnding ? 'bold' : undefined,
                      overflow: isNumberCol || fit5Cols.includes(col) ? 'hidden' : undefined,
                      textOverflow: isNumberCol || fit5Cols.includes(col) ? 'ellipsis' : undefined,
                      whiteSpace: isNumberCol || fit5Cols.includes(col) ? 'nowrap' : undefined,
                    };
                    if (isItem) {
                      tdStyle.maxWidth = '25ch';
                      tdStyle.width = '25ch';
                    } else if (col === 'short' || col === 'over') {
                      tdStyle.maxWidth = '2ch';
                      tdStyle.width = '2ch';
                    } else if (isEnding) {
                      tdStyle.maxWidth = '8ch';
                      tdStyle.width = '8ch';
                    } else if (fit5Cols.includes(col)) {
                      tdStyle.maxWidth = '5ch';
                      tdStyle.width = '5ch';
                    } else if (isEnding) {
                      tdStyle.maxWidth = '8ch';
                      tdStyle.width = '8ch';
                      tdStyle.minWidth = '8ch';
                      tdStyle.overflow = undefined;
                      tdStyle.textOverflow = undefined;
                      tdStyle.whiteSpace = undefined;
                    } else if (isNumberCol) {
                      tdStyle.maxWidth = '7ch';
                      tdStyle.width = '7ch';
                    }
                    return (
                      <td
                        key={col}
                        style={tdStyle}
                        className={col === 'short' ? 'short' : col === 'over' ? 'over' : undefined}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
            {/* Totals row for form (screen only) */}
            <tr className="form-total-row">
              {columns.map(col => {
                const sumColumns = [
                  'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over', 'ending'
                ];
                const alwaysShowZero = [
                  'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over', 'ending'
                ];
                if (col === 'item') {
                  return <td key={col} style={{ border: '1px solid #bdbdbd', padding: 8, textAlign: 'left', fontWeight: 'bold', background: '#f5f5f5' }}>TOTAL</td>;
                }
                if (!sumColumns.includes(col)) {
                  return <td key={col} style={{ border: '1px solid #bdbdbd', padding: 8, background: '#f5f5f5' }} />;
                }
                const sum = commiData.reduce((acc, row) => {
                  const val = row[col];
                  return acc + (typeof val === 'number' && !isNaN(val) ? val : 0);
                }, 0);
                const isEnding = col === 'ending';
                let displayValue = '';
                if (alwaysShowZero.includes(col)) {
                  displayValue = sum.toString();
                }
                return (
                  <td
                    key={col}
                    style={{
                      border: '1px solid #bdbdbd',
                      padding: 8,
                      textAlign: 'center',
                      fontWeight: isEnding ? 'bold' : undefined,
                      background: '#f5f5f5',
                      maxWidth: !isEnding ? '7ch' : undefined,
                      width: !isEnding ? '7ch' : undefined,
                    }}
                  >
                    {displayValue}
                  </td>
                );
              })}
            </tr>
    
          </tbody>
          {/* Table Footer for Sums */}
          
        </table>
      </div>
      {/* Print-only totals row outside the table */}
      <div className="print-totals-row" style={{ display: 'none', width: '100%', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16 }}>
          <tbody>
            <tr className="print-total-row-tr" style={{ display: 'none' }}>
              {columns.map(col => {
                const sumColumns = [
                  'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over', 'ending'
                ];
                const alwaysShowZero = [
                  'beg', 'production', 'used', 'cashier', 'kitchen', 'oneBalete', 'sold','event', 'spoilage', 'return', 'short', 'over', 'ending'
                ];
                if (col === 'item') {
                  return <td key={col} style={{ border: '1px solid #bdbdbd', padding: 8, textAlign: 'left', fontWeight: 'bold', background: '#f5f5f5' }}>TOTAL</td>;
                }
                if (!sumColumns.includes(col)) {
                  return <td key={col} style={{ border: '1px solid #bdbdbd', padding: 8, background: '#f5f5f5' }} />;
                }
                const sum = commiData.reduce((acc, row) => {
                  const val = row[col];
                  return acc + (typeof val === 'number' && !isNaN(val) ? val : 0);
                }, 0);
                const isEnding = col === 'ending';
                let displayValue = '';
                if (alwaysShowZero.includes(col)) {
                  displayValue = sum.toString();
                }
                return (
                  <td
                    key={col}
                    style={{
                      border: '1px solid #bdbdbd',
                      padding: 8,
                      textAlign: 'center',
                      fontWeight: isEnding ? 'bold' : undefined,
                      background: '#f5f5f5',
                      maxWidth: !isEnding ? '7ch' : undefined,
                      width: !isEnding ? '7ch' : undefined,
                    }}
                  >
                    {displayValue}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    {/* Print CSS for letter landscape */}
    <style>{`
      @media print {
        .print-totals-row {
          display: block !important;
          page-break-before: avoid;
        }
        .print-total-row-tr {
          display: table-row !important;
        }
        .commi-print-info {
          display: block !important;
        }
        @page {
          size: Letter landscape;
          margin-top: 0.5cm;
          margin-right: 0;
          margin-bottom: 0;
          margin-left: 0;
        }
        body * {
          visibility: hidden !important;
        }
        .commi-print-title, .commi-print-title *,
        .commi-print-table, .commi-print-table *,
        .commi-print-info, .commi-print-info * {
          visibility: visible !important;
        }
        .commi-print-title {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          margin: 0;
        }
        .commi-print-info {
          position: absolute;
          top: 50px;
          left: 0;
          width: 100vw;
        }
        .commi-print-table {
          position: absolute;
          top: 70px;
          left: 0;
          width: 100vw;
        }
        button, input, select, .no-print {
          display: none !important;
        }
        table {
          font-size: 13px !important;
        }
        table tr, table td, table th {
          min-height: 12px !important;
          height: 22px !important;
          padding-top: 2px !important;
          padding-bottom: 2px !important;
        }
      }
    `}</style>
  </div>
  );
}
