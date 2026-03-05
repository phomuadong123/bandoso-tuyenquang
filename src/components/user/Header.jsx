import React from 'react';
import { Menu, Search } from 'lucide-react';

const Header = () => {
    return (
        <header className="main-header glass-panel">
            <div className="logos-group background-header">
            <div className="header-top">
                <img src="/images/logo-doan.png" alt="TW Đoàn" className="logo-doan" />
                <div className="site-titles">
                    <h1>BẢN ĐỒ SỐ TÌNH NGUYỆN</h1>
                    <h2>TỈNH ĐOÀN TUYÊN QUANG</h2>
                </div>
            </div>

                {/* <div className="header-actions">
                <button className="menu-toggle"><Menu size={24} /></button>
                </div> */}
            </div>

            <nav className="header-nav">
                <ul>
                    <li className="active"><a href="/">Trang chủ</a></li>
                    <li><a href="#tin-tuc">Tin tức & Sự kiện</a></li>
                    <li><a href="#ban-do">Bản đồ số</a></li>
                    <li><a href="#ban-phong-trao">Ban phong trào</a></li>
                    <li><a href="#thong-tin">Thông tin Tỉnh đoàn</a></li>
                    <li className="admin-link"><a href="/admin">Trang Quản Trị</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
