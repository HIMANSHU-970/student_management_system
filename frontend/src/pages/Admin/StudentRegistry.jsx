import React, { useState, useEffect } from "react";

const StudentRegistry = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("student");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("student");

  // Load users from system_users on component mount
  useEffect(() => {
    const systemUsers = JSON.parse(localStorage.getItem("system_users")) || [];
    setUsers(systemUsers);
  }, []);

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("⚠️ Sabhi fields bharna compulsory hai.");
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem("system_users")) || [];
    const emailExists = allUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    
    if (emailExists) {
      alert("❌ Yeh Email already registered hai!");
      return;
    }

    const newUser = {
      id: "usr-" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: targetRole,
      createdAt: new Date().toISOString()
    };

    // 1. Save to master user list (Login ke liye)
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem("system_users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // 2. Agar student hai, toh separate list mein bhi dalen (Operational purposes ke liye)
    if (targetRole === "student") {
      const studentsList = JSON.parse(localStorage.getItem("global_students")) || [];
      studentsList.push({ 
        id: newUser.id, 
        name: newUser.name, 
        attendance: 0, 
        totalClasses: 30, 
        feeStatus: "Unpaid" 
      });
      localStorage.setItem("global_students", JSON.stringify(studentsList));
    }

    setName(""); setEmail(""); setPassword("");
    alert(`🎉 ${targetRole.toUpperCase()} account successfully created!`);
  };

  const deleteUser = (userId, userRole) => {
    if (userId === "admin-master-01") {
      alert("❌ System Violation: Master account cannot be deleted.");
      return;
    }
    
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem("system_users", JSON.stringify(updatedUsers));

    if (userRole === "student") {
      const studentsList = JSON.parse(localStorage.getItem("global_students")) || [];
      const filtered = studentsList.filter(s => s.id !== userId);
      localStorage.setItem("global_students", JSON.stringify(filtered));
    }
  };

  const filteredUsers = users.filter(u => u.role === activeTab);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <div style={{ marginBottom: "25px" }}>
        <h2 style={{ color: "#0f172a", fontWeight: "800", margin: 0 }}>👥 Authorized Campus User Matrix</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "30px" }}>
        
        {/* FORM */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ marginBottom: "15px" }}>🔒 Privileged Provisioning</h3>
          <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <select value={targetRole} onChange={e => setTargetRole(e.target.value)} style={inputStyle}>
              <option value="student">Student Account</option>
              <option value="admin">Admin Officer Account</option>
            </select>
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            <button type="submit" style={btnStyle}>Deploy User</button>
          </form>
        </div>

        {/* TABLE */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <button onClick={() => setActiveTab("student")} style={tabStyle(activeTab === "student")}>Students</button>
            <button onClick={() => setActiveTab("admin")} style={tabStyle(activeTab === "admin")}>Admins</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <button onClick={() => deleteUser(user.id, user.role)} style={delBtn}>Terminate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Styles
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #cbd5e1", borderRadius: "8px", boxSizing: "border-box" };
const btnStyle = { backgroundColor: "#2563eb", color: "white", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700" };
const thStyle = { padding: "12px", fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b" };
const tdStyle = { padding: "12px", fontSize: "0.9rem" };
const delBtn = { backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" };
const tabStyle = (active) => ({ backgroundColor: active ? "#0f172a" : "#f1f5f9", color: active ? "white" : "#64748b", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" });

export default StudentRegistry;