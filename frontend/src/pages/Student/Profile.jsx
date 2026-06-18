import React, { useState } from "react";

const Profile = () => {
  const role = localStorage.getItem("role") || "student";
  const [avatar, setAvatar] = useState(localStorage.getItem(`${role}_avatar`) || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setAvatar(base64Data);
        localStorage.setItem(`${role}_avatar`, base64Data);
        window.dispatchEvent(new Event("storage"));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", color: "#0f172a", fontWeight: "800", margin: 0 }}>👤 Identity Specification Profile</h1>
        <p style={{ color: "#64748b", margin: "5px 0 0 0" }}>Manage credential avatars and verified enrollment parameters.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "30px" }}>
        {/* AVATAR DEPLOYMENT ELEMENT WITH PERSISTENCE */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", backgroundColor: "#0f172a", marginBottom: "20px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #f1f5f9" }}>
            {avatar ? (
              <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ color: "white", fontSize: "2.5rem", fontWeight: "800" }}>U</div>
            )}
          </div>
          
          <label style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", textAlign: "center", display: "inline-block" }}>
            📸 Upload Image Node
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </label>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "8px" }}>Image data automatically saves across system sessions.</span>
        </div>

        {/* STATIC ROSTER SHEET */}
        <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ margin: "0 0 20px 0", color: "#0f172a", fontSize: "1.25rem", fontWeight: "800" }}>Registrar Core Parameters</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            <div>
              <span style={labelStyle}>MEMBER PROFILE ID</span>
              <div style={valueStyle}>STU-2026-084</div>
            </div>
            <div>
              <span style={labelStyle}>ROUTING ACCESS TOKEN</span>
              <div style={valueStyle}>{role.toUpperCase()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const labelStyle = { display: "block", fontSize: "0.75rem", fontWeight: "800", color: "#64748b", marginBottom: "6px" };
const valueStyle = { padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9", fontSize: "0.95rem", fontWeight: "700", color: "#1e293b" };

export default Profile;