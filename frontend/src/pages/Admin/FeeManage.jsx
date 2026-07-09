import React, { useState, useEffect } from "react";
import "../../styles/feeManage.css";

// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

import { generateFeePdf } from "../../utils/feePdfGenerator";

const TERM_OPTIONS = ["Year 1 Fee", "Year 2 Fee", "Year 3 Fee", "Year 4 Fee"];

// Local storage keys
const FEES_STORAGE_KEY = 'fee_management_data';
const STUDENTS_STORAGE_KEY = 'student_management_data';

const FeeManage = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ 
    studentId: "", 
    term: "Year 1 Fee", 
    amount: "", 
    paidAmount: "", 
    dueDate: "" 
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editPaidAmounts, setEditPaidAmounts] = useState({});

  // Initialize default students
  const getDefaultStudents = () => {
    return [
      { id: 1, name: "Rohit", email: "rohit970@gmail.com" },
      { id: 2, name: "Himanshu", email: "himanshukumar82298@gmail.com" },
      { id: 3, name: "Priya", email: "priya@gmail.com" },
      { id: 4, name: "Amit", email: "amit@gmail.com" }
    ];
  };

  // Load data from localStorage
  const loadData = () => {
    try {
      setLoading(true);
      
      let studentsData = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (studentsData) {
        setStudents(JSON.parse(studentsData));
      } else {
        const defaultStudents = getDefaultStudents();
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(defaultStudents));
        setStudents(defaultStudents);
      }

      let feesData = localStorage.getItem(FEES_STORAGE_KEY);
      if (feesData) {
        const parsedFees = JSON.parse(feesData);
        setFees(parsedFees);
        console.log("✅ Loaded fees from localStorage:", parsedFees);
      } else {
        const sampleFees = [
          {
            id: Date.now() + 1,
            studentId: 1,
            term: "Year 1 Fee",
            amount: 148878,
            paidAmount: 0,
            dueDate: "2026-12-31",
            User: { id: 1, name: "Rohit", email: "rohit970@gmail.com" }
          },
          {
            id: Date.now() + 2,
            studentId: 2,
            term: "Year 1 Fee",
            amount: 45321,
            paidAmount: 0,
            dueDate: "2026-12-31",
            User: { id: 2, name: "Himanshu", email: "himanshukumar82298@gmail.com" }
          }
        ];
        localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(sampleFees));
        setFees(sampleFees);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setMsg("❌ Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, []);

  // Save fees to localStorage and broadcast change
  const saveFees = (newFees) => {
    localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify(newFees));
    setFees(newFees);
    localStorage.setItem('fee_update_timestamp', Date.now().toString());
    window.dispatchEvent(new CustomEvent('feeDataUpdated', { detail: newFees }));
    console.log("✅ Fees saved to localStorage:", newFees);
  };

  const handleCreate = () => {
    const { studentId, term, amount, paidAmount, dueDate } = form;
    if (!studentId || !term || !amount || !dueDate) {
      setMsg("❌ Sab fields required!");
      return;
    }

    const student = students.find(s => s.id === Number(studentId));
    if (!student) {
      setMsg("❌ Student not found!");
      return;
    }

    const newFee = {
      id: Date.now(),
      studentId: Number(studentId),
      term,
      amount: Number(amount),
      paidAmount: paidAmount ? Number(paidAmount) : 0,
      dueDate,
      User: student
    };

    const updatedFees = [...fees, newFee];
    saveFees(updatedFees);
    
    setMsg(`✅ Fee assigned successfully to ${student.name}!`);
    setForm({ studentId: "", term: "Year 1 Fee", amount: "", paidAmount: "", dueDate: "" });
    
    setTimeout(() => setMsg(""), 3000);
  };

  const handlePaidAmountChange = (id, newPaid) => {
    const paidValue = Number(newPaid);
    if (isNaN(paidValue) || paidValue < 0) {
      alert("Please enter a valid amount");
      return;
    }

    const feeRecord = fees.find(f => f.id === id);
    if (!feeRecord) return;

    if (paidValue > feeRecord.amount) {
      alert(`Paid amount cannot exceed total fee of ₹${feeRecord.amount}`);
      return;
    }

    const updatedFees = fees.map(f => 
      f.id === id ? { ...f, paidAmount: paidValue } : f
    );
    saveFees(updatedFees);
    
    setMsg("✅ Paid amount updated successfully!");
    setTimeout(() => setMsg(""), 3000);

    if (selectedStudent) {
      const updatedStudent = {
        ...selectedStudent,
        records: selectedStudent.records.map(f => 
          f.id === id ? { ...f, paidAmount: paidValue } : f
        )
      };
      updatedStudent.totalFee = updatedStudent.records.reduce((sum, f) => sum + f.amount, 0);
      updatedStudent.totalPaid = updatedStudent.records.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
      setSelectedStudent(updatedStudent);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this fee record?")) return;
    
    const updatedFees = fees.filter(f => f.id !== id);
    saveFees(updatedFees);
    
    setMsg("✅ Fee record deleted successfully!");
    setTimeout(() => setMsg(""), 3000);
    
    if (selectedStudent) {
      setSelectedStudent(null);
    }
  };

//   const downloadFeeStructure = () => {

//   if (!selectedStudent) {
//     alert("No student selected");
//     return;
//   }

//   try {

//     const doc = new jsPDF();

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(18);
//     doc.text("Student Fee Structure", 14, 18);

//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");

//     doc.text(`Student : ${selectedStudent.student.name}`, 14, 30);
//     doc.text(`Email : ${selectedStudent.student.email}`, 14, 38);
//     doc.text(`Generated : ${new Date().toLocaleDateString()}`, 14, 46);

//     const tableData = selectedStudent.records.map((f) => {

//       const pending = f.amount - (f.paidAmount || 0);

//       return [

//         f.term,

//         `₹${f.amount.toLocaleString()}`,

//         `₹${(f.paidAmount || 0).toLocaleString()}`,

//         `₹${pending.toLocaleString()}`,

//         pending === 0
//           ? "Paid"
//           : pending < f.amount
//           ? "Partial"
//           : "Pending",

//         f.dueDate,

//       ];

//     });

//     autoTable(doc, {

//       startY: 55,

//       head: [[
//         "Term",
//         "Total",
//         "Paid",
//         "Pending",
//         "Status",
//         "Due Date",
//       ]],

//       body: tableData,

//       styles: {
//         halign: "center",
//       },

//       headStyles: {
//         fillColor: [22, 163, 74],
//       },

//     });

//     const finalY = doc.lastAutoTable.finalY + 12;

//     doc.setFontSize(13);

//     doc.text(
//       `Total Fee : ₹${selectedStudent.totalFee.toLocaleString()}`,
//       14,
//       finalY
//     );

//     doc.text(
//       `Paid Fee : ₹${selectedStudent.totalPaid.toLocaleString()}`,
//       14,
//       finalY + 10
//     );

//     doc.text(
//       `Pending Fee : ₹${getPendingAmount(selectedStudent).toLocaleString()}`,
//       14,
//       finalY + 20
//     );

//     doc.save(
//       `${selectedStudent.student.name}_Fee_Structure.pdf`
//     );

//   } catch (err) {

//     console.error(err);

//     alert("PDF Download Failed");

//   }

// };

  const handlePaidInputChange = (id, value) => {
    setEditPaidAmounts({ ...editPaidAmounts, [id]: value });
  };

  const handlePaidKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      const value = editPaidAmounts[id];
      if (value !== undefined) {
        handlePaidAmountChange(id, value);
        setEditPaidAmounts({ ...editPaidAmounts, [id]: '' });
      }
    }
  };

  // Group fees by student
  const groupByStudent = () => {
    const map = {};
    fees.forEach((f) => {
      const sid = f.studentId;
      if (!sid) return;
      if (!map[sid]) {
        map[sid] = { 
          student: f.User || students.find(s => s.id === sid) || { id: sid, name: "Unknown", email: "No email" }, 
          totalFee: 0, 
          totalPaid: 0, 
          records: [] 
        };
      }
      map[sid].totalFee += f.amount;
      map[sid].totalPaid += f.paidAmount || 0;
      map[sid].records.push(f);
    });
    return Object.values(map);
  };

  const grouped = groupByStudent();

  const getPendingAmount = (student) => {
    return student.totalFee - student.totalPaid;
  };

  if (loading) return (
    <div className="fee-loading">
      Loading...
    </div>
  );

  return (
    <div className="fee-page">
      <div className="fee-header">
        <h2>💳 Institutional Fee Ledger</h2>
        <p>Manage fee assignments and track payment status across all students.</p>
        <div className="fee-stats">
          <span>Total Fees: <strong>{fees.length}</strong></span>
          <span>Students: <strong>{students.length}</strong></span>
        </div>
      </div>

      {msg && (
        <div className={`fee-msg ${msg.startsWith("✅") ? "success" : "error"}`}>
          {msg}
        </div>
      )}

      <div className="fee-card">
        <h3>➕ Assign Fee to Student</h3>
        <div className="fee-form-grid">
          <div className="fee-form-group">
            <label>Select Student</label>
            <select 
              className="fee-select" 
              value={form.studentId} 
              onChange={e => setForm({...form, studentId: e.target.value})}
            >
              <option value="">-- Select Student --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </div>
          <div className="fee-form-group">
            <label>Fee Term</label>
            <select 
              className="fee-select" 
              value={form.term} 
              onChange={e => setForm({...form, term: e.target.value})}
            >
              {TERM_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="fee-form-group">
            <label>Total Fee (₹)</label>
            <input 
              className="fee-input" 
              type="number" 
              placeholder="Enter total fee" 
              value={form.amount} 
              onChange={e => setForm({...form, amount: e.target.value})} 
            />
          </div>
          <div className="fee-form-group">
            <label>Paid Fee (₹)</label>
            <input 
              className="fee-input" 
              type="number" 
              placeholder="Enter paid fee" 
              value={form.paidAmount} 
              onChange={e => setForm({...form, paidAmount: e.target.value})} 
            />
          </div>
          <div className="fee-form-group">
            <label>Due Date</label>
            <input 
              className="fee-input" 
              type="date" 
              value={form.dueDate} 
              onChange={e => setForm({...form, dueDate: e.target.value})} 
            />
          </div>
          <div className="fee-form-group fee-form-action">
            <button className="fee-btn-primary" onClick={handleCreate}>
              Assign Fee
            </button>
          </div>
        </div>
      </div>

      <div className="fee-table-wrap">
        <div className="fee-table-header">
          <h3>📊 Fee Records</h3>
          <span className="fee-record-count">{grouped.length} Students</span>
        </div>
        <div className="fee-table-scroll">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Total Fee</th>
                <th>Paid Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {grouped.length === 0 && (
                <tr>
                  <td colSpan="5" className="fee-empty">
                    No fee records yet
                  </td>
                </tr>
              )}
              {grouped.map(g => {
                const pending = getPendingAmount(g);
                const paymentStatus = pending === 0 ? "Paid" : pending < g.totalFee ? "Partial" : "Pending";
                const percentPaid = g.totalFee > 0 ? Math.round((g.totalPaid / g.totalFee) * 100) : 0;
                return (
                  <tr key={g.student.id}>
                    <td>
                      <div className="fee-student-cell">
                        <div className="fee-avatar">
                          {g.student.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="fee-student-name">{g.student.name}</div>
                          <div className="fee-student-email">{g.student.email}</div>
                          <div className="fee-student-id">ID: {g.student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fee-amount-total">
                        ₹{g.totalFee.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div className="fee-paid-info">
                        <span className="fee-amount-paid">
                          ₹{g.totalPaid.toLocaleString()}
                        </span>
                        <div className="fee-progress-mini">
                          <div className="fee-progress-bar-mini">
                            <div 
                              className="fee-progress-fill-mini"
                              style={{ 
                                width: `${percentPaid}%`,
                                backgroundColor: pending === 0 ? "#10b981" : pending < g.totalFee ? "#f59e0b" : "#ef4444"
                              }}
                            />
                          </div>
                          <span className="fee-progress-text">{percentPaid}%</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`fee-status-pill status-${paymentStatus.toLowerCase()}`}>
                        {paymentStatus}
                      </span>
                      {pending > 0 && (
                        <div className="fee-amount-pending">
                          Pending: ₹{pending.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td>
                      <button 
                        className="fee-detail-btn" 
                        onClick={() => setSelectedStudent(g)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <div className="fee-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="fee-modal" onClick={e => e.stopPropagation()}>
            <div className="fee-modal-header">
  <h3>📋 {selectedStudent.student.name}'s Fee Details</h3>
  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <button
      onClick={() =>
          generateFeePdf(selectedStudent, getPendingAmount)
      }
      style={{ background: "#16a34a", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }}
    >
      📥 Download Fee Structure
    </button>
    <button 
      className="fee-modal-close" 
      onClick={() => setSelectedStudent(null)}
    >
      ✕
    </button>
  </div>
</div>

            <div className="fee-summary-bar">
              <div className="fee-summary-item">
                <span>Total Fee</span>
                <strong>₹{selectedStudent.totalFee.toLocaleString()}</strong>
              </div>
              <div className="fee-summary-item">
                <span>Paid Fee</span>
                <strong className="text-success">
                  ₹{selectedStudent.totalPaid.toLocaleString()}
                </strong>
              </div>
              <div className="fee-summary-item">
                <span>Pending</span>
                <strong className="text-danger">
                  ₹{getPendingAmount(selectedStudent).toLocaleString()}
                </strong>
              </div>
              <div className="fee-summary-item">
                <span>Status</span>
                <span className={`fee-status-pill status-${
                  getPendingAmount(selectedStudent) === 0 ? 'paid' : 
                  getPendingAmount(selectedStudent) < selectedStudent.totalFee ? 'partial' : 'pending'
                }`}>
                  {getPendingAmount(selectedStudent) === 0 ? 'Paid' : 
                   getPendingAmount(selectedStudent) < selectedStudent.totalFee ? 'Partial' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="fee-detail-list">
              {selectedStudent.records.map(f => {
                const pending = f.amount - (f.paidAmount || 0);
                const status = pending === 0 ? 'paid' : pending < f.amount ? 'partial' : 'pending';
                
                return (
                  <div key={f.id} className="fee-detail-row">
                    <div className="fee-detail-info">
                      <div className="fee-detail-term"><b>{f.term}</b></div>
                      <div className="fee-detail-due">Due: {f.dueDate}</div>
                    </div>
                    <div className="fee-detail-amounts">
                      <div className="fee-detail-item">
                        <span className="fee-detail-label">Total</span>
                        <span className="fee-detail-value">₹{f.amount.toLocaleString()}</span>
                      </div>
                      <div className="fee-detail-item">
                        <span className="fee-detail-label">Paid</span>
                        <input
                          className="fee-small-input"
                          type="number"
                          value={editPaidAmounts[f.id] !== undefined ? editPaidAmounts[f.id] : f.paidAmount || 0}
                          onChange={(e) => handlePaidInputChange(f.id, e.target.value)}
                          onBlur={(e) => handlePaidAmountChange(f.id, e.target.value)}
                          onKeyPress={(e) => handlePaidKeyPress(e, f.id)}
                          min="0"
                          max={f.amount}
                          step="1"
                        />
                        <button 
                          className="fee-update-btn"
                          onClick={() => {
                            const value = editPaidAmounts[f.id];
                            if (value !== undefined) {
                              handlePaidAmountChange(f.id, value);
                              setEditPaidAmounts({ ...editPaidAmounts, [f.id]: '' });
                            }
                          }}
                        >
                          Update
                        </button>
                      </div>
                      <div className="fee-detail-item">
                        <span className="fee-detail-label">Pending</span>
                        <span className={`fee-detail-value ${pending > 0 ? 'pending' : 'paid'}`}>
                          ₹{pending.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="fee-detail-actions">
                      <span className={`fee-status-pill status-${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      <button 
                        className="fee-delete-btn" 
                        onClick={() => handleDelete(f.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManage;