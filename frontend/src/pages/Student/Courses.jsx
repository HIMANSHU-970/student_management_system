import React, { useState, useEffect } from "react";

const Courses = () => {
  // Initialize state directly from localStorage so data persists and syncs
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("global_courses");
    if (saved) return JSON.parse(saved);
    // Default initial mock data if localStorage is empty
    return [
      { id: 1, code: "CS-301", name: "DBMS", totalClasses: 30, topics: ["Indexing", "Normalization", "Transactions"] },
      { id: 2, code: "CS-302", name: "DSA", totalClasses: 35, topics: ["Arrays", "Graphs", "Dynamic Programming"] },
      { id: 3, code: "CS-303", name: "Web Dev", totalClasses: 40, topics: ["React Hooks", "Express Routing", "MongoDB aggregation"] }
    ];
  });
  
  const [newSubName, setNewSubName] = useState("");
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubTotalClasses, setNewSubTotalClasses] = useState(30);
  const [topicInputs, setTopicInputs] = useState({});

  // Pomodoro States Engine
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sync with localStorage every time subjects state updates
  useEffect(() => {
    localStorage.setItem("global_courses", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      alert("⏰ Time's up! Take a short break, Himanshu.");
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const addSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;
    
    const newSubject = { 
      id: Date.now(), 
      code: newSubCode.trim().toUpperCase(),
      name: newSubName.trim(), 
      totalClasses: parseInt(newSubTotalClasses) || 30,
      topics: [] 
    };

    setSubjects([...subjects, newSubject]);
    setNewSubName("");
    setNewSubCode("");
    setNewSubTotalClasses(30);
  };

  const addTopic = (subId) => {
    const text = topicInputs[subId];
    if (!text || !text.trim()) return;
    
    setSubjects(subjects.map(s => s.id === subId ? { ...s, topics: [...s.topics, text.trim()] } : s));
    setTopicInputs({ ...topicInputs, [subId]: "" });
  };

  const deleteSubject = (subId) => {
    if (window.confirm("Kya aap is subject ko system se delete karna chahte hain?")) {
      setSubjects(subjects.filter(s => s.id !== subId));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "30px", fontFamily: "sans-serif" }}>
      
      {/* LEFT PORT: SUBJECT MANAGEMENT SYSTEM */}
      <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", margin: "0 0 20px 0" }}>📚 Course Subjects & Target Topics (Admin View)</h2>
        
        {/* ENHANCED FORM TO INCLUDE CODE & TOTAL CLASSES */}
        <form onSubmit={addSubject} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "25px", backgroundColor: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
          <h4 style={{ margin: "0 0 5px 0" }}>Create Structural Subject Module</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="text" placeholder="Code (e.g. CS-301)" value={newSubCode} onChange={e => setNewSubCode(e.target.value)} style={inputStyle} required />
            <input type="text" placeholder="Subject Name" value={newSubName} onChange={e => setNewSubName(e.target.value)} style={inputStyle} required />
            <input type="number" placeholder="Total Classes" value={newSubTotalClasses} onChange={e => setNewSubTotalClasses(e.target.value)} style={{ ...inputStyle, flex: 0.5 }} required />
          </div>
          <button type="submit" style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "5px" }}>
            + Commit & Deploy Subject
          </button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {subjects.map(sub => (
            <div key={sub.id} style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", position: "relative" }}>
              
              <button onClick={() => deleteSubject(sub.id)} style={deleteBtnStyle}>Delete</button>

              <span style={{ backgroundColor: "#eff6ff", color: "#2563eb", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", fontFamily: "monospace" }}>{sub.code}</span>
              <h3 style={{ margin: "8px 0 4px 0", color: "#1e293b", fontSize: "1.15rem", fontWeight: "700" }}>{sub.name}</h3>
              <p style={{ margin: "0 0 12px 0", fontSize: "0.8rem", color: "#64748b" }}>Scope Plan: {sub.totalClasses} Lectures</p>
              
              <h4 style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#475569" }}>Topics Syllabus:</h4>
              <ul style={{ margin: "0 0 15px 0", paddingLeft: "20px", color: "#475569", lineHeight: "1.6", fontSize: "0.9rem" }}>
                {sub.topics && sub.topics.map((t, idx) => <li key={idx}>{t}</li>)}
                {(!sub.topics || sub.topics.length === 0) && <li style={{ color: "#94a3b8", listStyleType: "none", marginLeft: "-20px" }}>No topics added yet.</li>}
              </ul>

              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" placeholder="Add topic line..." value={topicInputs[sub.id] || ""} onChange={e => setTopicInputs({ ...topicInputs, [sub.id]: e.target.value })} style={{ ...inputStyle, padding: "6px 12px", fontSize: "0.85rem" }} />
                <button onClick={() => addTopic(sub.id)} style={{ backgroundColor: "#10b981", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>+ Add Topic</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PORT: PREMIUM POMODORO TIMER ENGINE */}
      <div style={{ backgroundColor: "#0f172a", padding: "35px", borderRadius: "16px", color: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "fit-content" }}>
        <div style={{ fontSize: "0.8rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "1.5px", marginBottom: "10px" }}>FOCUS SESSION</div>
        <h2 style={{ margin: "0 0 25px 0", fontSize: "1.35rem" }}>⏱️ Pomodoro Counter</h2>
        
        <div style={{ fontSize: "5rem", fontWeight: "900", fontFamily: "monospace", color: "#f59e0b", margin: "10px 0 30px 0" }}>
          {formatTime(timeLeft)}
        </div>

        <div style={{ display: "flex", gap: "12px", width: "100%" }}>
          <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ flex: 1, backgroundColor: isTimerRunning ? "#ef4444" : "#10b981", color: "white", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
            {isTimerRunning ? "⏸️ Pause Engine" : "▶️ Start Focus"}
          </button>
          <button onClick={() => { setIsTimerRunning(false); setTimeLeft(25 * 60); }} style={{ backgroundColor: "#334155", color: "white", border: "none", padding: "0 18px", borderRadius: "8px", fontWeight: "700", cursor: "pointer" }}>
            🔄 Reset
          </button>
        </div>
      </div>

    </div>
  );
};

const inputStyle = { flex: 1, padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box", outline: "none" };
const deleteBtnStyle = { position: "absolute", top: "20px", right: "20px", backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700" };

export default Courses;