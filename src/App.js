import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './css/global.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Alert from './components/Alert';
import AlertState from './context/AlertState';
import ForgotPassword from './components/ForgotPassword';
import RecoverPassword from './components/RecoverPassword';
import Home from './components/Home';
// import StudentHome from './components/student/StudentHome';
import StudentProfile from './components/student/StudentProfile';
import Achievement from './components/student/achievement/Achievement';
import Internship from './components/student/internship/Internship';
import Project from './components/student/project/Project';
import QnA from './components/qna/QnA';
import Answer from './components/answer/Answer';
import TeacherHome from './components/teacher/TeacherHome';
import StudentAchievement from './components/teacher/studentachievement/StudentAchievement';
import StudentInternship from './components/teacher/studentinternship/StudentInternship';
import StudentProject from './components/teacher/studentproject/StudentProject';
import ProtectedRoutes from './components/ProtectedRoutes';
import Newsletter from './components/newsletter/Newsletter';
import StudentHome from './components/student/home/StudentHome';
import TeacherProfile from './components/teacher/TeacherProfile';

function App() {
  return (
    <>
      <AlertState>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/recover" element={<RecoverPassword />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/student/home" element={<StudentHome />} />
              <Route path="/qna" element={<QnA />} />
              <Route path="/qna/:id" element={<Answer />} />
              <Route path="/student/achievement" element={<Achievement />} />
              <Route path="/student/internship" element={<Internship />} />
              <Route path="/student/project" element={<Project />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/newsletter" element={<Newsletter />} />

              {/* Teacher */}
              <Route path="/teacher/home" element={<TeacherHome />} />
              <Route path="/teacher/profile" element={<TeacherProfile />} />
              <Route path="/teacher/studentachievement" element={<StudentAchievement />} />
              <Route path="/teacher/studentinternship" element={<StudentInternship />} />
              <Route path="/teacher/studentproject" element={<StudentProject />} />

              {/* Writer */}
              <Route path="/newsletter" element={<Newsletter />} />
            </Route>
            
          </Routes>
        </Router>
        <Alert />
      </AlertState>
    </>
  );
}

export default App;
