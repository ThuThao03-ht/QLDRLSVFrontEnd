import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEdit,
  FaRegTrashAlt, FaFileExcel
} from 'react-icons/fa';
import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

const TrainingPoint = () => {
  const [trainingPoints, setTrainingPoints] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [selectedTrainingPoint, setSelectedTrainingPoint] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
 
  const [newPoint, setNewPoint] = useState({
    idPoint: '',
    studentId: '',
    semester: '',
    academicYear: '',
    totalPoint: '',
    classification: '',
    statusId: '',
  });

  useEffect(() => {
    fetchTrainingPoints();
  }, []);

  // const fetchTrainingPoints = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get('http://localhost:8080/admin/trainingpoint/all');
  //     const data = response.data.content || [];
  //     setTrainingPoints(data);
  //     const years = [...new Set(data.map(item => item.academicYear))];
  //     setAcademicYears(years);
  //     const semesterList = [...new Set(data.map(item => item.semester))];
  //     setSemesters(semesterList);
  //     setCurrentPage(1);
  //   } catch (error) {
  //     console.error('Error fetching training points:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   const fetchTrainingPoints = async () => {
//   setLoading(true);
//   try {
//     // Gọi song song 2 API: điểm rèn luyện và danh sách sinh viên
//     const [trainingRes, studentRes] = await Promise.all([
//       axios.get('http://localhost:8080/admin/trainingpoint/all'),
//       axios.get('http://localhost:8080/admin/student/all')
//     ]);

//     const trainingData = trainingRes.data.content || [];
//     const students = studentRes.data.content || [];

//     // Lấy danh sách maSV đang tồn tại
//     const existingMaSVs = new Set(students.map(student => student.maSV));

//     // Lọc ra các điểm rèn luyện có maSV còn tồn tại
//     const filteredTrainingData = trainingData.filter(item => existingMaSVs.has(item.maSV));

//     setTrainingPoints(filteredTrainingData);

//     // Lấy danh sách năm học và học kỳ từ dữ liệu đã lọc
//     const years = [...new Set(filteredTrainingData.map(item => item.academicYear))];
//     const semesterList = [...new Set(filteredTrainingData.map(item => item.semester))];

//     setAcademicYears(years);
//     setSemesters(semesterList);
//     setCurrentPage(1);
//   } catch (error) {
//     console.error('Error fetching training points or students:', error);
//   } finally {
//     setLoading(false);
//   }
// };

const fetchTrainingPoints = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://localhost:8080/admin/trainingpoint/all');
    const trainingData = response.data.content || [];

    // Không cần lọc theo isDelete nữa
    setTrainingPoints(trainingData);

    const years = [...new Set(trainingData.map(item => item.academicYear))];
    const semesterList = [...new Set(trainingData.map(item => item.semester))];

    setAcademicYears(years);
    setSemesters(semesterList);
    setCurrentPage(1);
  } catch (error) {
    console.error('Error fetching training points:', error);
  } finally {
    setLoading(false);
  }
};

// const fetchTrainingPoints = async () => {
//   setLoading(true);
//   try {
//     // Gọi API lấy toàn bộ điểm rèn luyện và sinh viên
//     const [trainingRes, studentRes] = await Promise.all([
//       axios.get('http://localhost:8080/admin/trainingpoint/all'),
//       axios.get('http://localhost:8080/admin/student/all')
//     ]);

//     // Dữ liệu điểm rèn luyện
//     const trainingData = trainingRes.data.content || [];

//     // Dữ liệu sinh viên và lọc sinh viên chưa bị xóa
//     const students = (studentRes.data.content || []).filter(student => student.isDelete === false);

//     // Tạo tập hợp các maSV hợp lệ (chưa bị xóa)
//     const existingMaSVs = new Set(students.map(student => student.idstudent));

//     // Lọc điểm rèn luyện chỉ của sinh viên chưa bị xóa
//     const filteredTrainingData = trainingData.filter(item => existingMaSVs.has(item.idstudent));

//     // Cập nhật state điểm rèn luyện
//     setTrainingPoints(filteredTrainingData);

//     // Lấy danh sách năm học và học kỳ từ dữ liệu đã lọc
//     const years = [...new Set(filteredTrainingData.map(item => item.academicYear))];
//     const semesterList = [...new Set(filteredTrainingData.map(item => item.semester))];

//     // Cập nhật state
//     setAcademicYears(years);
//     setSemesters(semesterList);
//     setCurrentPage(1);
//   } catch (error) {
//     console.error('Error fetching training points or students:', error);
//   } finally {
//     setLoading(false);
//   }
// };


  const handleSearchByYear = async (year) => {
    setSelectedYear(year);
    if (!year) {
      fetchTrainingPoints(currentPage);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/admin/trainingpoint/search/academicYear/${year}`);
      setTrainingPoints(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching by academic year:', error);
    }
  };

  const handleSearchByStudent = async () => {
    if (!studentId) {
      fetchTrainingPoints(currentPage);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/admin/trainingpoint/search/student/${studentId}`);
      setTrainingPoints(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching by student:', error);
    }
  };

  const handleResetSearch = () => {
    setSelectedYear(null); // Reset chọn năm học
    setStudentId(''); // Reset mã sinh viên
    fetchTrainingPoints(currentPage); // Lấy lại dữ liệu ban đầu
  };
  
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(trainingPoints);  // Chuyển dữ liệu sang dạng sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Training Points");  // Tạo file Excel và append sheet
    XLSX.writeFile(wb, "training_points.xlsx");  // Xuất file
  };

  const handleAddTrainingPoint = async () => {
    // Set loading state to true to indicate a loading operation is in progress
    setLoading(true);
  
    // 👉 Kiểm tra xem sinh viên đã có điểm cho học kỳ và năm học này chưa
    try {
      const response = await axios.get(`http://localhost:8080/admin/trainingpoint/search/student/${newPoint.studentId}`);
      const existingPoints = response.data;
  
      const alreadyExists = existingPoints.some(tp =>
        tp.semester === newPoint.semester && tp.academicYear === newPoint.academicYear
      );
  
      if (alreadyExists) {
        toast.error('Sinh viên đã có điểm rèn luyện cho học kỳ và năm học này!', {
          position: "top-center",
          autoClose: 3000,
        });
        // Reset loading state and exit function
        setLoading(false);
        return;
      }
  
      // Nếu chưa tồn tại thì thêm mới
      await axios.post('http://localhost:8080/admin/trainingpoint/add', newPoint);
      toast.success('Thêm điểm rèn luyện thành công!', { position: "top-center", autoClose: 1000 });
  
      // Close modal and reset newPoint state
      setIsModalOpen(false);
      resetFormData();
  
      // Fetch training points again to update the UI
      fetchTrainingPoints(currentPage);
    } catch (error) {
      console.error('Error adding training point:', error);
      toast.error('Thêm điểm rèn luyện thất bại!');
    } finally {
      // Reset loading state after the operation finishes
      setLoading(false);
    }

  };
  

 // Update training point
 const handleUpdateTrainingPoint = async () => {
  try {
    await axios.put(
      `http://localhost:8080/admin/trainingpoint/update/${selectedTrainingPoint.idPoint}`,
      newPoint
    );

    toast.success("Cập nhật điểm rèn luyện thành công!");

    // Đóng modal và reset trạng thái
    setIsModalOpen(false);
    fetchTrainingPoints(currentPage); // Load lại danh sách
    setSelectedTrainingPoint(); // Reset chọn
    setIsEditMode(false); // Thoát chế độ edit
    resetFormData(); // Xóa form
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    toast.error("Cập nhật sinh viên thất bại!", {
      position: "top-center",
      autoClose: 1000,
    });
  }
};

const handleDeleteTrainingPoint = async (id) => {
  if (!window.confirm('Bạn có chắc chắn muốn xóa điểm rèn luyện này?')) return;

  try {
    await axios.delete(`http://localhost:8080/admin/trainingpoint/delete/${id}`);

    toast.success('Xóa điểm rèn luyện thành công!', {
      position: 'top-center',
      autoClose: 1000,
    });

    // Tải lại danh sách
    fetchTrainingPoints(currentPage);
  } catch (error) {
    console.error('Lỗi khi xóa điểm rèn luyện:', error);
    toast.error('Xóa điểm rèn luyện thất bại!', {
      position: 'top-center',
      autoClose: 1000,
    });
  }
};

const handleEditTrainingPoint = (point) => {
  setSelectedTrainingPoint(point); // ⚠️ Thêm dòng này để lưu ID cần cập nhật

  setNewPoint({
    idPoint: point.idPoint,
    studentId: point.studentId,
    academicYear: point.academicYear,
    semester: point.semester,
    totalPoint: point.totalPoint,
    classification: point.classification,
    statusId: point.statusId,
  });

  setIsEditMode(true);
  setIsModalOpen(true);
};

// Reset form data when modal is closed or reset is required
const resetFormData = () => {
  setNewPoint({
    idPoint: '',
    studentId: '',
    academicYear: '',
    semester: '',
    totalPoint: '',
    classification: '',
    statusId: '',
  });
  setIsEditMode(false);
  setSelectedTrainingPoint(null); // cũng nên reset luôn
};

  const totalPages = Math.ceil(trainingPoints.length / rowsPerPage);
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = trainingPoints.slice(indexOfFirst, indexOfLast);


  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-center mb-10  text-indigo-600">Danh sách điểm rèn luyện</h1>

      <div className="flex mb-4">
  <button
   className="min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 mr-4"

    onClick={() => setIsModalOpen(true)}
  >
    Thêm điểm rèn luyện
  </button>
  <button
     className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 flex items-center space-x-2"
    onClick={handleExportExcel}
  >
    <FaFileExcel /> Xuất Excel
  </button>
</div>

      <div className="flex items-center mb-4 gap-4">
        <select
          className="border rounded px-3 py-2"
          value={selectedYear}
          onChange={(e) => handleSearchByYear(e.target.value)}
        >
          <option value="">-- Chọn năm học --</option>
          {academicYears.map((year, idx) => (
            <option key={idx} value={year}>{year}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nhập mã sinh viên"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border rounded px-3 py-2"
        />

      
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          onClick={handleSearchByStudent}
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="text-xl text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-indigo-600 text-white uppercase">
              <tr>
                <th className="px-4 py-2 border text-center">STT</th>
                <th className="px-4 py-2 border text-center">Mã SV</th>
                <th className="px-4 py-2 border text-center">Học kỳ</th>
                <th className="px-4 py-2 border text-center">Năm học</th>
                <th className="px-4 py-2 border text-center">Tổng điểm</th>
                <th className="px-4 py-2 border text-center">Xếp loại</th>
                <th className="px-4 py-2 border text-center">Ngày tạo</th>
                <th className="px-4 py-2 border text-center">Ngày cập nhật</th>
                <th className="px-4 py-2 border text-center">Trạng thái</th>
                <th className="px-4 py-2 border text-center">Đã xóa?</th>
                <th className="px-4 py-2 border text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {currentData.map((point, index) => (
            <tr key={index} className="hover:bg-gray-50">
            <td className="px-4 py-2 border text-center">{point.idPoint}</td>
            <td className="px-4 py-2 border text-center">{point.student?.fullName}</td>
            <td className="px-4 py-2 border text-center">{point.semester}</td>
            <td className="px-4 py-2 border text-center">{point.academicYear}</td>
            <td className="px-4 py-2 border text-center">{point.totalPoint}</td>
            <td className="px-4 py-2 border text-center">{point.classification}</td>
            <td className="px-4 py-2 border text-center">
              {point.createdAt ? new Date(point.createdAt).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-4 py-2 border text-center">
              {point.updatedAt ? new Date(point.updatedAt).toLocaleDateString() : 'N/A'}
            </td>
            <td className="px-4 py-2 border text-center">{point.status?.statusName}</td>
            <td className="px-4 py-2 border text-center">
              {point.isDelete ? '✔️' : '❌'}
            </td>
            <td className="px-4 py-2 border text-center">
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleEditTrainingPoint(point)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                >
                  <FaRegEdit /> Sửa
                </button>
                <button
                  onClick={() => handleDeleteTrainingPoint(point.idPoint)}  // Sử dụng point.idPoint thay vì point
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                >
                  <FaRegTrashAlt /> Xóa
                </button>

              </div>
            </td>
          </tr>
          
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-gray-700">Trang {currentPage} / {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* Modal Thêm Mới */}
      {isModalOpen && (
       <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
       <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
       <h2 className="text-2xl font-semibold text-white-600 mb-6 text-center">
  {isEditMode ? 'Cập nhật điểm rèn luyện' : 'Thêm điểm rèn luyện mới'}
</h2>
</div>
<h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center"></h2>
<div className="space-y-3">
  {/* Thêm input cho idPoint */}
  <input
    type="text"
    placeholder="ID Điểm"
    className="w-full border px-3 py-2 rounded"
    value={newPoint.idPoint} // Giả sử idPoint được đặt trong newPoint
    disabled // Không cho phép chỉnh sửa ID
  />
  <input
    type="text"
    placeholder="Mã sinh viên (ví dụ: 1)"
    className="w-full border px-3 py-2 rounded"
    value={newPoint.studentId}
    onChange={(e) => setNewPoint({ ...newPoint, studentId: e.target.value })}
  />
  <select
    className="w-full border px-3 py-2 rounded"
    value={newPoint.semester}
    onChange={(e) => setNewPoint({ ...newPoint, semester: e.target.value })}
  >
    <option value="">-- Chọn học kỳ --</option>
    {semesters.map((semester, idx) => (
      <option key={idx} value={semester}>{semester}</option>
    ))}
  </select>
  <input
    type="text"
    placeholder="Năm học (ví dụ: 2021-2022)"
    className="w-full border px-3 py-2 rounded"
    value={newPoint.academicYear}
    onChange={(e) => setNewPoint({ ...newPoint, academicYear: e.target.value })}
  />
  <input
    type="number"
    placeholder="Tổng điểm (ví dụ 0-100)"
    className="w-full border px-3 py-2 rounded"
    value={newPoint.totalPoint}
    onChange={(e) => setNewPoint({ ...newPoint, totalPoint: e.target.value })}
  />
  <select
    className="w-full border px-3 py-2 rounded"
    value={newPoint.classification}
    onChange={(e) => setNewPoint({ ...newPoint, classification: e.target.value })}
  >
    <option value="">-- Chọn xếp loại --</option>
    <option value="Xuất sắc">Xuất sắc</option>
    <option value="Giỏi">Tốt</option>
    <option value="Khá">Khá</option>
    <option value="Trung bình">Trung bình</option>
    <option value="Yếu">Yếu</option>
  </select>
  {/* Trường trạng thái */}
  <select
    className="w-full border px-3 py-2 rounded mb-4"
    value={newPoint.statusId}
    onChange={(e) => setNewPoint({ ...newPoint, statusId: e.target.value })}
  >
    <option value="">-- Chọn trạng thái --</option>
    <option value={1}>Đã duyệt</option>
    <option value={2}>Chờ duyệt</option>
    <option value={3}>Đã gửi</option>
    <option value={4}>Không hợp lệ</option>
    <option value={5}>Đang xử lý</option>
  </select>
</div>
<div className="flex justify-end mt-4 gap-2">
  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white">Hủy</button>
  <button
    onClick={isEditMode ? handleUpdateTrainingPoint : handleAddTrainingPoint}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    {isEditMode ? 'Cập nhật' : 'Lưu'}
  </button>
</div>
       </div>
     </div>
     
      )}
    </div>
  );
};

export default TrainingPoint;
