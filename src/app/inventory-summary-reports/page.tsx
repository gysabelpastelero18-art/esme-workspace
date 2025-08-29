"use client";
import { useEffect, useState } from "react";
import html2canvas from "html2canvas";

export default function InventorySummaryReports() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [dateEncoded, setDateEncoded] = useState(todayStr);
  const [tableData, setTableData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [group, setGroup] = useState("");
  // ...existing code...

  // Group data by branch and department (after tableData is initialized)
  function getBranchDepartmentData(branchName: string) {
    const filtered = (Array.isArray(tableData) ? tableData : []).filter(row => row.branch === branchName);
    const deptMap: Record<string, number> = {};
    filtered.forEach(row => {
      const dept = row.department || "Unspecified";
      deptMap[dept] = (deptMap[dept] || 0) + (parseFloat(row.amount) || 0);
    });
    return deptMap;
  }
  const mayonDeptData = getBranchDepartmentData("Mayon");
  const baleteDeptData = getBranchDepartmentData("One Balete");

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

  // Branch Comparison: sum amounts per branch
  const branchTotals: Record<string, number> = {};
  (Array.isArray(tableData) ? tableData : []).forEach(row => {
    const branchName = row.branch || "Unknown";
    branchTotals[branchName] = (branchTotals[branchName] || 0) + (parseFloat(row.amount) || 0);
  });

  // Amounts per Department: sum amounts per department
  const departmentTotals: Record<string, number> = {};
  (Array.isArray(tableData) ? tableData : []).forEach(row => {
    const deptName = row.department || "Unknown";
    departmentTotals[deptName] = (departmentTotals[deptName] || 0) + (parseFloat(row.amount) || 0);
  });

  return (
    <div id="inventory-summary-reports" style={{ background: "white", padding: "0 2rem 2rem 2rem", minHeight: "100vh", fontFamily: "Segoe UI, Arial, sans-serif", color: "#2a4d4f" }}>
      <div className="header-responsive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #38b2ac', paddingBottom: '1rem', flexWrap: 'nowrap' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.7rem' }}>
            <button
              onClick={() => window.location.href = '/reports'}
              style={{ background: 'none', border: 'none', color: '#3182ce', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginRight: '1rem', padding: '0.3rem 0.7rem', borderRadius: '6px', transition: 'background 0.2s' }}
              onMouseOver={e => (e.currentTarget.style.background = '#e6f4ea')}
              onMouseOut={e => (e.currentTarget.style.background = 'none')}
            >
              ← Back to Reports
            </button>
            <button
              onClick={async () => {
                const html2canvas = (await import('html2canvas')).default;
                const reportElement = document.getElementById('inventory-summary-reports');
                if (reportElement) {
                  html2canvas(reportElement, { scale: 2 }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `inventory-summary-${new Date().toISOString().slice(0,10)}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  });
                }
              }}
              style={{ background: "#3182ce", color: "white", padding: "0.6rem 1.1rem", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", boxShadow: "0 2px 8px rgba(49,130,206,0.15)", border: "none", cursor: "pointer", marginRight: '0.7rem' }}
            >
              Download as Image
            </button>
            <button
              onClick={() => window.print()}
              style={{ background: "linear-gradient(90deg,#3182ce,#38b2ac)", color: "white", padding: "0.6rem 1.1rem", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", boxShadow: "0 2px 8px rgba(49,130,206,0.15)", border: "none", cursor: "pointer" }}
            >
              Print
            </button>
          </div>
          <img src="/images/logo.png" alt="Logo" style={{ height: 44, minWidth: 44, filter: "drop-shadow(0 2px 6px #38b2ac88)", marginBottom: '0.3rem' }} />
          <span style={{ fontWeight: 800, fontSize: '1.7rem', color: '#2a4d4f', letterSpacing: '2px', fontFamily: 'Segoe UI, Arial, sans-serif', textAlign: 'center' }}>Esmeralda</span>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#2a4d4f", letterSpacing: '1px', whiteSpace: 'nowrap', textAlign: 'center' }}>Inventory Summary Reports</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .header-responsive {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.7rem !important;
          }
          .header-responsive > div {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.7rem !important;
          }
          .header-responsive button {
            width: 100% !important;
            margin-bottom: 0.5rem !important;
          }
          .header-responsive img {
            height: 32px !important;
            min-width: 32px !important;
            margin-bottom: 0.3rem !important;
          }
          .header-responsive span {
            font-size: 1.1rem !important;
            text-align: center !important;
            width: 100% !important;
          }
        }
      `}</style>
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
      </div>
      <style>{`
        @media print {
          @page {
            size: legal portrait;
            margin: 0.5in 0.5in 1.63in 0.5in;
          }
          body, #inventory-summary-reports {
            zoom: 0.8;
          }
          button, .route-icon, .filter-controls { display: none !important; }
        }
      `}</style>
      {/* Branch Department Comparison Tables */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          marginBottom: "2rem",
          flexWrap: "wrap"
        }}
        className="branch-tables-responsive"
      >
        {/* Mayon Table */}
  <div style={{ flex: 1, minWidth: 320 }}>
          <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem", color: "#2a4d4f", letterSpacing: "0.5px" }}>Mayon</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 320, borderCollapse: "collapse", tableLayout: "fixed", boxShadow: "0 2px 8px rgba(49,130,206,0.08)", background: "#f8fafc", borderRadius: "8px", overflow: "hidden", fontSize: "1rem" }}>
              <colgroup>
                <col style={{ width: "60%" }} />
                <col style={{ width: "40%" }} />
              </colgroup>
              <thead>
                <tr style={{ background: "#e6f4ea" }}>
                  <th style={{ border: "1px solid #a0aec0", padding: "8px", fontWeight: 700, textAlign: "left", color: "#2a4d4f" }}>Department</th>
                  <th style={{ border: "1px solid #a0aec0", padding: "8px", fontWeight: 700, textAlign: "right", color: "#2a4d4f" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(mayonDeptData).map(dept => (
                  <tr key={dept}>
                    <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "left", background: "#fff", wordBreak: "break-word" }}>{dept}</td>
                    <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "right", fontWeight: 600, background: "#fff" }}>{mayonDeptData[dept].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#e6f4ea", fontWeight: 700 }}>
                  <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "right" }}>Total</td>
                  <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "right", fontWeight: 700 }}>
                    {Object.values(mayonDeptData).reduce((sum, amt) => sum + amt, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        {/* One Balete Table */}
  <div style={{ flex: 1, minWidth: 320 }}>
          <h3 style={{ fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.7rem", color: "#2a4d4f", letterSpacing: "0.5px" }}>One Balete</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 320, borderCollapse: "collapse", tableLayout: "fixed", boxShadow: "0 2px 8px rgba(49,130,206,0.08)", background: "#f8fafc", borderRadius: "8px", overflow: "hidden", fontSize: "1rem" }}>
              <colgroup>
                <col style={{ width: "60%" }} />
                <col style={{ width: "40%" }} />
              </colgroup>
              <thead>
                <tr style={{ background: "#e6f4ea" }}>
                  <th style={{ border: "1px solid #a0aec0", padding: "8px", fontWeight: 700, textAlign: "left", color: "#2a4d4f" }}>Department</th>
                  <th style={{ border: "1px solid #a0aec0", padding: "8px", fontWeight: 700, textAlign: "right", color: "#2a4d4f" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(baleteDeptData).map(dept => (
                  <tr key={dept}>
                    <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "left", background: "#fff", wordBreak: "break-word" }}>{dept}</td>
                    <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "right", fontWeight: 600, background: "#fff" }}>{baleteDeptData[dept].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#e6f4ea", fontWeight: 700 }}>
                  <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "right" }}>Total</td>
                  <td style={{ border: "1px solid #a0aec0", padding: "8px", textAlign: "right", fontWeight: 700 }}>
                    {Object.values(baleteDeptData).reduce((sum, amt) => sum + amt, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .branch-tables-responsive {
            flex-direction: column !important;
          }
        }
      `}</style>
      {/* Amounts per Department Table */}
    </div>
  );
}
