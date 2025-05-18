// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Student = () => {
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8080/admin/student/all')
//       .then((response) => {
//         setStudents(response.data);
//       })
//       .catch((error) => {
//         console.error('Lỗi khi lấy dữ liệu sinh viên:', error);
//       });
//   }, []);

//   const renderSex = (sex) => (sex ? 'Nam' : 'Nữ');

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Danh sách sinh viên</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="border px-3 py-2">ID</th>
//               <th className="border px-3 py-2">Họ tên</th>
//               <th className="border px-3 py-2">Ngày sinh</th>
//               <th className="border px-3 py-2">Giới tính</th>
//               <th className="border px-3 py-2">Mã ngành</th>
//               <th className="border px-3 py-2">Lớp</th>
//               <th className="border px-3 py-2">Địa chỉ</th>
//               <th className="border px-3 py-2">Dân tộc</th>
//               <th className="border px-3 py-2">Quốc tịch</th>
//               <th className="border px-3 py-2">SĐT</th>
//               <th className="border px-3 py-2">Email</th>
//               <th className="border px-3 py-2">ID User</th>
//               <th className="border px-3 py-2">Trạng thái</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map((student) => (
//               <tr key={student.idStudent} className="text-center hover:bg-gray-100">
//                 <td className="border px-3 py-2">{student.idStudent}</td>
//                 <td className="border px-3 py-2">{student.fullName}</td>
//                 <td className="border px-3 py-2">{student.birthDay}</td>
//                 <td className="border px-3 py-2">{renderSex(student.sex)}</td>
//                 <td className="border px-3 py-2">{student.idMajor}</td>
//                 <td className="border px-3 py-2">{student.className}</td>
//                 <td className="border px-3 py-2">{student.address}</td>
//                 <td className="border px-3 py-2">{student.ethnicity}</td>
//                 <td className="border px-3 py-2">{student.nationality}</td>
//                 <td className="border px-3 py-2">{student.phoneNumber}</td>
//                 <td className="border px-3 py-2">{student.email}</td>
//                 <td className="border px-3 py-2">{student.userId}</td>
//                 <td className="border px-3 py-2">{student.isDelete ? 'Đã xóa' : 'Đang hoạt động'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Student;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegEdit,
          FaRegTrashAlt, FaFileExcel
 } from 'react-icons/fa';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



const Student = () => {
  const [students, setStudents] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const studentsPerPage = 5;
  const [newStudent, setNewStudent] = useState({
    idStudent: '',
    fullName: '',
    birthDay: '',
    sex: true,
    majorId: '',
    className: '',
    address: '',
    ethnicity: '',
    nationality: '',
    phoneNumber: '',
    email: '',
    userId: ''
  });


  const fetchStudents = (page = 1) => {
    axios.get(`http://localhost:8080/admin/student/all?page=${page - 1}&size=${studentsPerPage}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setStudents(res.data);
    
        } else if (res.data && Array.isArray(res.data.content)) {
          setStudents(res.data.content);
          setTotalPages(res.data.totalPages);
        } else {
          setStudents([]);
        }
       
      })
      .catch((err) => {
        console.error("Lỗi gọi API sinh viên:", err);
      });
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const renderSex = (sex) => (sex ? 'Nam' : 'Nữ');

  const handleSearch = () => {
    if (searchName.trim() === '') {
      fetchStudents(currentPage);
    } else {
      axios.get(`http://localhost:8080/admin/student/search/name/${searchName}`)
        .then((res) => {
          setStudents(res.data);
        })
        .catch((err) => {
          console.error("Lỗi gọi API tìm kiếm sinh viên:", err);
        });
    }
  };

  const handleResetSearch = () => {
    setSearchName('');
    fetchStudents();
  };

  // const handleAddStudent = () => {
  //   axios.post('http://localhost:8080/admin/student/add', newStudent)
  //     .then(() => {
  //       toast.success('Thêm sinh viên thành công!', { position: "top-center", autoClose: 1000 });
  //       setShowModal(false);
  //       fetchStudents(currentPage);
  //       resetForm();
  //     })
  //     .catch(() => {
  //       toast.error('Thêm sinh viên thất bại!', { position: "top-center", autoClose: 1000 });
  //     });
  // };
const handleAddStudent = () => {
  const { phoneNumber, email } = newStudent;

  // Kiểm tra số điện thoại (phải có đúng 10 chữ số)
  const isPhoneValid = /^\d{10}$/.test(phoneNumber);

  // Kiểm tra định dạng email
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isPhoneValid) {
    toast.error('Số điện thoại phải gồm đúng 10 chữ số!', {
      position: "top-center",
      autoClose: 2000,
    });
    return;
  }

  if (!isEmailValid) {
    toast.error('Email không đúng định dạng!', {
      position: "top-center",
      autoClose: 2000,
    });
    return;
  }

  // Nếu hợp lệ, gửi request thêm sinh viên
  axios.post('http://localhost:8080/admin/student/add', newStudent)
    .then(() => {
      toast.success('Thêm sinh viên thành công!', {
        position: "top-center",
        autoClose: 1000,
      });
      setShowModal(false);
      fetchStudents(currentPage);
      resetForm();
    })
    .catch(() => {
      toast.error('Thêm sinh viên thất bại!', {
        position: "top-center",
        autoClose: 1000,
      });
    });
};


  const handleUpdateStudent = () => {
    axios.put(`http://localhost:8080/admin/student/update/${newStudent.idStudent}`, newStudent)
      .then(() => {
        toast.success('Cập nhật sinh viên thành công!', { position: "top-center", autoClose: 1000 });
        setShowModal(false);
        fetchStudents(currentPage);
        resetForm();
      })
      .catch(() => {
        toast.error('Cập nhật sinh viên thất bại!', { position: "top-center", autoClose: 1000 });
      });
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;
  
    try {
      await axios.delete(`http://localhost:8080/admin/student/delete/${id}`);
  
      toast.success('Xóa sinh viên thành công!', {
        position: 'top-center',
        autoClose: 1000,
      });
  
      // Tải lại danh sách sinh viên
      fetchStudents(currentPage);
    } catch (error) {
      console.error('Lỗi khi xóa sinh viên:', error);
      toast.error('Xóa sinh viên thất bại!', {
        position: 'top-center',
        autoClose: 1000,
      });
    }
  };
  

  const handleEditStudent = (student) => {
    setNewStudent(student);
    setIsEditMode(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setNewStudent({
      idStudent: '',
      fullName: '',
      birthDay: '',
      sex: true,
      majorId: '',
      className: '',
      address: '',
      ethnicity: '',
      nationality: '',
      phoneNumber: '',
      email: '',
      userId: ''
    });
    setIsEditMode(false);
  };
  // Hàm xuất dữ liệu sinh viên ra file Excel
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);  // Chuyển dữ liệu sang dạng sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");  // Tạo file Excel và append sheet
    XLSX.writeFile(wb, "students.xlsx");  // Xuất file
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Danh sách sinh viên</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-start w-full gap-4">
  {/* Thanh tìm kiếm */}
  <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-md w-full sm:w-[400px]">
    <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
    </svg>
    <input
      type="text"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
      placeholder="Tìm kiếm sinh viên..."
      className="w-full focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
    />
  </div>

  {/* Các nút hành động */}
  <div className="flex flex-wrap gap-3">
    <button
      onClick={handleSearch}
      className="min-w-[120px] bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
    >
      Tìm
    </button>
    <button
      onClick={handleResetSearch}
      className="min-w-[120px] bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
    >
      Làm mới
    </button>
    <button
      onClick={() => {
        resetForm();
        setShowModal(true);
      }}
      className="min-w-[120px] bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition"
    >
      Thêm sinh viên
    </button>
    <button
      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors duration-300 flex items-center space-x-2"
      onClick={handleExportExcel}>
                <FaFileExcel />
                <span>Xuất Excel</span>
    </button>
  </div>
</div>




      {students.length === 0 ? (
        <div className="text-center text-gray-500">Không có dữ liệu sinh viên.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-blue-100 text-gray-700 uppercase">
              <tr className="text-left">
                {["ID", "Họ tên", "Ngày sinh", "Giới tính", "Mã ngành", "Lớp", "Địa chỉ", "Dân tộc", "Quốc tịch", "SĐT", "Email", "ID User", "Trạng thái", "Hành động"].map((title, i) => (
                  <th key={i} className="px-8 py-6 text-sm whitespace-nowrap">{title}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-8 py-6 text-sm">{student.idStudent}</td>
                  <td className="px-8 py-6 text-sm whitespace-nowrap">{student.fullName}</td>
                  <td className="px-8 py-6 text-sm">{student.birthDay}</td>
                  <td className="px-8 py-6 text-sm">{renderSex(student.sex)}</td>
                  <td className="px-8 py-6 text-sm">{student.major?.majorName || 'Chưa có thông tin'}</td>
                  <td className="px-8 py-6 text-sm">{student.className}</td>
                  <td className="px-8 py-6 text-sm">{student.address}</td>
                  <td className="px-8 py-6 text-sm">{student.ethnicity}</td>
                  <td className="px-8 py-6 text-sm">{student.nationality}</td>
                  <td className="px-8 py-6 text-sm">{student.phoneNumber}</td>
                  <td className="px-8 py-6 text-sm">{student.email}</td>
                  <td className="px-8 py-6 text-sm">{student.user?.userName}</td>
                  <td className="px-8 py-6 text-sm">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${student.isDelete ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {student.isDelete ? 'Đã xóa' : 'Đang hoạt động'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm">
                    <div className="flex space-x-4">
                    <button
                        onClick={() => handleEditStudent(student)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                      >
                        <FaRegEdit /> Sửa
                      </button>

                      <button
                       onClick={() => handleDeleteStudent(student.idStudent)}

                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2"
                      >
                        <FaRegTrashAlt />
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-center mt-4 space-x-8">
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          Trước
        </button>

        <span className="px-4 py-2 bg-gray-200 text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl shadow-xl">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-t-lg">
          <h2 className="text-2xl font-semibold text-white-600 mb-6 text-center">
              {isEditMode ? 'Cập nhật sinh viên' : 'Thêm sinh viên mới'}
            </h2>
                </div>
            
            <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center"></h2>
            {/* <div className="grid grid-cols-2 gap-4">
              {Object.keys(newStudent).map((key, i) => (
                <input
                  key={i}
                  type={key === 'birthDay' ? 'date' : 'text'}
                  placeholder={key}
                  value={newStudent[key]}
                  onChange={(e) =>
                    setNewStudent({
                      ...newStudent,
                      [key]: key === 'sex' ? e.target.value === 'true' : e.target.value
                    })
                  }
                  disabled={key === 'idStudent' && !isEditMode}
                  className="border border-gray-300 px-4 py-2 rounded w-full"
                />
              ))}
            </div> */}

            <div className="grid grid-cols-2 gap-4">
  <input
    type="text"
    placeholder="idStudent"
    value={newStudent.idStudent}
    onChange={(e) => setNewStudent({ ...newStudent, idStudent: e.target.value })}
    disabled={!isEditMode}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="text"
    placeholder="fullName"
    value={newStudent.fullName}
    onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="date"
    placeholder="birthDay"
    value={newStudent.birthDay}
    onChange={(e) => setNewStudent({ ...newStudent, birthDay: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="text"
    placeholder="sex"
    value={newStudent.sex}
    onChange={(e) =>
      setNewStudent({ ...newStudent, sex: e.target.value === 'true' })
    }
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

<input
  type="text"
  placeholder="majorId"
  value={newStudent.majorId}
  onChange={(e) => setNewStudent({ ...newStudent, majorId: e.target.value })}
  className="border border-gray-300 px-4 py-2 rounded w-full"
/>

  <input
    type="text"
    placeholder="className"
    value={newStudent.className}
    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="text"
    placeholder="address"
    value={newStudent.address}
    onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="text"
    placeholder="ethnicity"
    value={newStudent.ethnicity}
    onChange={(e) => setNewStudent({ ...newStudent, ethnicity: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="text"
    placeholder="nationality"
    value={newStudent.nationality}
    onChange={(e) => setNewStudent({ ...newStudent, nationality: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="text"
    placeholder="phoneNumber"
    value={newStudent.phoneNumber}
    onChange={(e) => setNewStudent({ ...newStudent, phoneNumber: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  <input
    type="text"
    placeholder="email"
    value={newStudent.email}
    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  {/* Trường hợp user.userId và user.userName */}
  <input
    type="text"
    placeholder="userId"
    value={newStudent.user?.userId || ""}
    onChange={(e) =>
      setNewStudent({
        ...newStudent,
        user: { ...newStudent.user, userId: e.target.value },
      })
    }
    className="border border-gray-300 px-4 py-2 rounded w-full"
  />

  {/* <input
    type="text"
    placeholder="userName"
    value={newStudent.user?.userName || ""}
    onChange={(e) =>
      setNewStudent({
        ...newStudent,
        user: { ...newStudent.user, userName: e.target.value },
      })
    }
    className="border border-gray-300 px-4 py-2 rounded w-full"
  /> */}
</div>

            <div className="flex justify-end mt-6">
              <button onClick={() => setShowModal(false)} className="mr-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
              <button
                onClick={isEditMode ? handleUpdateStudent : handleAddStudent}
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

export default Student;
