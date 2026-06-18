import React, { useState, useEffect } from "react";

const Fees = () => {
  const currentRole = localStorage.getItem("role") || "student";

  const [invoices, setInvoices] = useState(() => {
    const cached = localStorage.getItem("global_invoices");
    return cached ? JSON.parse(cached) : [
      { id: "INV-2026-01", term: "Year 1 Academic Fee Pass", amount: "₹2,50,000", status: "Paid", color: "#10b981" },
      { id: "INV-2026-02", term: "Year 2 Academic Fee Pass", amount: "₹2,50,000", status: "Paid", color: "#10b981" },
      { id: "INV-2026-03", term: "Year 3 Academic Fee Pass", amount: "₹2,50,000", status: "Pending", color: "#f59e0b" },
      { id: "INV-2026-04", term: "Year 4 Academic Fee Pass", amount: "₹2,50,000", status: "Unpaid", color: "#ef4444" }
    ];
  });

  useEffect(() => {
    const syncDatabase = () => {
      const cached = localStorage.getItem("global_invoices");
      if (cached) setInvoices(JSON.parse(cached));
    };
    window.addEventListener("storage", syncDatabase);
    return () => window.removeEventListener("storage", syncDatabase);
  }, []);

  const toggleInvoiceStatus = (id) => {
    if (currentRole !== "admin") {
      alert("Security Access Violation: Status modification keys are reserved for Root Administrators.");
      return;
    }
    const modified = invoices.map(inv => {
      if (inv.id === id) {
        let nextStatus = inv.status === "Paid" ? "Pending" : inv.status === "Pending" ? "Unpaid" : "Paid";
        let nextColor = nextStatus === "Paid" ? "#10b981" : nextStatus === "Pending" ? "#f59e0b" : "#ef4444";
        return { ...inv, status: nextStatus, color: nextColor };
      }
      return inv;
    });
    setInvoices(modified);
    localStorage.setItem("global_invoices", JSON.stringify(modified));
  };

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: "800", margin: 0 }}>💳 Fee Management Terminal</h1>
        <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Review formal billing disbursements and gross outstanding invoices.</p>
      </div>

      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "1.25rem", fontWeight: "800" }}>📄 Institutional Billing Distribution</h3>
        {currentRole === "admin" && (
          <p style={{ color: "#2563eb", fontSize: "0.85rem", margin: "-15px 0 20px 0", fontWeight: "600" }}>⚡ Admin Privilege Active: Click status pills to toggle invoice state.</p>
        )}
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {invoices.map(inv => (
            <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <div>
                <h4 style={{ margin: 0, color: "#1e293b", fontSize: "1rem", fontWeight: "700" }}>{inv.term}</h4>
                <span style={{ fontSize: "0.8rem", color: "#94a3b8", fontFamily: "monospace" }}>{inv.id}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>{inv.amount}</span>
                <button onClick={() => toggleInvoiceStatus(inv.id)} style={{
                  backgroundColor: inv.color, color: "white", border: "none", padding: "6px 14px",
                  borderRadius: "20px", fontWeight: "700", fontSize: "0.8rem", cursor: currentRole === "admin" ? "pointer" : "default", minWidth: "85px"
                }}>
                  {inv.status}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fees;