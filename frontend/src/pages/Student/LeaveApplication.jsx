import React, { useState, useEffect } from "react";
import { studentService } from "../../services/studentService";
import "../../styles/leave.css";

const LeaveApplicationPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ reason: "", fromDate: "", toDate: "" });
  const [msg, setMsg] = useState("");

  const loadLeaves = async () => {
    try {
      const data = await studentService.getMyLeaves();
      setLeaves(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadLeaves(); }, []);

  const handleSubmit = async () => {
    if (!form.reason.trim() || !form.fromDate || !form.toDate) {
      return setMsg("❌ Sab fields required!");
    }
    try {
      await studentService.applyLeave(form);
      setMsg("✅ Leave application submitted!");
      setForm({ reason: "", fromDate: "", toDate: "" });
      loadLeaves();
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.message || "Failed to submit"));
    }
  };

  return (
    <div className="leave-page">
      <h2>📥 Leave Application</h2>

      {msg && <p style={{ color: msg.startsWith("✅") ? "#166534" : "#991b1b", fontWeight: "600" }}>{msg}</p>}

      <div className="leave-card">
        <h3>Apply for Leave</h3>
        <div className="leave-form-grid">
          <textarea className="leave-textarea" placeholder="Reason for leave" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
          <input className="leave-input" type="date" placeholder="From" value={form.fromDate} onChange={e => setForm({...form, fromDate: e.target.value})} />
          <input className="leave-input" type="date" placeholder="To" value={form.toDate} onChange={e => setForm({...form, toDate: e.target.value})} />
          <button className="leave-submit-btn" onClick={handleSubmit}>Submit Application</button>
        </div>
      </div>

      <div className="leave-card">
        <h3>My Leave History</h3>
        <div className="leave-list">
          {leaves.length === 0 && <p style={{ color: "#94a3b8" }}>No leave applications yet.</p>}
          {leaves.map(l => (
            <div key={l.id} className="leave-item">
              <div className="leave-item-info">
                <p><b>{l.fromDate}</b> to <b>{l.toDate}</b></p>
                <p>{l.reason}</p>
              </div>
              <span className={`leave-status-badge leave-status-${l.status}`}>{l.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationPage;