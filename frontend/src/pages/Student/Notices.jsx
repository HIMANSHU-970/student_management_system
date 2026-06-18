import React, { useEffect, useState } from "react";
// 1. सही तरीके से नामित ऑब्जेक्ट (studentService) को इम्पोर्ट करें
import { studentService } from "../../services/studentService";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. studentService के अंदर से getNotices फंक्शन को कॉल करें
    studentService.getNotices()
      .then((data) => {
        // चूंकि आपके सर्विस में पहले से 'return res.data' है, इसलिए यहाँ सीधे 'data' मिलेगा
        setNotices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notices:", err);
        setError("नोटिस लोड करने में समस्या आ रही है।");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-5">लोड हो रहा है...</div>;
  if (error) return <div className="text-red-500 text-center p-5">{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        📢 Digital Notice Board
      </h2>

      {notices.length === 0 ? (
        <p className="text-gray-500">अभी कोई नया नोटिस नहीं है।</p>
      ) : (
        notices.map((n) => (
          <div 
            key={n.id} 
            className="card" 
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              backgroundColor: "#fff"
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#1e293b", fontSize: "1.2rem" }}>
              {n.title}
            </h4>
            {/* बैकएंड मॉडल के अनुसार content फ़ील्ड का उपयोग करें */}
            <p style={{ color: "#475569", margin: 0, lineHeight: "1.5" }}>
              {n.content || n.message}
            </p>
            {n.createdAt && (
              <small style={{ color: "#94a3b8", display: "block", marginTop: "10px" }}>
                Posted on: {new Date(n.createdAt).toLocaleDateString()}
              </small>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notices;