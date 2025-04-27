import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    content: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lấy danh sách liên hệ cũ trong localStorage
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];

    // Thêm liên hệ mới
    const newMessages = [...existingMessages, formData];

    // Lưu lại vào localStorage
    localStorage.setItem('contactMessages', JSON.stringify(newMessages));

    setMessage('Gửi liên hệ thành công!');
    setFormData({ name: '', email: '', content: '' });

    // Tự động xóa thông báo sau 5s
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Liên hệ với chúng tôi</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập họ tên của bạn"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email của bạn"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Nội dung</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập nội dung liên hệ"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition duration-300"
          >
            Gửi liên hệ
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 text-center font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Contact;
