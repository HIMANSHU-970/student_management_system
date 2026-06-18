import React from "react";

const StudentTimeTable = () => {
  // Safe parsing: agar data na ho toh khali array return karega
  const getTimetable = () => {
    try {
      const data = localStorage.getItem("global_timetable");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  const timetable = getTimetable();

  return (
    <div style={{ padding: "20px", background: "#f8fafc", minHeight: "100vh" }}>
      <h2>🕒 Class Schedule</h2>
      {timetable.length === 0 ? (
        <p>No schedule uploaded by Admin yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", background: "white" }}>
          <thead>
            <tr style={{ background: "#0f172a", color: "white" }}>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Day</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Time</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Subject</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((s, idx) => (
              <tr key={idx} style={{ textAlign: "center" }}>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.day}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.time}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.subject}</td>
                <td style={{ padding: "12px", border: "1px solid #ddd" }}>{s.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentTimeTable;