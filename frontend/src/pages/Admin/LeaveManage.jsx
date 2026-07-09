import React, { useState, useEffect } from "react";
import { getAllLeaves, updateLeaveStatus } from "../../services/adminService";
import "../../styles/leave.css";

const LeaveManage = () => {
  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    try {
      const res = await getAllLeaves();
      setLeaves(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadLeaves(); }, []);

  const handleAction = async (id, status) => {
    try {
      await updateLeaveStatus(id, status);
      loadLeaves();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="leave-page">
      <h2>📥 Leave Management</h2>
      <div className="leave-list">
        {leaves.length === 0 && <p style={{ color: "#94a3b8" }}>No leave applications yet.</p>}
        {leaves.map(l => (
          <div key={l.id} className="leave-item">
            <div className="leave-item-info">
              <p><b>{l.student?.name}</b> ({l.student?.email})</p>
              <p>{l.fromDate} to {l.toDate}</p>
              <p>{l.reason}</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className={`leave-status-badge leave-status-${l.status}`}>{l.status}</span>
              {l.status === "Pending" && (
                <>
                  <button onClick={() => handleAction(l.id, "Approved")} style={{ background: "#16a34a", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" }}>Approve</button>
                  <button onClick={() => handleAction(l.id, "Rejected")} style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer" }}>Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveManage;