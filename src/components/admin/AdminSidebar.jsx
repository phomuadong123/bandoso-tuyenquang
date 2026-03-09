import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Activity, Image as ImageIcon, LogOut, Users, Video, Headphones } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="admin-sidebar glass-panel">
            <div className="admin-logo">
                <h2>Hệ Quản Trị</h2>
                <p>Bản đồ tình nguyện</p>
            </div>

            <nav className="admin-nav">
                <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                    <LayoutDashboard size={20} /> Tổng quan
                </button>
                <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    <Users size={20} /> Quản lý tài khoản
                </button>
                <button className={`nav-item ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
                    <ImageIcon size={20} /> Slider / Tin tức
                </button>
                <button className={`nav-item ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
                    <Video size={20} /> Video Tuyên truyền
                </button>
                <button className={`nav-item ${activeTab === 'audios' ? 'active' : ''}`} onClick={() => setActiveTab('audios')}>
                    <Headphones size={20} /> Audio / Podcast
                </button>
                <button className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
                    <FileText size={20} /> Văn bản chỉ đạo
                </button>
                <button className={`nav-item ${activeTab === 'committee' ? 'active' : ''}`} onClick={() => setActiveTab('committee')}>
                    <Activity size={20} /> Ban phong trào
                </button>
            </nav>

            <div className="admin-footer-nav">
                <Link to="/" className="nav-item">
                    <LogOut size={20} /> Về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;
