import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Major = () => {
  const [majors, setMajors] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ majorName: '', facultyId: '' });
  const [editMajor, setEditMajor] = useState(null);

  // Đảm bảo tắt cuộn trang khi modal mở
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
  }, [isModalOpen]);

  useEffect(() => {
    fetchMajors();
    fetchFaculties();
  }, []);

  const fetchMajors = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/admin/major/all');
      setMajors(Array.isArray(res.data) ? res.data : res.data.content ?? []);
    } catch (error) {
      setError('Không thể tải dữ liệu ngành.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin/faculty/all');
      setFaculties(Array.isArray(res.data) ? res.data : res.data.content ?? []);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu khoa:', error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      fetchMajors();
      return;
    }
    try {
      // Điều chỉnh URL để gửi query parameter 'name'
      const response = await axios.get(`http://localhost:8080/admin/major/search?name=${searchTerm}`);
      setMajors(Array.isArray(response.data) ? response.data : response.data.content ?? []);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setError("Không thể tìm kiếm ngành.");
    }
  };
  
  const handleResetSearch = () => {
    setSearchTerm('');
    fetchMajors();
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
    setFormData({ majorName: '', facultyId: '' });
    setEditMajor(null);
  };

  const handleEdit = (major) => {
    setEditMajor(major);
    setFormData({
      majorName: major.majorName,
      facultyId: major.faculty.idFaculty || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Bạn có chắc muốn xóa ngành này?');
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:8080/admin/major/delete/${id}`);
      toast.success('Xóa ngành thành công!', { autoClose: 1000 });
      fetchMajors();
    } catch (error) {
      toast.error('Xóa ngành thất bại!', { autoClose: 1000 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.majorName || !formData.facultyId) return;

    try {
      if (editMajor) {
        await axios.put(`http://localhost:8080/admin/major/update/${editMajor.idMajor}`, {
          majorName: formData.majorName,
          facultyId: formData.facultyId,
        });
        toast.success('Cập nhật ngành thành công!', { autoClose: 1000 });
      } else {
        await axios.post(`http://localhost:8080/admin/major/add`, formData);
        toast.success('Thêm ngành thành công!', { autoClose: 1000 });
      }
      setIsModalOpen(false);
      fetchMajors();
    } catch (error) {
      toast.error('Thao tác thất bại!', { autoClose: 1000 });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-indigo-600 mb-6 text-center">📘 Danh sách Ngành</h2>

      <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Tìm kiếm tên ngành..."
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"

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
          onClick={handleAddNew}
          className="min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition"

        >
          Thêm Ngành
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">⏳ Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-900 uppercase">

              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Tên Ngành</th>
                <th className="px-6 py-3">Khoa</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {majors.map((major) => (
                <tr key={major.idMajor} className="hover:bg-purple-50 transition">
                  <td className="px-6 py-4">{major.idMajor}</td>
                  <td className="px-6 py-4 font-medium">{major.majorName}</td>
                  <td className="px-6 py-4">{major.faculty?.facultyName || 'Không rõ'}</td>
                  <td className="px-6 py-4">
                    {major.isDelete ? (
                      <span className="text-red-500 font-semibold">Đã xóa</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Đang hoạt động</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(major)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaRegEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(major.idMajor)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-2"
                      >
                        <FaRegTrashAlt /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {majors.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
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
            <h3 className="text-2xl font-semibold mb-4">{editMajor ? 'Sửa Ngành' : 'Thêm Ngành'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium">Tên Ngành</label>
                <input
                  type="text"
                  value={formData.majorName}
                  onChange={(e) => setFormData({ ...formData, majorName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nhập tên ngành..."
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Chọn Khoa</label>
                <select
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Chọn Khoa</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.idFaculty} value={faculty.idFaculty}>
                      {faculty.facultyName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 bg-gray-300 text-black rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editMajor ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Major;
