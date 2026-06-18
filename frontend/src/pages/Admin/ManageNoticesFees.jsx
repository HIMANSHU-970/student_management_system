import React, { useState } from "react";

const ManageNoticesFees = () => {
  const [notices, setNotices] = useState([
    { id: 1, title: "End Semester Exams Schedule", date: "2026-06-15", target: "All Students" },
    { id: 2, title: "Lab Maintenance Notice", date: "2026-06-12", target: "CSE Department" }
  ]);

  const [newNotice, setNewNotice] = useState({ title: "", target: "All Students" });

  const handlePostNotice = (e) => {
    e.preventDefault();
    const notice = {
      id: Date.now(),
      title: newNotice.title,
      date: new Date().toISOString().split('T')[0],
      target: newNotice.target
    };
    setNotices([notice, ...notices]);
    setNewNotice({ title: "", target: "All Students" });
    alert("📢 Global Notice Transmitted!");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
      {/* LEFT COLUMN: BROADCAST INFRASTRUCTURE */}
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", margin: "0 0 20px 0" }}>📢 Broadcast Institutional Notice</h2>
        <form onSubmit={handlePostNotice} style={{ marginBottom: "30px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "6px" }}>Notice Headline</label>
            <input type="text" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} placeholder="Type emergency bulletin here..." required style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "6px" }}>Target Audience</label>
            <select value={newNotice.target} onChange={e => setNewNotice({...newNotice, target: e.target.value})} style={{ width: "100%", padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
              <option value="All Students">All Students 🎓</option>
              <option value="Faculty Only">Faculty Only 👨‍🏫</option>
              <option value="CSE Department">CSE Department Only 💻</option>
            </select>
          </div>
          <button type="submit" style={{ width: "100%", backgroundColor: "#10b981", color: "white", padding: "12px", border: "none", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>Transmit Announcement</button>
        </form>

        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "15px" }}>Active Live Bulletins</h3>
        {notices.map(n => (
          <div key={n.id} style={{ backgroundColor: "#f8fafc", padding: "15px", borderRadius: "10px", marginBottom: "10px", borderLeft: "4px solid #10b981" }}>
            <h4 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>{n.title}</h4>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>Issued: {n.date} | Scope: {n.target}</span>
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN: INSTITUTIONAL INVOICE FLOW */}
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", margin: "0 0 20px 0" }}>💳 Ledger & Financial Invoices</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", justifyContent: "between", padding: "15px", backgroundColor: "#fef3c7", borderRadius: "12px" }}>
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#92400e" }}>Academic Registration Defaulters</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#b45309" }}>Pending financial clearings for current batch.</p>
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#b45309" }}>42</span>
          </div>

          <div style={{ display: "flex", justifyContent: "between", padding: "15px", backgroundColor: "#ecfdf5", borderRadius: "12px" }}>
            <div>
              <h4 style={{ margin: "0 0 5px 0", color: "#065f46" }}>Gross Revenue Inflow Today</h4>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#047857" }}>Consolidated fee transactions via online banking.</p>
            </div>
            <span style={{ fontSize: "1.5rem", fontWeight: "800", color: "#047857" }}>$5,240</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNoticesFees;