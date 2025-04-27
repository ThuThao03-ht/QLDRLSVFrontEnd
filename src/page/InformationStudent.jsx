// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const InformationStudent = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [student, setStudent] = useState(null);

//   useEffect(() => {
//     const fetchStudent = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/admin/student/${id}`);
//         setStudent(response.data);
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu sinh viên:", error);
//       }
//     };

//     fetchStudent();
//   }, [id]);

//   if (!student) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-lg text-gray-600">Đang tải dữ liệu sinh viên...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl">
//       <h1 className="text-3xl font-bold text-blue-700 mb-8 border-b pb-2">📘 Thông tin sinh viên</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 text-[16px]">
//         <div><span className="font-semibold">👤 Họ và tên:</span> {student.fullName}</div>
//         <div><span className="font-semibold">🎂 Ngày sinh:</span> {new Date(student.birthDay).toLocaleDateString()}</div>
//         <div><span className="font-semibold">⚧️ Giới tính:</span> {student.sex ? "Nam" : "Nữ"}</div>
//         <div><span className="font-semibold">🏫 Lớp:</span> {student.className}</div>
//         <div><span className="font-semibold">📚 Ngành:</span> {student.major?.majorName}</div>
//         <div><span className="font-semibold">🏛️ Khoa:</span> {student.major?.faculty?.facultyName}</div>
//         <div><span className="font-semibold">🌏 Dân tộc:</span> {student.ethnicity}</div>
//         <div><span className="font-semibold">🗺️ Quốc tịch:</span> {student.nationality}</div>
//         <div><span className="font-semibold">🏠 Địa chỉ:</span> {student.address}</div>
//         <div><span className="font-semibold">📞 Số điện thoại:</span> {student.phoneNumber}</div>
//         <div><span className="font-semibold">📧 Email:</span> {student.email}</div>
//       </div>

//       <div className="flex justify-end mt-10">
//         <button
//           onClick={() => navigate('/user/about')}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-md transition duration-300"
//         >
//           ← Quay lại
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InformationStudent;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const InformationStudent = () => {
  const navigate = useNavigate();
  const { name } = useParams(); // Lấy tên từ URL
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        // Giải mã tên người dùng nếu có từ URL
        const decodedName = name ? decodeURIComponent(name) : null;

        // Nếu không có name từ URL, lấy tên người dùng từ localStorage
        const userData = JSON.parse(localStorage.getItem("user"));
        const userName = decodedName || userData?.userName;

        if (!userName) {
          setError("Không tìm thấy tên người dùng. Vui lòng đăng nhập lại.");
          return;
        }

        const response = await axios.get(`http://localhost:8080/admin/student/search/name/${userName}`);
        
        if (response.data.length === 0) {
          setError("Không tìm thấy sinh viên với tên người dùng này.");
        } else {
          setStudent(response.data[0]); // Giả sử dữ liệu trả về có một sinh viên duy nhất
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sinh viên:", error);
        setError("Lỗi khi lấy dữ liệu sinh viên.");
      }
    };

    fetchStudent();
  }, [name]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Đang tải dữ liệu sinh viên...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 border-b pb-2">📘 Thông tin sinh viên</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 text-[16px]">
        <div><span className="font-semibold">👤 Họ và tên:</span> {student.fullName}</div>
        <div><span className="font-semibold">🎂 Ngày sinh:</span> {new Date(student.birthDay).toLocaleDateString()}</div>
        <div><span className="font-semibold">⚧️ Giới tính:</span> {student.sex ? "Nam" : "Nữ"}</div>
        <div><span className="font-semibold">🏫 Lớp:</span> {student.className}</div>
        <div><span className="font-semibold">📚 Ngành:</span> {student.major?.majorName}</div>
        <div><span className="font-semibold">🏛️ Khoa:</span> {student.major?.faculty?.facultyName}</div>
        <div><span className="font-semibold">🌏 Dân tộc:</span> {student.ethnicity}</div>
        <div><span className="font-semibold">🗺️ Quốc tịch:</span> {student.nationality}</div>
        <div><span className="font-semibold">🏠 Địa chỉ:</span> {student.address}</div>
        <div><span className="font-semibold">📞 Số điện thoại:</span> {student.phoneNumber}</div>
        <div><span className="font-semibold">📧 Email:</span> {student.email}</div>
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={() => navigate('/user/about')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-md transition duration-300"
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );
};

export default InformationStudent;
