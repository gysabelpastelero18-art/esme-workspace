"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import html2canvas from 'html2canvas';
import ExcelJS from 'exceljs';

export default function InventoryPrintSummary() {
  const searchParams = useSearchParams();
  const [tableData, setTableData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);

  // Get filters from query params
  const branch = searchParams.get('branch') || '';
  const department = searchParams.get('department') || '';
  const group = searchParams.get('group') || '';
  const dateEncoded = searchParams.get('dateEncoded') || '';

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
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
      setLoading(false);
    }
    fetchInventory();
  }, [branch, department, group, dateEncoded]);

  // Group and summarize data by category and item
  const categoryMap: Record<string, Record<string, any>> = {};
  (Array.isArray(tableData) ? tableData : []).forEach(row => {
    const cat = row.category || 'Uncategorized';
    if (!categoryMap[cat]) categoryMap[cat] = {};
    const itemKey = row.item || '';
    if (!categoryMap[cat][itemKey]) {
      categoryMap[cat][itemKey] = {
        item: row.item,
        pcsKg: 0,
        grams: 0,
        price: 0,
        amount: 0,
        unit: row.unit || '-',
      };
    }
    categoryMap[cat][itemKey].pcsKg += parseFloat(row.pcsKg) || 0;
    categoryMap[cat][itemKey].grams += parseFloat(row.grams) || 0;
    categoryMap[cat][itemKey].price += parseFloat(row.price) || 0;
    categoryMap[cat][itemKey].amount += parseFloat(row.amount) || 0;
  });
  const categories = Object.keys(categoryMap);

  // Compute category summary
  const categorySummary: Record<string, number> = {};
  categories.forEach(cat => {
    categorySummary[cat] = Object.values(categoryMap[cat]).reduce((sum: number, row: any) => sum + (parseFloat(row.amount) || 0), 0);
  });

  // Fetch countedBy and checkedBy from localStorage only on client
  // Use useSearchParams from next/navigation for SSR/CSR compatibility
  const [countedBy, setCountedBy] = useState('');
  const [checkedBy, setCheckedBy] = useState('');
  useEffect(() => {
    // Prefer query params, fallback to localStorage
    const counted = searchParams.get('countedBy') || (typeof window !== 'undefined' ? localStorage.getItem('countedBy') : '') || '';
    const checked = searchParams.get('checkedBy') || (typeof window !== 'undefined' ? localStorage.getItem('checkedBy') : '') || '';
    setCountedBy(counted);
    setCheckedBy(checked);
  }, [searchParams]);

  const handleDownloadImage = async () => {
    const element = document.getElementById('print-summary');
    if (!element) return;
    // Hide buttons before capture
    const buttons = element.querySelectorAll('button');
    buttons.forEach(btn => btn.style.display = 'none');
    // Wait for DOM update
    await new Promise(res => setTimeout(res, 100));
    const canvas = await html2canvas(element, { scale: 2 });
    const image = canvas.toDataURL('image/png');
    // Restore buttons
    buttons.forEach(btn => btn.style.display = '');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'inventory-print-summary.png';
    link.click();
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');
    worksheet.columns = [
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Item', key: 'item', width: 30 },
      { header: 'Qty', key: 'pcsKg', width: 10 },
      { header: 'Unit', key: 'unit', width: 10 },
      { header: 'Grams', key: 'grams', width: 12 },
      { header: 'Price', key: 'price', width: 12 },
      { header: 'Amount', key: 'amount', width: 14 },
    ];
    (Array.isArray(tableData) ? tableData : []).forEach((row: any) => {
      worksheet.addRow({
        category: row.category || '',
        item: row.item || '',
        pcsKg: row.pcsKg || '',
        unit: row.unit || '',
        grams: row.grams || '',
        price: row.price || '',
        amount: row.amount || '',
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'inventory-print-summary.xlsx';
    link.click();
  };

  return (
    <div id="print-summary" style={{ background: 'white', padding: '0 2rem 2rem 2rem', minHeight: '100vh', fontFamily: 'Segoe UI, Arial, sans-serif', color: '#2a4d4f' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <button
          onClick={() => {
            const params = new URLSearchParams();
            if (branch) params.append('branch', branch);
            if (department) params.append('department', department);
            if (group) params.append('group', group);
            window.location.href = `/inventory-input?${params.toString()}`;
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, marginRight: '1.5rem', display: 'block' }}
          title="Back"
          className="route-icon"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#2a4d4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="button-row" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <button
            onClick={() => window.print()}
            style={{ background: 'linear-gradient(90deg,#3182ce,#38b2ac)', color: 'white', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(49,130,206,0.15)' }}
          >
            Print
          </button>
          <button
            onClick={handleDownloadImage}
            style={{ background: '#38b2ac', color: 'white', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', marginRight: '1rem', boxShadow: '0 2px 8px rgba(49,130,206,0.15)' }}
          >
            Download as Image
          </button>
          <button
            onClick={handleExportExcel}
            style={{ background: '#4299e1', color: 'white', padding: '0.7rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(49,130,206,0.15)' }}
          >
            Export to Excel
          </button>
        </div>
      </div>
      <style>{`
        @media print {
          @page {
            size: legal portrait;
            margin: 0.5in 0.5in 1.63in 0.5in;
          }
          body, #print-summary {
            zoom: 0.8;
          }
          button, .route-icon { display: none !important; }
        }
        @media (max-width: 640px) {
          #print-summary {
            padding: 0 0.5rem 1rem 0.5rem !important;
          }
          .header-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.5rem !important;
            text-align: center !important;
          }
          .inventory-title {
            font-size: 1.3rem !important;
            text-align: center !important;
            width: 100% !important;
          }
          .header-branch {
            font-size: 1.1rem !important;
            text-align: center !important;
            width: 100% !important;
          }
          .header-date {
            font-size: 1rem !important;
            text-align: center !important;
            width: 100% !important;
          }
          .button-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.7rem !important;
            width: 100% !important;
            margin-top: 0.7rem !important;
          }
          .button-row button {
            width: 100% !important;
            font-size: 1rem !important;
            padding: 0.7rem 0 !important;
            min-width: 100px !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
      <div className="header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #38b2ac', paddingBottom: '1rem' }}>
        <img src="/images/logo.png" alt="Logo" style={{ height: 60, marginRight: 24 }} />
        <div className="inventory-title" style={{ fontSize: '2.3rem', fontWeight: 700, flex: 1, textAlign: 'left', letterSpacing: '1px', color: '#2a4d4f' }}>Inventory</div>
        <div className="header-branch" style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: '1.3rem', color: '#2a4d4f' }}>
          {branch ? branch : '-'}{branch && department ? ' - ' : ''}{department ? department : ''}
        </div>
        <div className="header-date" style={{ flex: 1, textAlign: 'right', fontWeight: 600, fontSize: '1.15rem', color: '#2a4d4f' }}>{dateEncoded ? new Date(dateEncoded).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }) : '-'}</div>
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.7rem', color: '#2a4d4f', letterSpacing: '0.5px' }}>Summary</h3>
      <table style={{ width: '40%', minWidth: 320, margin: '0 0 2rem 0', borderCollapse: 'collapse', tableLayout: 'fixed', boxShadow: '0 2px 8px rgba(49,130,206,0.08)', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden' }}>
        <colgroup>
          <col style={{ width: '55%' }} />
          <col style={{ width: '45%' }} />
        </colgroup>
        <thead>
          <tr style={{ background: '#e6f4ea' }}>
            <th style={{ border: '1px solid #a0aec0', padding: '10px', fontWeight: 700, textAlign: 'left', background: 'inherit', color: '#2a4d4f' }}>Category</th>
            <th style={{ border: '1px solid #a0aec0', padding: '10px', fontWeight: 700, textAlign: 'right', background: 'inherit', color: '#2a4d4f' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat}>
              <td style={{ border: '1px solid #a0aec0', padding: '10px', textAlign: 'left', background: '#fff' }}>{cat}</td>
              <td style={{ border: '1px solid #a0aec0', padding: '10px', textAlign: 'right', fontWeight: 600, background: '#fff' }}>{categorySummary[cat].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#e6f4ea', fontWeight: 700 }}>
            <td style={{ border: '1px solid #a0aec0', padding: '10px', textAlign: 'right', background: 'inherit' }}>Total</td>
            <td style={{ border: '1px solid #a0aec0', padding: '10px', textAlign: 'right', fontWeight: 700, background: 'inherit' }}>{categories.reduce((sum, cat) => sum + (categorySummary[cat] || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        </tfoot>
      </table>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#2a4d4f', fontWeight: 600, fontSize: '1.1rem' }}>Loading...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#2a4d4f', fontWeight: 600, fontSize: '1.1rem' }}>No data found.</div>
      ) : (
        categories.map(cat => (
          <div key={cat}>
            <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: '#2a4d4f', letterSpacing: '0.5px' }}>{cat}</h4>
            <div className="category-table-wrapper" style={{ overflowX: 'auto' }}>
              <table className="category-table" style={{ width: '100%', minWidth: 400, borderCollapse: 'collapse', fontSize: '1rem', marginBottom: '2rem', tableLayout: 'fixed', boxShadow: '0 2px 8px rgba(49,130,206,0.08)', background: '#e6f4ea', borderRadius: '8px', overflow: 'hidden' }}>
                <colgroup>
                  <col style={{ width: '32%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                  <tr style={{ background: '#e6f4ea' }}>
                    <th style={{ border: '1px solid #a0aec0', padding: '6px', fontWeight: 700, textAlign: 'left', background: 'inherit', color: '#2a4d4f' }}>Item</th>
                    <th style={{ border: '1px solid #a0aec0', padding: '6px', fontWeight: 700, textAlign: 'center', background: 'inherit', color: '#2a4d4f' }}>Qty</th>
                    <th style={{ border: '1px solid #a0aec0', padding: '6px', fontWeight: 700, textAlign: 'center', background: 'inherit', color: '#2a4d4f' }}>Unit</th>
                    <th style={{ border: '1px solid #a0aec0', padding: '6px', fontWeight: 700, textAlign: 'right', background: 'inherit', color: '#2a4d4f' }}>Grams</th>
                    <th style={{ border: '1px solid #a0aec0', padding: '6px', fontWeight: 700, textAlign: 'right', background: 'inherit', color: '#2a4d4f' }}>Price</th>
                    <th style={{ border: '1px solid #a0aec0', padding: '6px', fontWeight: 700, textAlign: 'right', background: 'inherit', color: '#2a4d4f' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(categoryMap[cat]).map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #a0aec0', padding: '6px', textAlign: 'left', background: '#fff' }}>{row.item}</td>
                      <td style={{ border: '1px solid #a0aec0', padding: '6px', textAlign: 'center', background: '#fff' }}>{row.pcsKg}</td>
                      <td style={{ border: '1px solid #a0aec0', padding: '6px', textAlign: 'center', background: '#fff' }}>{row.unit || '-'}</td>
                      <td style={{ border: '1px solid #a0aec0', padding: '6px', textAlign: 'right', background: '#fff' }}>{row.grams ? Number(row.grams).toLocaleString() : ''}</td>
                      <td style={{ border: '1px solid #a0aec0', padding: '6px', textAlign: 'right', background: '#fff' }}>{row.price ? Number(row.price).toLocaleString() : ''}</td>
                      <td style={{ border: '1px solid #a0aec0', padding: '6px', textAlign: 'right', fontWeight: 600, background: '#fff' }}>{row.amount ? Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: '#e6f4ea', fontWeight: 700 }}>
                    <td colSpan={5} style={{ border: '1px solid #a0aec0', padding: '10px', textAlign: 'right', background: 'inherit' }}>Total Amount</td>
                    <td style={{ border: '1px solid #a0aec0', padding: '10px', textAlign: 'right', fontWeight: 700, background: 'inherit' }}>{categorySummary[cat].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <style>{`
              @media (max-width: 640px) {
                .category-table-wrapper {
                  margin-bottom: 1.2rem !important;
                  padding-bottom: 0.5rem !important;
                  max-width: 100vw !important;
                }
                .category-table {
                  font-size: 0.92rem !important;
                  min-width: 340px !important;
                }
                .category-table th, .category-table td {
                  padding: 4px !important;
                }
                .category-table col:nth-child(3) {
                  width: 8% !important;
                }
                .category-table col:nth-child(4),
                .category-table col:nth-child(5) {
                  width: 15% !important;
                }
              }
            `}</style>
          </div>
        ))
      )}
      {/* Counted By and Checked By section below tables */}
      <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-start', gap: '4rem', fontSize: '1.1rem', color: '#2a4d4f', fontWeight: 600 }}>
        <div className="counted-checked-row" style={{ display: 'flex', flexDirection: 'row', gap: '4rem', fontSize: '1.1rem', color: '#2a4d4f', fontWeight: 600 }}>
          <div>Counted By: {countedBy || '____________________'}</div>
          <div>Checked By: {checkedBy || '____________________'}</div>
        </div>
        <style>{`
          @media (max-width: 640px) {
            .counted-checked-row {
              flex-direction: column !important;
              gap: 0.7rem !important;
              align-items: flex-start !important;
              font-size: 1rem !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
