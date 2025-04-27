// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LayoutAdmin from './components/LayoutAdmin';
import LayoutUser from './components/LayoutUser';

import Dashboard from './page/Dashboard';
import Student from './page/Student';
import Point from './page/TrainingPoint';
import Feedback from './page/Feedback';
import PointStatus from './page/PointStatus';
import RolePermission from './page/RolePermission';
import Faculty from './page/Faculty';
import Major from './page/Major';
import User from './page/User';
import Login from './page/Login';


import InformationStudent from './page/InformationStudent';
import PointStudent from './page/PointStudent';
import FeedbackStudent from './page/FeedbackStudent';
import About from './page/About';
import Contact from './page/Contact';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang login là mặc định ("/") */}
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Login />} />
  
        {/* Admin layout */}
        <Route path="/admin" element={<LayoutAdmin />}>
          {/* Redirect /admin to /admin/statistics */}
          <Route index element={<Navigate to="statistics" replace />} />
          <Route path="statistics" element={<Dashboard />} />
          <Route path="students" element={<Student />} />
          <Route path="point" element={<Point />} />
          <Route path="feedbacks" element={<Feedback />} />
          <Route path="pointstatus" element={<PointStatus />} />
          <Route path="permissions" element={<RolePermission />} />
          <Route path="faculties" element={<Faculty />} />
          <Route path="majors" element={<Major />} />
          <Route path="account" element={<User />} />     
        </Route>
     
        {/* User layout */}
        <Route path="/user" element={<LayoutUser />}>
          <Route path="info/:name" element={<InformationStudent />} />
          <Route path="point" element={<PointStudent />} />
          <Route path="feedback" element={<FeedbackStudent />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
