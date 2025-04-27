import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaInfoCircle,
  FaUserCheck,
  FaCommentDots,
  FaAddressCard,
  FaEnvelope,
  FaSignOutAlt
} from 'react-icons/fa';

const SidebarUser = () => {
  const location = useLocation();

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
        🎓 Xin chào Sinh viên
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">

      <Link to="/user/info" className={linkClass('/user/info')}>
          <FaInfoCircle /> Thông tin
        </Link>

      <Link to="/user/about" className={linkClass('/user/about')}>
          <FaAddressCard /> Giới thiệu
        </Link>

        <Link to="/user/contact" className={linkClass('/user/contact')}>
          <FaEnvelope /> Liên hệ
        </Link>
        
        <Link to="/user/point" className={linkClass('/user/point')}>
          <FaUserCheck /> Điểm rèn luyện
        </Link>

        <Link to="/user/feedback" className={linkClass('/user/feedback')}>
          <FaCommentDots /> Phản hồi
        </Link>

       

        {/* Logout */}
        <hr className="my-4 border-blue-200" />
        <Link
          to="/logout"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-100"
        >
          <FaSignOutAlt /> Đăng xuất
        </Link>
      </nav>
    </div>
  );
};

export default SidebarUser;
