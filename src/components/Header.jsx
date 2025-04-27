// import React from 'react';
// import { FaUserCircle } from 'react-icons/fa';

// const Header = () => {
//   return (
//     <header
//       className="w-full text-black py-4 px-6 shadow-md flex justify-between items-center"
//       style={{ backgroundColor: '#f5f5ff' }}
//     >
//       {/* Tiêu đề hệ thống */}
//       <h1 className="text-xl font-bold tracking-wide">
//         🎓 Hệ thống quản trị điểm rèn luyện
//       </h1>

//       {/* Khu vực user (góc phải) */}
//       <div className="flex items-center gap-2 cursor-pointer">
//         <FaUserCircle className="text-2xl text-gray-700" />
//         <span className="text-sm font-medium">Admin</span>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Header = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.userName || ""); // fallback nếu không có userName
    }
  }, []);

  return (
    <header
      className="w-full text-black py-4 px-6 shadow-md flex justify-between items-center"
      style={{ backgroundColor: '#f5f5ff' }}
    >
      <h1 className="text-xl font-bold tracking-wide">
        🎓 Hệ thống quản trị điểm rèn luyện
      </h1>

      <div className="flex items-center gap-2 cursor-pointer">
        <FaUserCircle className="text-2xl text-gray-700" />
        <span className="text-sm font-medium">{userName || "Khách"}</span>
      </div>
    </header>
  );
};

export default Header;
