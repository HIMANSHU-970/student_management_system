import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Student/Profile";

// ADMIN DEDICATED HUB CONTROLLERS
import SubjectManage from "./pages/Admin/SubjectManage";
import AttendanceManage from "./pages/Admin/AttendanceManage";
import FeeManage from "./pages/Admin/FeeManage";
import BroadcastManage from "./pages/Admin/BroadcastManage";
import StudentRegistry from "./pages/Admin/StudentRegistry";
import TimeTableManage from "./pages/Admin/TimeTableManage";
import ComprehensiveStudentControl from "./pages/Admin/ComprehensiveStudentControl";

// 🔥 PHASE 2: QUIZ & ASSIGNMENT IMPORTS
import QuizManage from "./pages/Admin/QuizManage";
import AssignmentManage from "./pages/Admin/AssignmentManage";

// STUDENT HUB COMPONENTS
import StudentDashboard from "./pages/Student/StudentDashboard";
import Attendance from "./pages/Student/Attendance";
import Fees from "./pages/Student/Fees";
import Notices from "./pages/Student/Notices";
import StudentCourses from "./pages/Student/StudentCourses";
import StudentTimeTable from "./pages/Student/StudentTimeTable"; // ✅ Added Import

// 🔥 PHASE 2: STUDENT QUIZ & ASSIGNMENT IMPORTS
import StudentQuiz from "./pages/Student/StudentQuiz";
import StudentAssignment from "./pages/Student/StudentAssignment";

import ProtectedRoute from "./components/ProtectedRoute";

// ... (initializeSystemUsers function waisa hi rahega)
const initializeSystemUsers = () => {
  const users = JSON.parse(localStorage.getItem("system_users")) || [];
  const adminExists = users.some(u => u.role === "admin");
  
  if (!adminExists) {
    const defaultAdmin = {
      id: "admin-master-01",
      email: "himanshu.kumar@adypu.edu.in",        
      password: "him970@",     
      name: "Himanshu Kumar",
      role: "admin",
      createdAt: new Date().toISOString()
    };
    users.push(defaultAdmin);
    localStorage.setItem("system_users", JSON.stringify(users));
  }
};
initializeSystemUsers();

const DashboardLayout = ({ children }) => (
  <div style={{ display: "flex", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
    <Sidebar />
    <div style={{ flex: 1, marginLeft: "280px", padding: "40px", boxSizing: "border-box" }}>
      {children}
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ADMIN CONTROLS ROUTE MATRIX */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute role="admin"><DashboardLayout><SubjectManage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/timetable" element={<ProtectedRoute role="admin"><DashboardLayout><TimeTableManage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><DashboardLayout><AttendanceManage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/fees" element={<ProtectedRoute role="admin"><DashboardLayout><FeeManage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/quizzes" element={<ProtectedRoute role="admin"><DashboardLayout><QuizManage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/assignments" element={<ProtectedRoute role="admin"><DashboardLayout><AssignmentManage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/broadcasts" element={<ProtectedRoute role="admin"><DashboardLayout><BroadcastManage /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="admin"><DashboardLayout><StudentRegistry /></DashboardLayout></ProtectedRoute>} />
        <Route path="/admin/ledger-override" element={<ProtectedRoute role="admin"><DashboardLayout><ComprehensiveStudentControl /></DashboardLayout></ProtectedRoute>} />

        {/* STUDENT ROUTE MATRIX */}
        <Route path="/student" element={<ProtectedRoute role="student"><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute role="student"><DashboardLayout><Attendance /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/timetable" element={<ProtectedRoute role="student"><DashboardLayout><StudentTimeTable /></DashboardLayout></ProtectedRoute>} /> {/* ✅ Added Route */}
        <Route path="/student/quizzes" element={<ProtectedRoute role="student"><DashboardLayout><StudentQuiz /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/assignments" element={<ProtectedRoute role="student"><DashboardLayout><StudentAssignment /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/fees" element={<ProtectedRoute role="student"><DashboardLayout><Fees /></DashboardLayout></ProtectedRoute>} />
        <Route path="/student/notices" element={<ProtectedRoute role="student"><DashboardLayout><Notices /></DashboardLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;