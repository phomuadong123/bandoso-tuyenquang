import React from 'react';
import { Menu, Search } from 'lucide-react';

const Header = () => {
    return (
        <header className="main-header glass-panel">
                <img src="/images/anh-header-2.png" alt="TW Đoàn" className="full-width" />
                {/* <div className="header-actions">
                <button className="menu-toggle"><Menu size={24} /></button>
                </div> */}
            

            <nav className="header-nav">
                <ul>
                    <li className="active"><a href="/">Trang chủ</a></li>
                    <li><a href="#ban-do">Bản đồ số</a></li>
                    <li><a href="#ban-phong-trao">Ban phong trào</a></li>
                    <li><a href="http://tinhdoantuyenquang.vn/" target="_blank">Thông tin Tỉnh đoàn</a></li>
                    <li className="admin-link"><a href="/admin">Trang Quản Trị</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
