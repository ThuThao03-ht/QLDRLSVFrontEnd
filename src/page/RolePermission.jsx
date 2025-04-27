import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RolePermission = () => {
  const [rolePermissions, setRolePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  const fetchRolePermissions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/rolepermissions/all');
      const data = Array.isArray(response.data) ? response.data : response.data.content ?? [];
      setRolePermissions(data);
    } catch (error) {
      console.error('Lỗi khi lấy quyền hạn vai trò:', error);
      setError('Có lỗi xảy ra khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const getRolePermissionStyle = (roleName) => {
    if (roleName === 'Quản trị viên') {
      return 'bg-green-200 text-green-900 px-2 py-1 rounded font-semibold text-sm';
    } else if (roleName === 'Giảng viên') {
      return 'bg-yellow-200 text-yellow-900 px-2 py-1 rounded font-semibold text-sm';
    } else if (roleName === 'Sinh viên') {
      return 'bg-blue-200 text-blue-900 px-2 py-1 rounded font-semibold text-sm';
    } else if (roleName === 'Quản lý') {
      return 'bg-red-200 text-red-900 px-2 py-1 rounded font-semibold text-sm';
    } else {
      return 'bg-gray-100 text-gray-800 px-2 py-1 rounded font-semibold text-sm';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">📘 Danh sách quyền hạn vai trò</h2>

      {loading ? (
        <p className="text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white border border-blue-200 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-blue-100">
            <thead className="bg-blue-100 uppercase">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">ID</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-blue-800 min-w-[160px] whitespace-nowrap">Tên vai trò</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">Tên quyền hạn</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-blue-800">Mô tả quyền hạn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {rolePermissions.length > 0 ? (
                rolePermissions.map((rolePermission) => (
                  <tr key={`${rolePermission.roleId}-${rolePermission.permissionName}`} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800">{rolePermission.roleId}</td>
                    <td className="px-6 py-4 text-sm min-w-[160px] whitespace-nowrap">
                      <span className={getRolePermissionStyle(rolePermission.roleName)}>
                        {rolePermission.roleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{rolePermission.permissionName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {rolePermission.permissionDescription || 'Không có mô tả'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có quyền hạn nào.
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

export default RolePermission;
