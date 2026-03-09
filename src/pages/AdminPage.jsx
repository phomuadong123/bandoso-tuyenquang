import React, { useState } from 'react';
import '../styles/admin.css';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import CrudTable from '../components/admin/CrudTable';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    // Cấu hình bảng Tin tức
    const newsColumns = [
        { key: 'id', label: 'ID' },
        { key: 'image', label: 'Hình ảnh', render: (val) => val ? <img src={val} alt="Img" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : 'Không có ảnh' },
        { key: 'title', label: 'Tiêu đề' },
        { key: 'date', label: 'Ngày đăng' }
    ];
    const newsFields = [
        { key: 'title', label: 'Tiêu đề sự kiện' },
        { key: 'date', label: 'Ngày đăng (VD: 26/03/2024)' },
        { key: 'image', label: 'Ảnh đại diện sự kiện', type: 'file' }
    ];

    // Cấu hình bảng Văn Bản
    const docColumns = [
        { key: 'id', label: 'Mã' },
        { key: 'number', label: 'Số hiệu, Ký hiệu' },
        { key: 'date', label: 'Ngày ban hành' },
        { key: 'excerpt', label: 'Trích yếu' }
    ];
    const docFields = [
        { key: 'id', label: 'Mã văn bản (VD: VB04)' },
        { key: 'number', label: 'Số hiệu (VD: 126-CV/TĐTN)' },
        { key: 'date', label: 'Ngày ban hành' },
        { key: 'excerpt', label: 'Nội dung trích yếu', type: 'textarea' }
    ];

    // Cấu hình bảng Ban Phong trào
    const comColumns = [
        { key: 'id', label: 'ID' },
        { key: 'avatar', label: 'Ảnh', render: (val) => val ? <img src={val} alt="Img" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }} /> : 'Không có ảnh' },
        { key: 'name', label: 'Họ tên' },
        { key: 'role', label: 'Chức vụ' },
        { key: 'unit', label: 'Đơn vị' },
        { key: 'phone', label: 'Số điện thoại' }
    ];
    const comFields = [
        { key: 'name', label: 'Họ và Tên' },
        { key: 'role', label: 'Chức danh' },
        { key: 'unit', label: 'Đơn vị công tác' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'avatar', label: 'Ảnh đại diện', type: 'file' }
    ];

    // Cấu hình bảng Users
    const userColumns = [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Tên đăng nhập' },
        { key: 'role', label: 'Quyền hạn', render: (val) => <span style={{ background: val === 'admin' ? '#ffebee' : '#e3f2fd', color: val === 'admin' ? '#c62828' : '#1565c0', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{val.toUpperCase()}</span> }
    ];
    const userFields = [
        { key: 'username', label: 'Tên đăng nhập' },
        { key: 'password', label: 'Mật khẩu (Bỏ trống nếu không đổi, bắt buộc nếu thêm mới)' },
        { key: 'role', label: 'Quyền hạn (Nhập admin hoặc guest)' }
    ];

    // Cấu hình bảng Video
    const videoColumns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Tiêu đề Video' },
        { key: 'url', label: 'Link Embed (YouTube)' }
    ];
    const videoFields = [
        { key: 'title', label: 'Tiêu đề Video' },
        { key: 'url', label: 'Link iframe YouTube (VD: https://www.youtube.com/embed/zJSfQxhg23c)' }
    ];

    // Cấu hình bảng Audio
    const audioColumns = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Tên Bản Thu / Lời Nhạc' },
        { key: 'url', label: 'Đường dẫn file Âm thanh', render: (val) => <audio controls style={{ height: 30 }}><source src={val} /></audio> }
    ];
    const audioFields = [
        { key: 'title', label: 'Tên Audio / Tên Bài Hát' },
        { key: 'url', label: 'File Âm thanh (.mp3)', type: 'file' }
    ];

    return (
        <div className="admin-layout">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="admin-main">
                <AdminHeader title={
                    activeTab === 'dashboard' ? 'Tổng quan hệ thống' :
                        activeTab === 'users' ? 'Quản lý Tài khoản (Users)' :
                            activeTab === 'news' ? 'Quản lý Slider & Tin tức' :
                                activeTab === 'videos' ? 'Quản lý Video Tuyên truyền' :
                                    activeTab === 'audios' ? 'Quản lý Audio / Podcast' :
                                        activeTab === 'documents' ? 'Quản lý Văn bản chỉ đạo' :
                                            'Quản lý Ban phong trào & Kết quả'
                } />

                <div className="admin-content glass-panel">
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <h4>Tổng số người dùng</h4>
                                <h2>1.240</h2>
                            </div>
                            <div className="stat-card">
                                <h4>Lượt truy cập hôm nay</h4>
                                <h2>356</h2>
                            </div>
                            <div className="stat-card">
                                <h4>Quỹ đóng góp mới</h4>
                                <h2>12.5M VNĐ</h2>
                            </div>
                        </div>
                    )}

                    {activeTab === 'news' && (
                        <CrudTable
                            title="Danh sách Tin tức & Sự kiện"
                            endpoint="/api/news"
                            columns={newsColumns}
                            formFields={newsFields}
                        />
                    )}

                    {activeTab === 'videos' && (
                        <CrudTable
                            title="Danh sách Video YouTube"
                            endpoint="/api/videos"
                            columns={videoColumns}
                            formFields={videoFields}
                        />
                    )}

                    {activeTab === 'audios' && (
                        <CrudTable
                            title="Danh sách File Âm thanh (.mp3)"
                            endpoint="/api/audios"
                            columns={audioColumns}
                            formFields={audioFields}
                        />
                    )}

                    {activeTab === 'documents' && (
                        <CrudTable
                            title="Danh sách Văn bản Pháp quy"
                            endpoint="/api/documents"
                            columns={docColumns}
                            formFields={docFields}
                        />
                    )}

                    {activeTab === 'users' && (
                        <CrudTable
                            title="Danh sách Tài khoản Hệ thống"
                            endpoint="/api/users"
                            columns={userColumns}
                            formFields={userFields}
                        />
                    )}

                    {activeTab === 'committee' && (
                        <CrudTable
                            title="Danh sách Nhân sự Ban Phong Trào"
                            endpoint="/api/committee"
                            columns={comColumns}
                            formFields={comFields}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
