import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Activity, Image as ImageIcon, Settings, LogOut, MessageSquare } from 'lucide-react';
import '../styles/admin.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="admin-layout">
            <div className="admin-sidebar glass-panel">
                <div className="admin-logo">
                    <h2>Hệ Quản Trị</h2>
                    <p>Bản đồ tình nguyện</p>
                </div>

                <nav className="admin-nav">
                    <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <LayoutDashboard size={20} /> Tổng quan
                    </button>
                    <button className={`nav-item ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
                        <ImageIcon size={20} /> Quản lý Slider/Tin tức
                    </button>
                    <button className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
                        <FileText size={20} /> Quản lý Văn bản
                    </button>
                    <button className={`nav-item ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
                        <Activity size={20} /> Ban phong trào & KQ
                    </button>
                </nav>

                <div className="admin-footer-nav">
                    <Link to="/" className="nav-item">
                        <LogOut size={20} /> Về trang chủ
                    </Link>
                </div>
            </div>

            <div className="admin-main">
                <header className="admin-header glass-panel">
                    <h3>
                        {activeTab === 'dashboard' && 'Tổng quan hệ thống'}
                        {activeTab === 'news' && 'Quản lý Slider & Tin tức'}
                        {activeTab === 'documents' && 'Quản lý Văn bản chỉ đạo'}
                        {activeTab === 'activities' && 'Quản lý Ban phong trào & Kết quả'}
                    </h3>
                    <div className="admin-user-info">
                        <div className="avatar ui-circle">AD</div>
                        <span>Admin</span>
                    </div>
                </header>

                <div className="admin-content glass-panel">
                    {/* Dashboard Tab */}
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

                    {/* CRUD Placeholder cho các tab khác */}
                    {activeTab !== 'dashboard' && (
                        <div className="crud-placeholder">
                            <div className="crud-toolbar">
                                <button className="btn btn-primary hover-lift">Thêm mới +</button>
                                <input type="text" placeholder="Tìm kiếm..." className="search-input" />
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên / Tiêu đề</th>
                                        <th>Ngày cập nhật</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="5" className="empty-state">
                                            Đang tải dữ liệu từ Mock Data...
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
