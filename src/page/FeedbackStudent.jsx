import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeedbackStudent = () => {
    const [userName, setUserName] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('Đang chờ');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const response = await axios.post(
                `http://localhost:8080/admin/feedback/add/name?userName=${encodeURIComponent(userName)}`,
                {
                    content: content,
                    status: status
                }
            );
    
            if (response.status >= 200 && response.status < 300) {
                toast.success(response.data, {
                    position: 'top-center',
                    autoClose: 1500,
                });
    
                // Reset form
                setUserName('');
                setContent('');
                setStatus('Đang chờ');
            }
        } catch (error) {
            console.error('Lỗi khi gửi feedback:', error);
            toast.error('Đã xảy ra lỗi khi gửi feedback!', {
                position: 'top-center',
                autoClose: 1500,
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="max-w-2xl mx-auto p-6 border border-gray-300 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Gửi Feedback</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="userName" className="block text-sm font-semibold mb-2">Tên người dùng</label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên người dùng (VD: Phạm Quốc Huy)"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-semibold mb-2">Nội dung</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Mô tả lỗi hoặc phản hồi"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="status" className="block text-sm font-semibold mb-2">Trạng thái</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Đang chờ">Đang chờ</option>
                    </select>
                </div>

                <div className="mb-4">
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi Feedback'}
                    </button>
                </div>
            </form>

            {/* Toast message container */}
            <ToastContainer />
        </div>
    );
};

export default FeedbackStudent;
