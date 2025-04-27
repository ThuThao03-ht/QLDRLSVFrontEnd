import React from 'react';

const About = () => {
  return (
    <div className="bg-blue-50 min-h-screen flex justify-center items-center py-12">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-4xl w-full space-y-12">
        {/* Header */}
        <div className="p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
            Giới thiệu về Hệ thống Quản lý Điểm Rèn Luyện Sinh Viên
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Hệ thống Quản lý Điểm Rèn Luyện Sinh Viên được thiết kế để hỗ trợ các cơ sở giáo dục và sinh viên theo dõi quá trình học tập và rèn luyện của mình. 
            Ứng dụng giúp quản lý điểm rèn luyện sinh viên một cách khoa học và hiệu quả, đảm bảo rằng mọi hoạt động rèn luyện đều được ghi nhận và đánh giá đầy đủ.
          </p>
        </div>

        {/* Features Section */}
        <div className="p-8 rounded-lg shadow-lg bg-gray-50">
          <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Các Tính Năng Chính</h2>
          <ul className="list-disc pl-6 space-y-3 text-gray-700 text-lg">
            <li>Quản lý điểm rèn luyện của sinh viên theo từng học kỳ và năm học.</li>
            <li>Cung cấp thông tin chi tiết về lớp học, ngành học, khoa và trạng thái điểm của sinh viên.</li>
            <li>Cung cấp chức năng tìm kiếm và lọc thông tin theo các tiêu chí như năm học, học kỳ và xếp loại.</li>
            <li>Giúp sinh viên theo dõi quá trình rèn luyện và phản hồi các thông tin một cách minh bạch.</li>
            <li>Hỗ trợ gửi phản hồi từ sinh viên về hệ thống điểm và các vấn đề liên quan.</li>
          </ul>
        </div>

        {/* Benefits Section */}
        <div className="p-8 rounded-lg shadow-lg bg-gray-50">
          <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Lợi ích</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Ứng dụng giúp giảm thiểu sự phức tạp trong việc theo dõi và quản lý điểm rèn luyện của sinh viên. 
            Nó không chỉ giúp sinh viên nắm bắt được kết quả học tập của mình mà còn giúp các giảng viên và cán bộ quản lý dễ dàng theo dõi và cập nhật thông tin một cách nhanh chóng, chính xác.
          </p>
        </div>

        {/* Goals Section */}
        <div className="p-8 rounded-lg shadow-lg bg-gray-50">
          <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">Mục tiêu</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Mục tiêu của hệ thống là tạo ra một công cụ đơn giản nhưng mạnh mẽ, giúp cải thiện quá trình học tập và phát triển của sinh viên, đồng thời tăng cường sự minh bạch và hiệu quả trong công tác quản lý giáo dục.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
