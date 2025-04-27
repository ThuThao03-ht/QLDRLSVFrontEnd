// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link, useNavigate } from 'react-router-dom'; // 👉 Thêm useNavigate

// const Login = () => {
//   const [userName, setUserName] = useState('');
//   const [passWord, setPassWord] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate(); // 👉 Khởi tạo navigate

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post('http://localhost:8080/admin/user/login', {
//         userName,
//         passWord
//       });

//       if (response.status === 200) {
//         setMessage(`✅ Login thành công! Xin chào ${response.data.userName}`);

//         // 👉 Có thể lưu token hoặc thông tin người dùng tại đây nếu cần
//         // localStorage.setItem('user', JSON.stringify(response.data));

//         // 👉 Điều hướng sang trang admin
//         navigate('/admin');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setMessage('❌ Sai tài khoản hoặc mật khẩu');
//       } else {
//         setMessage('⚠️ Lỗi kết nối tới server');
//       }
//     }
//   };

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed"
//       style={{
//         backgroundImage: `url("/university.jpg")`,
//       }}
//     >
//       <div className="w-full max-w-md p-8 space-y-6 bg-white/70 rounded-2xl shadow-2xl backdrop-blur-lg transition-all duration-500 ease-in-out">
//         <h2 className="text-3xl font-semibold text-center text-green-700 drop-shadow-lg">Đăng nhập</h2>
//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
//             <input
//               type="text"
//               value={userName}
//               onChange={(e) => setUserName(e.target.value)}
//               required
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md hover:shadow-xl transition-all duration-300"
//             />
//           </div>
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
//             <input
//               type="password"
//               value={passWord}
//               onChange={(e) => setPassWord(e.target.value)}
//               required
//               className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md hover:shadow-xl transition-all duration-300"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105"
//           >
//             Đăng nhập
//           </button>
//         </form>
//         {message && (
//           <div className="mt-4 text-center font-semibold text-red-500">{message}</div>
//         )}
//         <p className="mt-4 text-center">
//           Chưa có tài khoản?{' '}
//           <Link to="/register" className="text-blue-500 hover:underline">
//             Đăng ký ngay
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;




// src/page/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 

export default function Login() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8080/admin/user/login", {
        userName,
        passWord,
      });

      const data = res.data;
      localStorage.setItem("user", JSON.stringify(data));

      if (data.roleId === 1) {
        navigate("/admin/statistics");
      } else {
        navigate(`/user/info/${encodeURIComponent(userName)}`);
      }
    } catch (err) {
      setError("Đăng nhập thất bại. Kiểm tra lại tài khoản hoặc mật khẩu.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url("/university.jpg")` }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Đăng nhập</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
