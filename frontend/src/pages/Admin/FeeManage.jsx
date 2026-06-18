import React, { useState } from "react";

const FeeManage = () => {
  const [fees, setFees] = useState(JSON.parse(localStorage.getItem("fee_ledger")) || [
    { id: 1, label: "Year 1 Fee", amount: 250000, status: "Paid" }
  ]);

  const updateFee = (id, field, value) => {
    const updated = fees.map(f => f.id === id ? { ...f, [field]: value } : f);
    setFees(updated);
    localStorage.setItem("fee_ledger", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>💳 Institutional Fee Ledger Overrides</h2>
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
        {fees.map(f => (
          <div key={f.id} style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: "center" }}>
            <input value={f.label} onChange={(e) => updateFee(f.id, 'label', e.target.value)} style={{ padding: "8px", flex: 2 }} />
            <input type="number" value={f.amount} onChange={(e) => updateFee(f.id, 'amount', e.target.value)} style={{ padding: "8px", flex: 1 }} />
            <select value={f.status} onChange={(e) => updateFee(f.id, 'status', e.target.value)} style={{ padding: "8px" }}>
              <option>Paid</option><option>Pending</option><option>Unpaid</option>
            </select>
          </div>
        ))}
        <button onClick={() => setFees([...fees, { id: Date.now(), label: "New Term", amount: 0, status: "Pending" }])} style={{ background: "#2563eb", color: "white", padding: "10px", borderRadius: "6px", border: "none" }}>+ Add Entry</button>
      </div>
    </div>
  );

};
export default FeeManage;