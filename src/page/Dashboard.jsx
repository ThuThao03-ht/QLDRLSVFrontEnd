import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileExcel, FaChartBar, FaUserGraduate } from 'react-icons/fa';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [classData, setClassData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);

  // Lấy dữ liệu thống kê xếp loại
  useEffect(() => {
    const fetchClassificationData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/admin/trainingpoint/statistics/classification"
        );
        const rawData = response.data;

        const groupedData = {};
        rawData.forEach((item) => {
          const year = item.academicYear;
          const classification = item.classification;
          const count = item.count;

          if (!groupedData[year]) {
            groupedData[year] = { academicYear: year };
          }
          groupedData[year][classification] = count;
        });

        setChartData(Object.values(groupedData));
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu biểu đồ xếp loại:", error);
      }
    };

    fetchClassificationData();
  }, []);

  // Lấy dữ liệu số lượng sinh viên theo lớp
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/admin/student/countbyclass"
        );
        const rawData = response.data;

        const formatted = rawData.map(([className, studentCount]) => ({
          className,
          studentCount,
        }));

        setClassData(formatted);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu biểu đồ lớp:", error);
      }
    };

    fetchClassData();
  }, []);

  // Lấy dữ liệu bảng điểm rèn luyện
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/admin/trainingpoint/all"
        );
        setTrainingData(response.data.content);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu điểm rèn luyện:", error);
      }
    };

    fetchTrainingData();
  }, []);

  // Hàm xử lý xuất Excel
  const handleExportExcel = () => {
    const exportData = trainingData.map((item, index) => ({
      STT: index + 1,
      "Họ tên": item.student?.fullName || "N/A",
      "Lớp": item.student?.className || "N/A",
      "Ngành": item.student?.major?.majorName || "N/A",
      "Năm học": item.academicYear,
      "Học kỳ": item.semester,
      "Điểm": item.totalPoint,
      "Xếp loại": item.classification,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DiemRenLuyen");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(fileData, "diem_ren_luyen.xlsx");
  };

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-emerald-700">
        📊 Thống kê
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Biểu đồ xếp loại */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-center bg-blue-100 mb-4 flex items-center justify-center">
          <FaChartBar className="mr-2" />
          Xếp loại theo năm học
        </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="academicYear" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Xuất sắc" fill="#16a34a" />
              <Bar dataKey="Tốt" fill="#3b82f6" />
              <Bar dataKey="Khá" fill="#f59e0b" />
              <Bar dataKey="Trung bình" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ số lượng sinh viên */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-center bg-blue-100 mb-4 flex items-center justify-center">
          <FaUserGraduate className="mr-2" />
          Số lượng sinh viên theo lớp
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={classData}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="className" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "studentCount") return [value, "Số lượng SV"];
                return [value, name];
              }}
            />
            <Legend
              payload={[
                {
                  value: "Số lượng SV",
                  type: "square",
                  color: "#10b981",
                  id: "studentCount"
                }
              ]}
            />
            <Bar dataKey="studentCount" fill="#10b981" name="Số lượng SV" />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Bảng dữ liệu điểm rèn luyện */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
          📄 Danh sách điểm rèn luyện
        </h2>

        {/* Nút xuất Excel */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 flex items-center space-x-2"
>
          <FaFileExcel />
          <span>Xuất Excel</span>
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-2 border">STT</th>
                <th className="px-4 py-2 border">Họ tên</th>
                <th className="px-4 py-2 border">Lớp</th>
                <th className="px-4 py-2 border">Ngành</th>
                <th className="px-4 py-2 border">Năm học</th>
                <th className="px-4 py-2 border">Học kỳ</th>
                <th className="px-4 py-2 border">Điểm</th>
                <th className="px-4 py-2 border">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {trainingData.map((item, index) => (
                <tr key={item.idPoint} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    {item.student?.fullName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.student?.className || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {item.student?.major?.majorName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">{item.academicYear}</td>
                  <td className="px-4 py-2 border">{item.semester}</td>
                  <td className="px-4 py-2 border">{item.totalPoint}</td>
                  <td className="px-4 py-2 border">{item.classification}</td>
                </tr>
              ))}
              {trainingData.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    Không có dữ liệu hiển thị.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

