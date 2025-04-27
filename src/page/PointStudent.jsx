import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PointStudent = () => {
    const [points, setPoints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');
    const [academicYears, setAcademicYears] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [fullNames, setFullNames] = useState([]);

    const fetchPoints = async () => {
        try {
            const response = await axios.get("http://localhost:8080/admin/trainingpoint/all");
            const allPoints = response.data.content || [];
            setPoints(allPoints);
            const years = [...new Set(allPoints.map(p => p.academicYear))];
            setAcademicYears(years);
            const names = [...new Set(allPoints.map(p => p.student?.fullName).filter(Boolean))];
            setFullNames(names);
        } catch (error) {
            setError("Không thể tải dữ liệu điểm rèn luyện");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchByYear = async (year) => {
        setSelectedYear(year);
        setSelectedName('');
        setLoading(true);
        try {
            if (!year) {
                fetchPoints();
                return;
            }
            const response = await axios.get(`http://localhost:8080/admin/trainingpoint/search/academicYear/${year}`);
            setPoints(response.data || []);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm theo năm học:', error);
            setError("Không thể tìm dữ liệu theo năm học");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchByName = async (name) => {
        setSelectedName(name);
        setSelectedYear('');
        setLoading(true);
        try {
            if (!name) {
                fetchPoints();
                return;
            }
            const response = await axios.get(`http://localhost:8080/admin/trainingpoint/search?fullName=${name}`);
            setPoints(response.data || []);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm theo tên sinh viên:', error);
            setError("Không thể tìm dữ liệu theo tên sinh viên");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    if (loading) return <div className="text-center py-8 text-blue-600 text-lg font-semibold animate-pulse">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center text-red-600 py-4 font-medium">{error}</div>;

    return (
        <div className="p-6 bg-gradient-to-br from-green-50 via-white to-blue-100 rounded-2xl shadow-xl max-w-7xl mx-auto mt-6">
            <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">📋 Danh sách điểm rèn luyện</h1>

            {/* Bộ lọc tìm kiếm */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
                <div className="flex flex-col items-start gap-1">
                    <label className="text-gray-600 font-medium">Năm học</label>
                    <select
                        className="w-48 md:w-56 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        value={selectedYear}
                        onChange={(e) => handleSearchByYear(e.target.value)}
                    >
                        <option value="">-- Tất cả --</option>
                        {academicYears.map((year, idx) => (
                            <option key={idx} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col items-start gap-1">
                    <label className="text-gray-600 font-medium">Tên sinh viên</label>
                    <select
                        className="w-48 md:w-56 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                        value={selectedName}
                        onChange={(e) => handleSearchByName(e.target.value)}
                    >
                        <option value="">-- Tất cả --</option>
                        {fullNames.map((name, idx) => (
                            <option key={idx} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-blue-600 text-white text-center">
                        <tr>
                            <th className="px-4 py-3">Mã điểm</th>
                            <th className="px-4 py-3">Tên sinh viên</th>
                            <th className="px-4 py-3">Lớp</th>
                            <th className="px-4 py-3">Ngành</th>
                            <th className="px-4 py-3">Khoa</th>
                            <th className="px-4 py-3">Học kỳ</th>
                            <th className="px-4 py-3">Năm học</th>
                            <th className="px-4 py-3">Tổng điểm</th>
                            <th className="px-4 py-3">Xếp loại</th>
                            <th className="px-4 py-3">Trạng thái</th>
                            <th className="px-4 py-3">Ngày tạo</th>
                            <th className="px-4 py-3">Đã xoá</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {points.length > 0 ? (
                            points.map((point) => (
                                <tr key={point.idPoint} className="hover:bg-blue-50 transition duration-200 text-center">
                                    <td className="px-4 py-3">{point.idPoint}</td>
                                    <td className="px-4 py-3 text-left">{point.student?.fullName}</td>
                                    <td className="px-4 py-3">{point.student?.className}</td>
                                    <td className="px-4 py-3 text-left">{point.student?.major?.majorName}</td>
                                    <td className="px-4 py-3 text-left">{point.student?.major?.faculty?.facultyName}</td>
                                    <td className="px-4 py-3">{point.semester}</td>
                                    <td className="px-4 py-3">{point.academicYear}</td>
                                    <td className="px-4 py-3">{point.totalPoint}</td>
                                    <td className="px-4 py-3">{point.classification}</td>
                                    <td className="px-4 py-3">{point.status?.statusName}</td>
                                    <td className="px-4 py-3">
                                        {point.createdAt ? new Date(point.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {point.isDelete ? '✔️' : '❌'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center text-gray-500 py-6">
                                    Không có dữ liệu để hiển thị
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PointStudent;
