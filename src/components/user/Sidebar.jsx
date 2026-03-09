import React from 'react';
import { MOCK_DATA } from '../../data/mockData';
import { Volume2, Video, ExternalLink } from 'lucide-react';
import SidebarMedia from './SidebarMedia';
import DocumentWidget from './DocumentWidget';

const Sidebar = ({ className }) => {
    return (
        <div className={`sidebar glass-panel ${className}`}>
            {/* Văn bản chỉ đạo chạy từ trên xuống */}
            <DocumentWidget />

            {/* Truyền thông Audio/Video */}
           < SidebarMedia/>

            {/* Banner liên kết */}
            <div className="sidebar-widget banners-widget">
                <h3 className="widget-title">Liên kết Website</h3>
                <a href="http://doanthanhnien.vn" target="_blank" rel="noreferrer" className="banner-link hover-lift">
                    <img src="/images/logo-tw-doan.png" alt="TW Đoàn" className="banner-img" />
                </a>
                <a href="https://tuyenquang.gov.vn/" target="_blank" rel="noreferrer" className="banner-link hover-lift">
                    <div className="banner-placeholder">
                        Cổng TTĐT Tỉnh Tuyên Quang <ExternalLink size={16} />
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
