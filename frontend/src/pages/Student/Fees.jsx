import React, { useState, useEffect } from "react";
import "../../styles/studentFee.css";

// Local storage keys
const FEES_STORAGE_KEY = 'fee_management_data';
const STUDENTS_STORAGE_KEY = 'student_management_data';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const getStudentId = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        console.log("🔍 User from localStorage:", user);
        
        if (user.id) {
          if (typeof user.id === 'string' && user.id.includes('-')) {
            const email = user.email || '';
            if (email.includes('himanshu')) return 2;
            else if (email.includes('rohit')) return 1;
            else if (email.includes('priya')) return 3;
            else if (email.includes('amit')) return 4;
            return 2;
          }
          return Number(user.id);
        }
        return 2;
      } catch (e) {
        console.error("Error getting student ID:", e);
        return 2;
      }
    };

    const id = getStudentId();
    console.log("🎯 Student ID set to:", id);
    setStudentId(id);
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.id && typeof currentUser.id === 'string' && currentUser.id.includes('-')) {
      const updatedUser = { ...currentUser, id: id };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log("✅ Updated user with numeric ID:", updatedUser);
    }
    
    if (!localStorage.getItem('user')) {
      const defaultUser = { 
        id: 2, 
        name: "Himanshu", 
        email: "himanshukumar82298@gmail.com", 
        role: "student" 
      };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      console.log("✅ Default user set:", defaultUser);
    }
    
    fetchFees(id);
    
    const handleStorageChange = (e) => {
      if (e.key === FEES_STORAGE_KEY || e.key === 'fee_update_timestamp') {
        console.log("📢 Storage change detected");
        fetchFees(studentId || id);
      }
    };
    
    const handleCustomEvent = (e) => {
      console.log("📢 Custom event received");
      fetchFees(studentId || id);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('feeDataUpdated', handleCustomEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('feeDataUpdated', handleCustomEvent);
    };
  }, []);

  const fetchFees = (id) => {
    try {
      setLoading(true);
      setError("");
      
      const currentStudentId = id || studentId || 2;
      console.log(`🔍 Fetching fees for student ID: ${currentStudentId}`);
      
      const localFees = localStorage.getItem(FEES_STORAGE_KEY);
      const localStudents = localStorage.getItem(STUDENTS_STORAGE_KEY);
      
      let studentFees = [];
      let studentName = "Student";
      
      if (localFees) {
        const allFeesData = JSON.parse(localFees);
        console.log(`📋 Total fees in storage: ${allFeesData.length}`);
        
        studentFees = allFeesData.filter(f => f.studentId === currentStudentId);
        console.log(`✅ Found ${studentFees.length} fees for student ID ${currentStudentId}`);
        
        if (localStudents) {
          const students = JSON.parse(localStudents);
          const student = students.find(s => s.id === currentStudentId);
          studentName = student?.name || "Student";
          console.log(`👤 Student name: ${studentName}`);
        }
        
        setStudentName(studentName);
        setFees(studentFees);
      } else {
        console.warn("⚠️ No local fees data found");
        setFees([]);
      }
      
    } catch (err) {
      console.error("❌ Error fetching fees:", err);
      setError("Failed to load fees");
    } finally {
      setLoading(false);
    }
  };

  const totalFee = fees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
  const totalPending = totalFee - totalPaid;

  const statusColor = (fee) => {
    const pending = fee.amount - (fee.paidAmount || 0);
    if (pending === 0) return "#10b981";
    if (pending < fee.amount) return "#f59e0b";
    return "#ef4444";
  };

  const statusText = (fee) => {
    const pending = fee.amount - (fee.paidAmount || 0);
    if (pending === 0) return "Paid";
    if (pending < fee.amount) return "Partial";
    return "Pending";
  };

  if (loading) {
    return (
      <div className="student-fee-loading">
        Loading fee details...
      </div>
    );
  }

  return (
    <div className="student-fee-page">
      <div className="student-fee-header">
        <h1>💳 Fee Management Terminal</h1>
        <p>{studentName ? `${studentName}'s Fee Details` : "Review formal billing disbursements and gross outstanding invoices."}</p>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
          Student ID: {studentId} | Total Fees in System: {localStorage.getItem(FEES_STORAGE_KEY) ? JSON.parse(localStorage.getItem(FEES_STORAGE_KEY)).length : 0}
        </div>
      </div>

      {error && (
        <div className="student-fee-error">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {fees.length > 0 && (
        <div className="student-fee-summary">
          <div className="summary-card">
            <div className="summary-label">Total Fee</div>
            <div className="summary-value">₹{totalFee.toLocaleString()}</div>
          </div>
          <div className="summary-card paid">
            <div className="summary-label">Paid Fee</div>
            <div className="summary-value">₹{totalPaid.toLocaleString()}</div>
          </div>
          <div className="summary-card pending">
            <div className="summary-label">Pending Fee</div>
            <div className="summary-value">₹{totalPending.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="student-fee-table-wrap">
        <div className="student-fee-table-header">
          <h3>📄 Institutional Billing Distribution</h3>
          {fees.length > 0 && (
            <span className="fee-count">
              {fees.length} record{fees.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {!error && fees.length === 0 && (
          <div className="student-fee-empty">
            <div className="empty-icon">📭</div>
            <p>No fee records found for this student.</p>
            <p className="empty-sub">Student ID: {studentId}</p>
            <button 
              className="refresh-btn"
              onClick={() => {
                setLoading(true);
                fetchFees(studentId);
              }}
            >
              🔄 Refresh Data
            </button>
          </div>
        )}

        <div className="student-fee-list">
          {fees.map(f => {
            const pending = f.amount - (f.paidAmount || 0);
            const status = statusText(f);
            const color = statusColor(f);
            
            return (
              <div key={f.id} className="fee-item">
                <div className="fee-item-header">
                  <h4 className="fee-term">{f.term}</h4>
                  <span 
                    className="fee-status-badge"
                    style={{ backgroundColor: color }}
                  >
                    {status}
                  </span>
                </div>
                <div className="fee-item-body">
                  <div className="fee-detail-grid">
                    <div className="fee-detail-item">
                      <span className="fee-detail-label">Total Fee</span>
                      <span className="fee-detail-value total">₹{f.amount.toLocaleString()}</span>
                    </div>
                    <div className="fee-detail-item">
                      <span className="fee-detail-label">Paid Fee</span>
                      <span className="fee-detail-value paid">₹{(f.paidAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="fee-detail-item">
                      <span className="fee-detail-label">Pending Fee</span>
                      <span className={`fee-detail-value ${pending > 0 ? 'pending' : 'paid'}`}>
                        ₹{pending.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="fee-item-footer">
                    <span className="fee-due-date">📅 Due: {f.dueDate}</span>
                    {pending > 0 && pending < f.amount && (
                      <div className="fee-progress-mini">
                        <div className="fee-progress-mini-bar">
                          <div 
                            className="fee-progress-mini-fill"
                            style={{ 
                              width: `${((f.paidAmount || 0) / f.amount) * 100}%`,
                              backgroundColor: "#f59e0b"
                            }}
                          />
                        </div>
                        <span className="fee-progress-mini-text">
                          {Math.round(((f.paidAmount || 0) / f.amount) * 100)}% Paid
                        </span>
                      </div>
                    )}
                    {pending === 0 && (
                      <div className="fee-paid-badge">✅ Fully Paid</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        {fees.length > 0 && totalFee > 0 && (
          <div className="student-fee-progress">
            <div className="progress-header">
              <span>Overall Payment Progress</span>
              <span>{Math.round((totalPaid / totalFee) * 100)}% Complete</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${(totalPaid / totalFee) * 100}%`,
                  backgroundColor: totalPending === 0 ? "#10b981" : totalPending < totalFee ? "#f59e0b" : "#ef4444"
                }}
              />
            </div>
            <div className="progress-stats">
              <span>₹{totalPaid.toLocaleString()} Paid</span>
              <span>₹{totalPending.toLocaleString()} Pending</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fees;