import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PointStatus = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/trainingpointstatuses/all');
      const data = Array.isArray(response.data) ? response.data : response.data.content ?? [];
      setStatuses(data);
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái rèn luyện:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchStatuses();
  };

  // Function to determine the background color and text color based on status
  const getStatusStyle = (statusName) => {
    if (statusName === 'Đã duyệt') {
      return 'bg-green-200 text-green-900'; // Approved
    } else if (statusName === 'Chờ duyệt') {
      return 'bg-yellow-200 text-yellow-900'; // Pending approval
    } else if (statusName === 'Đã gửi') {
      return 'bg-blue-200 text-blue-900'; // Sent
    } else if (statusName === 'Không hợp lệ') {
      return 'bg-red-200 text-red-900'; // Invalid
    } else if (statusName === 'Đang xử lý') {
      return 'bg-gray-200 text-gray-800'; // In process
    } else {
      return 'bg-gray-100 text-gray-600'; // Default style
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-blue-800 mb-6">📘 Danh sách trạng thái rèn luyện</h2>

      {loading ? (
        <div className="text-center text-gray-600">
          <p className="text-lg mb-4 animate-pulse">Đang tải dữ liệu...</p>
          <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div> {/* Loading spinner */}
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
          <button
            className="mt-4 bg-blue-600 text-white p-3 rounded-lg shadow hover:bg-blue-700 focus:outline-none"
            onClick={handleRetry}
          >
            Thử lại
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-md mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-100 uppercase">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Tên trạng thái</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-700">Mô tả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {statuses.length > 0 ? (
                statuses.map((status) => (
                  <tr key={status.statusId} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800">{status.statusId}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyle(status.statusName)}`}
                      >
                        {status.statusName}
                      </span>
                    </td> {/* Apply dynamic styling around the status name text */}
                    <td className="px-6 py-4 text-sm text-gray-700">{status.description || 'Không có mô tả'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có trạng thái nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PointStatus;
