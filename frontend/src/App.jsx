import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import Sidebar from "./components/Sidebar";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard"; 
import StudentDashboard from "./pages/Student/StudentDashboard";

// ATTENDANCE FLOW COMPONENTS
import AttendanceManager from "./pages/Teacher/AttendanceManager"; 
import StudentDetail from "./pages/Teacher/StudentDetail"; 
import StudyMaterials from "./pages/Teacher/StudyMaterials";

// ADMIN IMPORTS
import SubjectManage from "./pages/Admin/SubjectManage";
import FeeManage from "./pages/Admin/FeeManage";
import BroadcastManage from "./pages/Admin/BroadcastManage";
import StudentRegistry from "./pages/Admin/StudentRegistry";
import TimeTableManage from "./pages/Admin/TimeTableManage";
import ComprehensiveStudentControl from "./pages/Admin/ComprehensiveStudentControl";
import QuizManage from "./pages/Admin/QuizManage";
import AssignmentManage from "./pages/Admin/AssignmentManage";
import AssignTeacher from "./pages/Admin/AssignTeacher"; // Naya Import
import DepartmentManage from "./pages/Admin/DepartmentManage";
import ClassManage from "./pages/Admin/ClassManage";
import LeaveManage from "./pages/Admin/LeaveManage";
import AdminMessages from "./pages/Admin/Messages";

// STUDENT IMPORTS
import Attendance from "./pages/Student/Attendance";
import Fees from "./pages/Student/Fees";
import Notices from "./pages/Student/Notices";
import StudentTimeTable from "./pages/Student/StudentTimeTable";
import StudentQuiz from "./pages/Student/StudentQuiz";
import StudentAssignment from "./pages/Student/StudentAssignment";
import StudentCourses from "./pages/Student/StudentCourses";
import LeaveApplicationPage from "./pages/Student/LeaveApplication";
import StudentMessages from "./pages/Student/Messages";

// TEACHER IMPORTS
import ExamManage from "./pages/Admin/ExamManage";
import TeacherExamManage from "./pages/Teacher/ExamManage";
import StudentExams from "./pages/Student/StudentExams";
import StudentResults from "./pages/Student/StudentResults";
import TeacherMessages from "./pages/Teacher/Messages";



import ProtectedRoute from "./components/ProtectedRoute";



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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/attendance/:studentId" element={<ProtectedRoute role="admin"><DashboardLayout><StudentDetail /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><DashboardLayout><AttendanceManager /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/assign-teacher" element={<ProtectedRoute role="admin"><DashboardLayout><AssignTeacher /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/subjects" element={<ProtectedRoute role="admin"><DashboardLayout><SubjectManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/timetable" element={<ProtectedRoute role="admin"><DashboardLayout><TimeTableManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/fees" element={<ProtectedRoute role="admin"><DashboardLayout><FeeManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/quizzes" element={<ProtectedRoute role="admin"><DashboardLayout><QuizManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/assignments" element={<ProtectedRoute role="admin"><DashboardLayout><AssignmentManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/broadcasts" element={<ProtectedRoute role="admin"><DashboardLayout><BroadcastManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><DashboardLayout><StudentRegistry /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/ledger-override" element={<ProtectedRoute role="admin"><DashboardLayout><ComprehensiveStudentControl /></DashboardLayout></ProtectedRoute>} />
          <Route path="/admin/departments" element={<ProtectedRoute role="admin"><DashboardLayout><DepartmentManage /></DashboardLayout></ProtectedRoute>} />
           <Route path="/admin/classes" element={<ProtectedRoute role="admin"><DashboardLayout><ClassManage /></DashboardLayout></ProtectedRoute>} />
           <Route path="/admin/exams-manage" element={<ProtectedRoute role="admin"><DashboardLayout><ExamManage /></DashboardLayout></ProtectedRoute>} />
           <Route path="/admin/leave" element={<ProtectedRoute role="admin"><DashboardLayout><LeaveManage /></DashboardLayout></ProtectedRoute>} />
           <Route path="/admin/messages" element={<ProtectedRoute role="admin"><DashboardLayout><AdminMessages /></DashboardLayout></ProtectedRoute>} />


          {/* STUDENT ROUTES */}
          <Route path="/student" element={<ProtectedRoute role="student"><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/attendance" element={<ProtectedRoute role="student"><DashboardLayout><Attendance /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/timetable" element={<ProtectedRoute role="student"><DashboardLayout><StudentTimeTable /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/quizzes" element={<ProtectedRoute role="student"><DashboardLayout><StudentQuiz /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/assignments" element={<ProtectedRoute role="student"><DashboardLayout><StudentAssignment /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/fees" element={<ProtectedRoute role="student"><DashboardLayout><Fees /></DashboardLayout></ProtectedRoute>} />
          <Route path="/student/notices" element={<ProtectedRoute role="student"><DashboardLayout><Notices /></DashboardLayout></ProtectedRoute>} />
           <Route path="/student/materials" element={<ProtectedRoute role="student"><DashboardLayout><StudentCourses /></DashboardLayout></ProtectedRoute>} />
           <Route path="/student/exams" element={<ProtectedRoute role="student"><DashboardLayout><StudentExams /></DashboardLayout></ProtectedRoute>} />
           <Route path="/student/results" element={<ProtectedRoute role="student"><DashboardLayout><StudentResults /></DashboardLayout></ProtectedRoute>} />
           <Route path="/student/leave" element={<ProtectedRoute role="student"><DashboardLayout><LeaveApplicationPage /></DashboardLayout></ProtectedRoute>} />
           <Route path="/student/messages" element={<ProtectedRoute role="student"><DashboardLayout><StudentMessages /></DashboardLayout></ProtectedRoute>} />

          {/* TEACHER ROUTES */}
          <Route path="/teacher" element={<ProtectedRoute role="teacher"><DashboardLayout><TeacherDashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/attendance/:studentId" element={<ProtectedRoute role="teacher"><DashboardLayout><StudentDetail /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><DashboardLayout><AttendanceManager /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/timetable" element={<ProtectedRoute role="teacher"><DashboardLayout><TimeTableManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/assignments" element={<ProtectedRoute role="teacher"><DashboardLayout><AssignmentManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/quizzes" element={<ProtectedRoute role="teacher"><DashboardLayout><QuizManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/notices" element={<ProtectedRoute role="teacher"><DashboardLayout><BroadcastManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/materials" element={<ProtectedRoute role="teacher"><DashboardLayout><StudyMaterials /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/exams" element={<ProtectedRoute role="teacher"><DashboardLayout><TeacherExamManage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/teacher/messages" element={<ProtectedRoute role="teacher"><DashboardLayout><TeacherMessages /></DashboardLayout></ProtectedRoute>} />
 

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;