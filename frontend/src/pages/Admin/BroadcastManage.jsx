import React, { useState } from "react";

const BroadcastManage = () => {
  const [broadcasts, setBroadcasts] = useState(() => JSON.parse(localStorage.getItem("global_broadcasts")) || []);
  const [msg, setMsg] = useState({ meta: "", message: "" });

  const handlePublish = (e) => {
    e.preventDefault();
    const updated = [{ id: Date.now(), date: new Date().toISOString().split('T')[0], ...msg }, ...broadcasts];
    setBroadcasts(updated);
    localStorage.setItem("global_broadcasts", JSON.stringify(updated));
    setMsg({ meta: "", message: "" });
  };

  const handleDelete = (id) => {
    const updated = broadcasts.filter(b => b.id !== id);
    setBroadcasts(updated);
    localStorage.setItem("global_broadcasts", JSON.stringify(updated));
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>📢 Central Broadcast Signal Hub</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px", marginTop: "20px" }}>
        <form onSubmit={handlePublish} style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h4>Dispatch Announcement</h4>
          <input type="text" placeholder="Department / Meta Label" value={msg.meta} onChange={e=>setMsg({...msg, meta:e.target.value})} style={{ width:"100%", padding:"10px", marginBottom:"10px" }} required />
          <textarea placeholder="Notice Body" value={msg.message} onChange={e=>setMsg({...msg, message:e.target.value})} style={{ width:"100%", height:"100px", padding:"10px", marginBottom:"10px" }} required />
          <button type="submit" style={{ width:"100%", padding:"10px", backgroundColor:"#0284c7", color:"white", border:"none", borderRadius:"6px", fontWeight:"700" }}>Broadcast</button>
        </form>

        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h4>Live Signal History</h4>
          {broadcasts.map(b => (
            <div key={b.id} style={{ padding: "12px", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: "0.75rem", background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "4px" }}>{b.meta}</span>
              <p style={{ margin: "5px 0" }}>{b.message}</p>
              <button onClick={() => handleDelete(b.id)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer", fontSize: "0.8rem", padding: 0 }}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BroadcastManage;