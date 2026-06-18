import React from "react";

const StudentAssignment = () => {
  // Data load karte waqt error handling
  const getAssignments = () => {
    try {
      const data = localStorage.getItem("assignments");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error parsing assignments:", e);
      return [];
    }
  };

  const assignments = getAssignments();

  const downloadFile = (fileData, fileName) => {
    if (!fileData) {
      alert("File data missing!");
      return;
    }
    const link = document.createElement("a");
    link.href = fileData;
    link.download = fileName || "assignment_file";
    document.body.appendChild(link); // Fix: link ko body mein add karna zaruri hai
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📂 Available Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments uploaded yet.</p>
      ) : (
        assignments.map((item) => (
          <div 
            key={item.id || Math.random()} 
            style={{ padding: "10px", border: "1px solid #ddd", marginBottom: "10px", borderRadius: "8px" }}
          >
            <strong>{item.title}</strong>
            <button 
              onClick={() => downloadFile(item.fileData, item.fileName)} 
              style={{ marginLeft: "15px", cursor: "pointer", padding: "5px 10px" }}
            >
              Download
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentAssignment;