import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    fetchFeedbacks(selectedStatus);
  }, [selectedStatus]);

  const fetchFeedbacks = async (status) => {
    try {
      setLoading(true);
      const url =
        status === 'Tất cả'
          ? 'http://localhost:8080/admin/feedback/all'
          : `http://localhost:8080/admin/feedback/status/${status}`;
      const response = await axios.get(url);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.content ?? [];
      setFeedbacks(data);
    } catch (error) {
      console.error('Lỗi khi lấy feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (feedback) => {
    setSelectedFeedback(feedback);
    setEditContent(feedback.content);
    setEditStatus(feedback.status);
    setShowModal(true);
  };

  const handleUpdateFeedback = async () => {
    try {
      await axios.put(`http://localhost:8080/admin/feedback/update/${selectedFeedback.feedbackId}`, {
        userId: selectedFeedback.userId,
        content: editContent,
        status: editStatus
      });
      toast.success('Duyệt phản hồi thành công!', { autoClose: 1000 });
    setShowModal(false);
    fetchFeedbacks(selectedStatus);
  } catch (error) {
    console.error("Lỗi khi cập nhật phản hồi:", error);
    toast.error('Duyệt phản hồi thất bại!', { autoClose: 1000 });
  }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <ToastContainer />
      <h2 className="text-3xl font-bold text-blue-700 mb-6">📋 Danh sách phản hồi</h2>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
      ) : (
        <div className="mb-6">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md"
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Thành công">Thành công</option>
            <option value="Đang chờ">Đang chờ</option>
            <option value="Thất bại">Thất bại</option>
          </select>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-blue-300">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-100 uppercase">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">ID</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">User ID</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">Nội dung</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback.feedbackId} className="hover:bg-blue-50 transition duration-200">
                  <td className="px-6 py-4 text-sm">{feedback.feedbackId}</td>
                  <td className="px-6 py-4 text-sm">{feedback.user?.userName ?? 'Ẩn danh'}</td>
                  <td className="px-6 py-4 text-sm">{feedback.content}</td>
                  <td className="px-6 py-4 text-sm">{new Date(feedback.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                      ${feedback.status === 'Đang chờ'
                        ? 'bg-yellow-200 text-yellow-900'
                        : feedback.status === 'Thành công'
                        ? 'bg-green-200 text-green-900'
                        : 'bg-gray-200 text-gray-800'}`}>
                      {feedback.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleOpenModal(feedback)}
                    className="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-600"
                  >
                    <FaCheck size={20} />
                  </button>

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  Không có phản hồi nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal cập nhật */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700"> Check phản hồi</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium">Nội dung:</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Trạng thái:</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Đang chờ">Đang chờ</option>
                <option value="Thành công">Thành công</option>
                <option value="Thất bại">Thất bại</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateFeedback}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
