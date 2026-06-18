import React, { useState } from "react";

const TimeTableManage = () => {
  const [slots, setSlots] = useState(JSON.parse(localStorage.getItem("global_timetable")) || []);
  const [viewFinal, setViewFinal] = useState(false);

  const updateSlot = (id, field, value) => {
    const updated = slots.map(s => s.id === id ? { ...s, [field]: value } : s);
    setSlots(updated);
    localStorage.setItem("global_timetable", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>📅 Advanced TimeTable Architect</h2>
        <button onClick={() => setViewFinal(!viewFinal)} style={{ background: "#2563eb", color: "white" }}>
          {viewFinal ? "Hide Final Table" : "View Final TimeTable"}
        </button>
      </div>

      {!viewFinal ? (
        <div style={{ marginTop: "20px" }}>
          {slots.map(s => (
            <div key={s.id} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input placeholder="Day" value={s.day} onChange={(e) => updateSlot(s.id, 'day', e.target.value)} />
              <input placeholder="Time" value={s.time} onChange={(e) => updateSlot(s.id, 'time', e.target.value)} />
              <input placeholder="Subject" value={s.subject} onChange={(e) => updateSlot(s.id, 'subject', e.target.value)} />
              <input placeholder="Teacher" value={s.teacher} onChange={(e) => updateSlot(s.id, 'teacher', e.target.value)} />
              <button onClick={() => setSlots(slots.filter(x => x.id !== s.id))}>Delete</button>
            </div>
          ))}
          <button onClick={() => setSlots([...slots, { id: Date.now(), day: "", time: "", subject: "", teacher: "" }])}>+ Add New Slot</button>
        </div>
      ) : (
        <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
          <tr style={{ background: "#eee" }}><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th></tr>
          {slots.map(s => <tr key={s.id} style={{borderBottom:"1px solid #ddd"}}><td>{s.day}</td><td>{s.time}</td><td>{s.subject}</td><td>{s.teacher}</td></tr>)}
        </table>
      )}
    </div>
  );
};
export default TimeTableManage;