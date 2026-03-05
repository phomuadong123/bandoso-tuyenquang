import React from 'react';
import { MOCK_DATA } from '../../data/mockData';
import { Volume2, Video, ExternalLink } from 'lucide-react';
import SidebarMedia from './SidebarMedia';

const Sidebar = ({ className }) => {
    return (
        <div className={`sidebar glass-panel ${className}`}>
            {/* Văn bản chỉ đạo chạy từ trên xuống */}
            <div className="sidebar-widget docs-widget">
                <h3 className="widget-title">Văn bản chỉ đạo</h3>
                <div className="marquee-vertical">
                    <div className="marquee-vertical-content">
                        {MOCK_DATA.documents.map((doc, idx) => (
                            <div key={idx} className="doc-item hover-lift">
                                <span className="doc-number">{doc.number}</span>
                                <p className="doc-excerpt">{doc.excerpt}</p>
                                <div className="doc-meta">
                                    <span>{doc.date}</span>
                                    <a href="#" className="read-more">Xem chi tiết &gt;</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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
