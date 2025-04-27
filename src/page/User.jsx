import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const User = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    userName: '',
    email: '',
    passWord: '',
    roleId: '',
  });
  const [roles, setRoles] = useState([]);
  
  // Các biến phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(5); // Số dòng trên mỗi trang

  // Fetch users từ API với phân trang
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/admin/user/all`, {
        params: {
          page: currentPage - 1, // API yêu cầu số trang bắt đầu từ 0
          size: pageSize,
        },
      });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
    }
  };

  // Fetch roles từ API
  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/rolepermissions/all');
      setRoles(response.data);
    } catch (err) {
      setError('Không thể tải danh sách vai trò');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/admin/user/add', newUser);
      toast.success('Thêm người dùng thành công!', { autoClose: 1000 });
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Lỗi thêm người dùng:', error);
      toast.error('Thao tác thất bại!', { autoClose: 1000 });
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold text-blue-700 mb-6">Danh sách Người Dùng</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <button
        onClick={() => setShowModal(true)}
        className="mb-6 px-6 py-3 min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
      >
        Thêm Người Dùng
      </button>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="bg-indigo-100 text-indigo-700 uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Tên Người Dùng</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Ngày Đăng Nhập</th>
              <th className="px-6 py-3">Trạng Thái</th>
              <th className="px-6 py-3">Vai trò</th>
              <th className="px-6 py-3">Mật khẩu</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-indigo-50 transition duration-300">
                <td className="px-6 py-4">{user.userId}</td>
                <td className="px-6 py-4">{user.userName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Chưa đăng nhập'}
                </td>
                <td className="px-6 py-4">{user.isLocked ? 'Đã khóa' : 'Đang hoạt động'}</td>
                <td className="px-6 py-4">
                  {roles.find((role) => role.roleId === user.roleId)?.roleName || 'Không rõ'}
                </td>
                <td className="px-6 py-4">{user.passWord ? 'Đã mã hóa' : 'Chưa có mật khẩu'}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  Không có dữ liệu người dùng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          Trước
        </button>
        <span className="mx-4 text-lg">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-4">Thêm Người Dùng</h3>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                  Tên Người Dùng
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={newUser.userName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="passWord" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="passWord"
                  name="passWord"
                  value={newUser.passWord}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
                  Vai trò
                </label>
                <select
                  id="roleId"
                  name="roleId"
                  value={newUser.roleId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-4 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default User;
