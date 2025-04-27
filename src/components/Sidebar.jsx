import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChartBar,
  FaCogs,
  FaSignOutAlt,
  FaUserCheck,
  FaCaretDown,
  FaUser,
  FaShieldAlt,
  FaUniversity,
  FaBook,
  FaCommentDots,
  FaCheckCircle
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      location.pathname === path
        ? 'bg-blue-800 text-white font-semibold'
        : 'text-blue-900 hover:bg-blue-100'
    }`;

  return (
    <div className="w-64 h-screen overflow-y-auto bg-white text-blue-900 p-4 fixed shadow-md border-r border-blue-200">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img
          src="/logofinish.jpg"
          alt="logo"
          className="h-200 w-auto object-contain"
        />
      </div>

      {/* Greeting */}
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-800">
        🎓 Xin chào Admin
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        <Link to="/admin/statistics" className={linkClass('/admin/statistics')}>
          <FaChartBar /> Thống kê & Báo cáo
        </Link>

        {/* Account Management Dropdown */}
        <div className="flex flex-col">
          <button
            onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-100 transition-colors"
          >
            <FaTachometerAlt /> Quản lý tài khoản <FaCaretDown className={`ml-auto transform transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isAccountDropdownOpen && (
            <div className="ml-6 mt-2 flex flex-col gap-2">
              <Link to="/admin/account" className={linkClass('/admin/account')}>
                <FaUser /> Tài khoản
              </Link>
              <Link to="/admin/permissions" className={linkClass('/admin/permissions')}>
                <FaShieldAlt /> Phân quyền
              </Link>
            </div>
          )}
        </div>

        {/* Other Links */}
        <Link to="/admin/students" className={linkClass('/admin/students')}>
          <FaUserGraduate /> Quản lý sinh viên
        </Link>

        <Link to="/admin/point" className={linkClass('/admin/point')}>
          <FaUserCheck /> Quản lý điểm rèn luyện
        </Link>

        {/* Settings Dropdown */}
        <div className="flex flex-col">
          <button
            onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-blue-900 hover:bg-blue-100 transition-colors"
          >
            <FaCogs /> Cài đặt hệ thống <FaCaretDown className={`ml-auto transform transition-transform ${isSettingsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSettingsDropdownOpen && (
            <div className="ml-6 mt-2 flex flex-col gap-2">
              <Link to="/admin/faculties" className={linkClass('/admin/faculties')}>
                <FaUniversity /> Khoa
              </Link>
              <Link to="/admin/majors" className={linkClass('/admin/majors')}>
                <FaBook /> Ngành
              </Link>
              <Link to="/admin/feedbacks" className={linkClass('/admin/feedbacks')}>
                <FaCommentDots /> Phản hồi
              </Link>
              <Link to="/admin/pointstatus" className={linkClass('/admin/pointstatus')}>
                <FaCheckCircle /> Trạng thái điểm
              </Link>
            </div>
          )}
        </div>

        {/* Logout */}
        <hr className="my-4 border-blue-200" />
        <Link
          to="/logout"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
        >
          <FaSignOutAlt /> Đăng xuất
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
