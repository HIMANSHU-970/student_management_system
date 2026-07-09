import React, { useState, useEffect } from "react";
import { signupUser } from "../../services/authService";
import { getAllUsers, deleteUser as deleteUserAPI,resetPassword } from "../../services/adminService";
// Assuming you might have an api helper, if not, adjust the resetPassword call accordingly

const StudentRegistry = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
      localStorage.setItem('student_management_data', JSON.stringify(res.data));
    } catch (err) {
      console.error("Load users error:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Professional Reset Password Logic
  const handleResetPassword = async (userId) => {
  const newPassword = prompt("Enter new password for this user:");
  if (!newPassword || newPassword.trim() === "") return;

  try {
    // Ab aap direct function call kar sakte hain
    await resetPassword(userId, newPassword); 
    alert("✅ Password reset successfully!");
  } catch (err) {
    alert("❌ Failed to reset password: " + (err.response?.data?.message || "Error"));
  }
};

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("⚠️ Sabhi fields bharna compulsory hai.");
      return;
    }

    setLoading(true);
    try {
      await signupUser({ name: name.trim(), email: email.trim().toLowerCase(), password, role: targetRole });
      alert(`🎉 ${targetRole.toUpperCase()} account successfully created!`);
      setName(""); setEmail(""); setPassword("");
      await loadUsers();
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to create user"));
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Terminate this user?")) return;
    try {
      await deleteUserAPI(userId);
      await loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => u.role === activeTab);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
      <h2>👥 Authorized Campus User Matrix</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "30px" }}>
        
        {/* Form */}
        <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <h3>🔒 Privileged Provisioning</h3>
          <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <select value={targetRole} onChange={e => setTargetRole(e.target.value)} style={inputStyle}>
              <option value="student">Student Account</option>
              <option value="admin">Admin Officer Account</option>
            </select>
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            <button type="submit" disabled={loading} style={btnStyle}>{loading ? "Deploying..." : "Deploy User"}</button>
          </form>
        </div>

        {/* Table */}
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
                <th style={thStyle}>Credentials</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <button 
                      onClick={() => handleResetPassword(user.id)} 
                      style={resetBtn}
                    >
                      Reset Password
                    </button>
                  </td>
                  <td style={tdStyle}>
                    <button onClick={() => deleteUser(user.id)} style={delBtn}>Terminate</button>
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
const resetBtn = { backgroundColor: "#fef3c7", color: "#92400e", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" };
const thStyle = { padding: "12px", fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", textAlign: "left" };
const tdStyle = { padding: "12px", fontSize: "0.9rem" };
const delBtn = { backgroundColor: "#fee2e2", color: "#ef4444", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer" };
const tabStyle = (active) => ({ backgroundColor: active ? "#0f172a" : "#f1f5f9", color: active ? "white" : "#64748b", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" });

export default StudentRegistry;