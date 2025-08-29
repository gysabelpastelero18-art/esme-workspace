"use client";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { useSearchParams } from "next/navigation";

export default function InventoryQuickPrint() {
  const searchParams = useSearchParams();
  const [tableData, setTableData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState("");

  const [department, setDepartment] = useState("");
  const [group, setGroup] = useState("");
  const todayStr = new Date().toISOString().slice(0, 10);
  const [dateEncoded, setDateEncoded] = useState(todayStr);
  const [countedBy, setCountedBy] = useState("");
  const [checkedBy, setCheckedBy] = useState("");

  // Department options by group (after group is initialized)
  const rawMatsDepartments = ["Bakery", "Bar", "Cashier", "Commissary", "Dessert", "Main Kitchen", "Warehouse"];
  const nonFoodDepartments = ["Admin", "Bar", "Bakery", "Cashier", "Commissary", "Dessert", "FOH", "Main Kitchen", "Maintenance", "Warehouse"];
  const departmentOptions = group === "RawMats" ? rawMatsDepartments : group === "NonFood" ? nonFoodDepartments : [];

  useEffect(() => {
    // Optionally, get filters from query params or localStorage
    setBranch(searchParams.get("branch") || localStorage.getItem("branch") || "");
    setDepartment(searchParams.get("department") || localStorage.getItem("department") || "");
    setGroup(searchParams.get("group") || localStorage.getItem("group") || "");
    setDateEncoded(searchParams.get("dateEncoded") || localStorage.getItem("dateEncoded") || "");
  }, [searchParams]);

  // Fetch countedBy and checkedBy from inventory DB when filters change
  useEffect(() => {
    async function fetchSignatories() {
      if (!branch || !department || !group || !dateEncoded) {
        setCountedBy("");
        setCheckedBy("");
        return;
      }
      const params = new URLSearchParams();
      params.append("branch", branch);
      params.append("department", department);
      params.append("group", group);
      params.append("dateEncoded", dateEncoded);
      const res = await fetch(`/api/inventory?${params.toString()}`);
      const result = await res.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        // Use the most recent record (by createdAt if available)
        const sorted = result.data.sort((a: any, b: any) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
        setCountedBy(sorted[0].countedBy || "");
        setCheckedBy(sorted[0].checkedBy || "");
      } else {
        setCountedBy("");
        setCheckedBy("");
      }
    }
    fetchSignatories();
  }, [branch, department, group, dateEncoded]);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      const params = new URLSearchParams();
      if (branch) params.append("branch", branch);
      if (department) params.append("department", department);
      if (group) params.append("group", group);
      if (dateEncoded) params.append("dateEncoded", dateEncoded);
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
    const cat = row.category || "Uncategorized";
    if (!categoryMap[cat]) categoryMap[cat] = {};
    const itemKey = row.item || "";
    if (!categoryMap[cat][itemKey]) {
      categoryMap[cat][itemKey] = {
        item: row.item,
        pcsKg: 0,
        grams: 0,
        price: 0,
        amount: 0,
        unit: row.unit || "-",
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

  return (
    <div id="quick-print-summary" style={{ background: "white", padding: "0 2rem 2rem 2rem", minHeight: "100vh", fontFamily: "Segoe UI, Arial, sans-serif", color: "#2a4d4f" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <button
          onClick={() => window.location.href = "/maindashboard"}
          style={{ background: "none", border: "none", cursor: "pointer", zIndex: 10, marginRight: "1.5rem" }}
          title="Back"
          className="route-icon"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#2a4d4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <button
            onClick={() => {
              const printSection = document.getElementById('quick-print-summary');
              if (printSection) {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Inventory Quick Print</title>
                        <style>
                          @page {
                            size: Legal portrait;
                            margin-top: 0.5in;
                            margin-bottom: 1.63in;
                            margin-left: 0.5in;
                            margin-right: 0.5in;
                          }
                          body { font-family: Segoe UI, Arial, sans-serif; color: #2a4d4f; margin: 0; padding: 0; }
                          .print-section { padding: 1rem 2rem 2rem 2rem; margin-top: -1 !important; }
                          .print-logo { display: block; margin: 0 auto 0.5rem auto; height: 48px; }
                          .print-header { margin-top: -1 !important; margin-bottom: 0.7rem !important; }
                          .print-footer { display: none !important; }
                        </style>
                      </head>
                      <body>
                        <div class="print-section">
                          <div class="print-header" style="display: flex; align-items: center; gap: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #38b2ac; padding-bottom: 1rem;">
                            <div style="display: flex; align-items: center; gap: 1rem; min-width: 320px;">
                              <img src="/images/logo.png" alt="Logo" style="height: 70px; margin-right: 16px; filter: drop-shadow(0 2px 6px #38b2ac88);" />
                              <span style="font-size: 2.3rem; font-weight: 700; letter-spacing: 1px; color: #2a4d4f;">Inventory</span>
                            </div>
                            <div style="flex: 1; text-align: center; font-weight: 600; font-size: 1.3rem; color: #2a4d4f;">
                              ${branch ? branch : "-"}${branch && department ? " - " : ""}${department ? department : ""}
                            </div>
                            <div style="flex: 1; text-align: right; font-weight: 600; font-size: 1.15rem; color: #2a4d4f;">
                              ${dateEncoded ? new Date(dateEncoded).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : "-"}
                            </div>
                          </div>
                          ${Array.from(printSection.children).map(child => {
                            if (child.id === 'inventory-header-section') return '';
                            if (child.classList.contains('print-footer')) return '';
                            return child.outerHTML;
                          }).join('')}
                        </div>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }
              } else {
                window.print();
              }
            }}
            style={{ background: "linear-gradient(90deg,#3182ce,#38b2ac)", color: "white", padding: "0.7rem 1.5rem", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 2px 8px rgba(49,130,206,0.15)" }}
          >
            Print
          </button>
          <button
            onClick={async () => {
              // Hide filters and buttons
              const filterDiv = document.querySelector('.filter-controls') as HTMLElement;
              const buttons = Array.from(document.querySelectorAll('button')) as HTMLElement[];
              if (filterDiv) filterDiv.style.display = 'none';
              buttons.forEach(btn => btn.style.display = 'none');
              const element = document.getElementById("quick-print-summary");
              if (!element) return;
              const canvas = await html2canvas(element, { scale: 2 });
              // Restore filters and buttons
              if (filterDiv) filterDiv.style.display = '';
              buttons.forEach(btn => btn.style.display = '');
              const link = document.createElement("a");
              link.download = `inventory-summary-${dateEncoded || "report"}.png`;
              link.href = canvas.toDataURL();
              link.click();
            }}
            style={{ background: "linear-gradient(90deg,#38b2ac,#3182ce)", color: "white", padding: "0.7rem 1.5rem", borderRadius: "8px", fontWeight: "bold", fontSize: "1.1rem", boxShadow: "0 2px 8px rgba(49,130,206,0.15)" }}
          >
            Download as Image
          </button>
        </div>
      </div>

      {/* Filter Controls */}
  <div className="filter-controls" style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Date:</label>
          <input type="date" value={dateEncoded} onChange={e => setDateEncoded(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #a0aec0" }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Group:</label>
          <select value={group} onChange={e => setGroup(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #a0aec0" }}>
            <option value="">All</option>
            <option value="RawMats">RawMats</option>
            <option value="NonFood">NonFood</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Branch:</label>
          <select value={branch} onChange={e => setBranch(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #a0aec0" }}>
            <option value="">All</option>
            <option value="Mayon">Mayon</option>
            <option value="One Balete">One Balete</option>
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 600, marginRight: 8 }}>Department:</label>
          <select value={department} onChange={e => setDepartment(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #a0aec0" }}>
            <option value="">All</option>
            {departmentOptions.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </div>
      <style>{`
        @media print {
          @page {
            size: legal portrait;
            margin: 0.5in 0.5in 1.63in 0.5in;
          }
          body, #quick-print-summary {
            zoom: 0.8;
          }
          button, .route-icon, .filter-controls { display: none !important; }
        }
      `}</style>
      <div id="inventory-header-section" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", borderBottom: "2px solid #38b2ac", paddingBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/images/logo.png" alt="Logo" style={{ height: 70, marginRight: 16, filter: "drop-shadow(0 2px 6px #38b2ac88)" }} />
          <span style={{ fontSize: "2.3rem", fontWeight: 700, letterSpacing: "1px", color: "#2a4d4f" }}>Inventory</span>
        </div>
        <div style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: "1.3rem", color: "#2a4d4f" }}>
          {branch ? branch : "-"}{branch && department ? " - " : ""}{department ? department : ""}
        </div>
        <div style={{ flex: 1, textAlign: "right", fontWeight: 600, fontSize: "1.15rem", color: "#2a4d4f" }}>{dateEncoded ? new Date(dateEncoded).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : "-"}</div>
      </div>
      <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem", color: "#2a4d4f", letterSpacing: "0.5px" }}>Summary</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "40%", minWidth: 320, margin: "0 0 2rem 0", borderCollapse: "collapse", tableLayout: "fixed", boxShadow: "0 2px 8px rgba(49,130,206,0.08)", background: "#f8fafc", borderRadius: "8px", overflow: "hidden" }}>
          <colgroup>
            <col style={{ width: "55%" }} />
            <col style={{ width: "45%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: "#e6f4ea" }}>
              <th style={{ border: "1px solid #a0aec0", padding: "10px", fontWeight: 700, textAlign: "left", background: "inherit", color: "#2a4d4f" }}>Category</th>
              <th style={{ border: "1px solid #a0aec0", padding: "10px", fontWeight: 700, textAlign: "right", background: "inherit", color: "#2a4d4f" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat}>
                <td style={{ border: "1px solid #a0aec0", padding: "10px", textAlign: "left", background: "#fff" }}>{cat}</td>
                <td style={{ border: "1px solid #a0aec0", padding: "10px", textAlign: "right", fontWeight: 600, background: "#fff" }}>{categorySummary[cat].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "#e6f4ea", fontWeight: 700 }}>
              <td style={{ border: "1px solid #a0aec0", padding: "10px", textAlign: "right", background: "inherit" }}>Total</td>
              <td style={{ border: "1px solid #a0aec0", padding: "10px", textAlign: "right", fontWeight: 700, background: "inherit" }}>{categories.reduce((sum, cat) => sum + (categorySummary[cat] || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", color: "#2a4d4f", fontWeight: 600, fontSize: "1.1rem" }}>Loading...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: "center", color: "#2a4d4f", fontWeight: 600, fontSize: "1.1rem" }}>No data found.</div>
      ) : (
        categories.map(cat => (
          <div key={cat}>
            <h4 style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem", color: "#2a4d4f", letterSpacing: "0.5px" }}>{cat}</h4>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 400, borderCollapse: "collapse", fontSize: "1rem", marginBottom: "2rem", tableLayout: "fixed", boxShadow: "0 2px 8px rgba(49,130,206,0.08)", background: "#e6f4ea", borderRadius: "8px", overflow: "hidden" }}>
                <colgroup>
                  <col style={{ width: "32%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr style={{ background: "#e6f4ea" }}>
                    <th style={{ border: "1px solid #a0aec0", padding: "6px", fontWeight: 700, textAlign: "left", background: "inherit", color: "#2a4d4f" }}>Item</th>
                    <th style={{ border: "1px solid #a0aec0", padding: "6px", fontWeight: 700, textAlign: "center", background: "inherit", color: "#2a4d4f" }}>Qty</th>
                    <th style={{ border: "1px solid #a0aec0", padding: "6px", fontWeight: 700, textAlign: "center", background: "inherit", color: "#2a4d4f" }}>Unit</th>
                    <th style={{ border: "1px solid #a0aec0", padding: "6px", fontWeight: 700, textAlign: "center", background: "inherit", color: "#2a4d4f" }}>Grams</th>
                    <th style={{ border: "1px solid #a0aec0", padding: "6px", fontWeight: 700, textAlign: "center", background: "inherit", color: "#2a4d4f" }}>Price</th>
                    <th style={{ border: "1px solid #a0aec0", padding: "6px", fontWeight: 700, textAlign: "right", background: "inherit", color: "#2a4d4f" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(categoryMap[cat]).map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #a0aec0", padding: "6px", textAlign: "left", background: "#fff" }}>{row.item}</td>
                      <td style={{ border: "1px solid #a0aec0", padding: "6px", textAlign: "center", background: "#fff" }}>{row.pcsKg}</td>
                      <td style={{ border: "1px solid #a0aec0", padding: "6px", textAlign: "center", background: "#fff" }}>{row.unit || "-"}</td>
                      <td style={{ border: "1px solid #a0aec0", padding: "6px", textAlign: "center", background: "#fff" }}>{row.grams ? Number(row.grams).toLocaleString() : "0"}</td>
                      <td style={{ border: "1px solid #a0aec0", padding: "6px", textAlign: "center", background: "#fff" }}>{row.price}</td>
                      <td style={{ border: "1px solid #a0aec0", padding: "6px", textAlign: "right", fontWeight: 600, background: "#fff" }}>{row.amount ? Number(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#e6f4ea", fontWeight: 700 }}>
                    <td colSpan={5} style={{ border: "1px solid #a0aec0", padding: "10px", textAlign: "right", background: "inherit" }}>Total Amount</td>
                    <td style={{ border: "1px solid #a0aec0", padding: "10px", textAlign: "right", fontWeight: 700, background: "inherit" }}>{categorySummary[cat].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))
      )}
      {/* Counted By and Checked By section below tables */}
      <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-start", gap: "4rem", fontSize: "1.1rem", color: "#2a4d4f", fontWeight: 600 }}>
        <div>
          <label htmlFor="countedBy" style={{ marginRight: 8 }}>Counted By:</label>
          <input id="countedBy" type="text" value={countedBy} onChange={e => setCountedBy(e.target.value)} placeholder="Enter name..." style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #a0aec0", fontSize: "1rem", minWidth: "180px" }} />
        </div>
        <div>
          <label htmlFor="checkedBy" style={{ marginRight: 8 }}>Checked By:</label>
          <input id="checkedBy" type="text" value={checkedBy} onChange={e => setCheckedBy(e.target.value)} placeholder="Enter name..." style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #a0aec0", fontSize: "1rem", minWidth: "180px" }} />
        </div>
      </div>
      <style>{`
        @media print {
          @page {
            size: legal portrait;
            margin: 0in 0.3in 0.3in 0.3in;
          }
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          #__next, #__next > div, .print-area, .quick-print-bg, .quick-print-card {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .quick-print-title {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .quick-print-card {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .quick-print-logo-wrap {
            margin-top: 0 !important;
            margin-bottom: 4px !important;
          }
          .quick-print-logo {
            height: 48px !important;
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
          .route-icon, .print-btn, .download-btn, .no-print, button, .filter-controls {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
