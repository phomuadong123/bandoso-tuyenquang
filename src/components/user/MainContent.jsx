import React, { useState } from 'react';
import { MOCK_DATA } from '../../data/mockData';
import { MapPin, Phone, Users, CheckCircle, Info, Heart, ChevronRight } from 'lucide-react';

const MainContent = () => {
    const { locations, committee, statistics } = MOCK_DATA;
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMarkerClick = (loc) => {
        setSelectedLocation(loc);
    };

let start = 0;
const visible = 3;

function showLegend(){

    const items = document.querySelectorAll("#legendContainer .legend-item");

    items.forEach((item, index) => {

        if(index >= start && index < start + visible){
            item.style.display = "block";
        }else{
            item.style.display = "none";
        }

    });
}

function nextLegend(){

    const items = document.querySelectorAll("#legendContainer .legend-item");

    start += visible;

    if(start >= items.length){
        start = 0;
    }

    showLegend();
}

showLegend();

    return (
        <div className="main-content-area" >

            {/* KHU VỰC BẢN ĐỒ VÀ MÔ TẢ */}
            <div className="map-section glass-panel" style={{ marginBottom: '20px' }} id="ban-do">
                <h3 className="section-title"  style={{ marginBottom: '0' }}>Bản Đồ Số Tình Nguyện (Điểm Tiếp Nhận Kết Nối Tình Nguyện)</h3>
                <p className="section-description">Danh sách các địa điểm, thông tin kết nối, tiếp nhận nguồn lực tổ chức các hoạt động tình nguyện do các cấp bộ Đoàn làm đầu mối</p>

                <div className="map-container">
                    {/* Iframe Google My Maps */}
                    <div className="google-map-embed">
                        <iframe
                            src="https://www.google.com/maps/d/u/0/embed?mid=1Y7V10Hzt9EYHf7j1Dg74vbBlSaEpgVk&ehbc=2E312F"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Google My Map Tuyen Quang"
                        ></iframe>
                        <div class="marquee-container">
                            <div class="marquee-text">
                               Tỉnh đoàn - Hội LHTN Việt Nam tỉnh Tuyên Quang rất mong được tiếp đón nhận sự ủng hộ của các tổ chức, cá nhân, nhà hảo tâm để cùng chung tay hỗ trợ các địa phương trong tỉnh thực hiện tốt công tác an sinh xã hội, chăm lo cho người nghèo, người có hoàn cảnh khó khăn trên địa bàn tỉnh. Mọi sự ủng hộ xin gửi về: Tỉnh đoàn - Hội LHTN Việt Nam tỉnh Tuyên Quang, Địa chỉ: Đường 17/8, Phường Minh Xuân - Thành phố Tuyên Quang - Tỉnh Tuyên Quang. Điện thoại: 0207 3822 666 
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chú thích Bản đồ */}
                <div class="map-legend-wrapper">
                    <div className="map-legend" id="legendContainer">
                        <div className="legend-item"><img src="/images/tim-kiem.png" alt="Tìm kiếm" /> <span>Tìm kiếm địa điểm</span></div>
                        <div className="legend-item"><img src="/images/em-nuoi.png" alt="Đang cần hỗ trợ" /> <span>Nhu cầu em nuôi của Đoàn</span></div>
                        <div className="legend-item"><img src="/images/ngoi-nha.png" alt="Đang cần hỗ trợ" /> <span>Ngôi nhà hạnh phúc</span></div>
                        <div className="legend-item"><img src="/images/ngoi-nha-yeu-thuong.png" alt="Đang cần hỗ trợ" /> <span>Ngôi nhà yêu thương</span></div>
                        <div className="legend-item"><img src="/images/truong-hoc.png" alt="Trường" /> <span>Trường đẹp cho em</span></div>
                        <div className="legend-item"><img src="/images/cong-trinh.png" alt="Công trìnhh" /> <span>Công trình đường điện thắp sáng đường quê</span></div>
                    </div>
                        <button class="legend-next" onClick={() => nextLegend()}> <ChevronRight /> </button>

                </div>
            </div>

            {/* THÔNG TIN KẾT QUẢ VÀ BAN PHONG TRÀO */}
            <div className="main-content-area" id="ban-phong-trao">
                {/* Ban Phong trào */}
                <div className="committee-section glass-panel" style={{ marginBottom: '20px' }} >
                    <h3 className="section-title"><Users /> Ban Phong trào Tỉnh đoàn</h3>
                    <div className="committee-list">
                        {committee.map((member, idx) => (
                            <div className="committee-card hover-lift" key={idx}>
                                <img src={member.avatar} style={{width: 200, height: 200 }} alt={member.name} className="c-avatar" />
                                <div className="c-info">
                                    <h4 className="c-name">{member.name}</h4>
                                    <span className="c-role">{member.role}</span>
                                    <span className="c-phone"><Phone size={12} /> {member.phone}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="main-content-area" >

                {/* Kết quả Tình nguyện */}
                <div className="stats-section glass-panel" id="thong-tin">
                    <h3 className="section-title"><ActivityIcon /> Kết quả các hoạt động</h3>
                   <div className="report-container">
                    {/* Tiêu đề và Thời gian */}
                    <div className="report-header">
                        <h2 className="main-title">Kết quả tiếp nhận đến thời điểm</h2>
                        <div className="timestamp-badge">
                        4 Tháng ba, 2026 9:57 sáng
                        </div>
                    </div>

                    <div className="report-content">
                        {/* Khối MÔ HÌNH */}
                        <div className="report-card">
                        <div className="card-body">
                            <div className="info-group main-info">
                            <span className="badge-blue">MÔ HÌNH</span>
                            <h4 className="item-name">Người em của Đoàn</h4>
                            </div>
                            
                            <div className="info-group">
                            <span className="info-label">Năm thành lập:</span>
                            <span className="info-value">2021</span>
                            </div>

                            <div className="info-group">
                            <span className="info-label">Số lượng em hỗ trợ:</span>
                            <span className="info-value">210</span>
                            </div>

                            <div className="info-group">
                            <span className="info-label">Trung bình mức hỗ trợ hàng tháng:</span>
                            <span className="info-value">200 nghìn - 2 triệu VNĐ</span>
                            </div>
                        </div>
                        <div className="card-arrow">
                        </div>
                        </div>

                        {/* Khối ĐỊA ĐIỂM */}
                        <div className="report-card">
                        <div className="card-body">
                            <div className="info-group main-info">
                            <span className="badge-blue">ĐỊA ĐIỂM</span>
                            <h4 className="item-name">Tiếp nhận nguồn lực hỗ trợ</h4>
                            </div>
                            
                            <div className="info-group">
                            <span className="info-label">Quy mô tiếp nhận thực hiện:</span>
                            <span className="info-value bold">Cấp xã</span>
                            </div>

                            <div className="info-group">
                            <span className="info-label">Số lượng điểm:</span>
                            <span className="info-value">143 xã</span>
                            </div>

                            <div className="info-group">
                            <span className="info-label">Đã tiếp nhận trong năm 2023:</span>
                            <span className="info-value">3.51 tỷ đồng</span>
                            </div>
                        </div>
                        <div className="card-arrow">
                            
                        </div>
                        </div>

                        {/* Khối MÔ HÌNH */}
                        <div className="report-card">
                        <div className="card-body">
                            <div className="info-group main-info">
                            <span className="badge-blue">MÔ HÌNH</span>
                            <h4 className="item-name">Phụng dường người già neo đơn</h4>
                            </div>
                            
                            <div className="info-group">
                            <span className="info-label">Số lượng hỗ trợ lâu dài</span>
                            <span className="info-value bold">68</span>
                            </div>

                            <div className="info-group">
                            <span className="info-label">Đã tiếp nhận (tổng trị giá):</span>
                            <span className="info-value">2.1 tỷ đồng</span>
                            </div>
                        </div>
                        <div className="card-arrow">
                            
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ActivityIcon = () => <CheckCircle size={20} style={{ marginRight: '8px', verticalAlign: 'middle', color: 'var(--primary)' }} />;

export default MainContent;
