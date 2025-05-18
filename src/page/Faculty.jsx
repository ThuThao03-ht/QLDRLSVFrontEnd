import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

const Faculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [editFacultyName, setEditFacultyName] = useState('');
  const [facultyToEdit, setFacultyToEdit] = useState(null);

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/admin/faculty/all`);
      const data = Array.isArray(response.data) ? response.data : response.data.content ?? [];
      setFaculties(data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu khoa:', error);
      setError('Không thể tải dữ liệu khoa.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchFaculties();
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/admin/faculty/search/name/${searchTerm}`);
      const data = Array.isArray(response.data) ? response.data : response.data.content ?? [];
      setFaculties(data);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setError("Không thể tìm kiếm khoa.");
    }
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    fetchFaculties();
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!newFacultyName) return;

    try {
      await axios.post('http://localhost:8080/admin/faculty/add', {
        facultyName: newFacultyName,
      });
      toast.success('Thêm khoa thành công!', { position: "top-center", autoClose: 1000 });
      fetchFaculties();
      setIsModalOpen(false);
      setNewFacultyName('');
    } catch (error) {
      console.error('Lỗi khi thêm khoa:', error);
      toast.error('Thêm khoa thất bại!', { position: "top-center", autoClose: 1000 });
    }
  };

  const handleEditFaculty = (faculty) => {
    setFacultyToEdit(faculty);
    setEditFacultyName(faculty.facultyName);
    setIsModalOpen(true);
  };

  const handleSaveEditFaculty = async (e) => {
    e.preventDefault();
    if (!editFacultyName || !facultyToEdit) return;

    try {
      await axios.put(`http://localhost:8080/admin/faculty/update/${facultyToEdit.idFaculty}`, {
        facultyName: editFacultyName,
      });
      toast.success('Cập nhật khoa thành công!', { position: "top-center", autoClose: 1000 });
      fetchFaculties();
      setIsModalOpen(false);
      setEditFacultyName('');
    } catch (error) {
      console.error('Lỗi khi sửa khoa:', error);
      toast.error('Cập nhật khoa thất bại!', { position: "top-center", autoClose: 1000 });
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    const confirmed = window.confirm('Bạn có chắc muốn xóa khoa này không?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/admin/faculty/delete/${facultyId}`);
      toast.success('Xóa khoa thành công!', { position: "top-center", autoClose: 1000 });
      fetchFaculties();
    } catch (error) {
      console.error('Lỗi khi xóa khoa:', error);
      toast.error('Không thể xóa khoa.', { position: "top-center", autoClose: 1000 });
    }
  };

  const handleAddNewFaculty = () => {
    setIsModalOpen(true);
    setFacultyToEdit(null);
    setNewFacultyName('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">📘 Danh sách Khoa</h2>

      <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm kiếm tên khoa..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Tìm kiếm
        </button>
        <button
          onClick={handleResetSearch}
          className="px-6 py-2 bg-gray-300 text-black font-medium rounded-lg hover:bg-gray-400 transition"
        >
          Làm mới
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNewFaculty}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 border border-white transition"
        >
          Thêm Khoa
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center animate-pulse">⏳ Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-blue-100 text-blue-900 uppercase">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Tên Khoa</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {faculties.map((faculty) => (
                <tr key={faculty.idFaculty} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4">{faculty.idFaculty}</td>
                  <td className="px-6 py-4 font-medium">{faculty.facultyName}</td>
                  <td className="px-6 py-4">
                    {faculty.isDelete ? (
                      <span className="text-red-500 font-semibold">Đã xóa</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Đang hoạt động</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditFaculty(faculty)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaRegEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteFaculty(faculty.idFaculty)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                      >
                        <FaRegTrashAlt /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {faculties.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-center mb-4">
              {facultyToEdit ? 'Cập nhậtnhật Khoa' : 'Thêm Khoa Mới'}
            </h3>
            <form onSubmit={facultyToEdit ? handleSaveEditFaculty : handleAddFaculty}>
              <div className="mb-4">
                <label htmlFor="facultyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  id="facultyName"
                  type="text"
                  value={facultyToEdit ? editFacultyName : newFacultyName}
                  onChange={(e) =>
                    facultyToEdit
                      ? setEditFacultyName(e.target.value)
                      : setNewFacultyName(e.target.value)
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên khoa..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {facultyToEdit ? 'Lưu thay đổi' : 'Thêm Khoa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faculty;
