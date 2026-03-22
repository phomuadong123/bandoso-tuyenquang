import React, { useState, useEffect, useRef } from 'react';
import { Phone, Users, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import MapComponent from './MapComponent';
import CustomMapSearch from './MapComponent';
import CardSlider from './CardSlider';

const MainContent = () => {
    const [locations, setLocations] = useState([]);
    const [committee, setCommittee] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locRes, committeeRes, statsRes] = await Promise.all([
                    fetch('/api/locations'),
                    fetch('/api/committee'),
                    fetch('/api/activities/support-summary')
                ]);

                if (locRes.ok) setLocations(await locRes.json());
                if (committeeRes.ok) setCommittee(await committeeRes.json());
                if (statsRes.ok) setStatistics(await statsRes.json());
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        fetchData();
    }, []);

    const formatVietnameseDate = (dateInput) => {
        const date = new Date(dateInput);

        const datePart = new Intl.DateTimeFormat("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);

        // Lấy giờ và phút
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");

        const period = hours >= 12 ? "chiều" : "sáng";
        hours = hours % 12 || 12;

        return `${datePart} ${hours}:${minutes} ${period}`;
    };

    const handleMarkerClick = (loc) => {
        setSelectedLocation(loc);
    };

    const startRef = useRef(0);
    const visible = 4;

    const showLegend = () => {
        const items = document.querySelectorAll('#legendContainer .legend-item');
        items.forEach((item, index) => {
            if (index >= startRef.current && index < startRef.current + visible) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };

    const nextLegend = () => {
        const items = document.querySelectorAll('#legendContainer .legend-item');
        startRef.current += visible;
        if (startRef.current >= items.length) {
            startRef.current = 0;
        }
        showLegend();
    };

    useEffect(() => {
        showLegend();
    }, []);

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollRef.current;
        if (container) {
            const firstCard = container.querySelector('.committee-card');
            if (!firstCard) return;

            const cardWidth = firstCard.offsetWidth + 20;

            container.scrollBy({
                left: direction === 'left' ? -cardWidth : cardWidth,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="main-content-area" >

            {/* KHU VỰC BẢN ĐỒ VÀ MÔ TẢ */}
            <div className="map-section glass-panel" style={{ marginBottom: '20px' }} id="ban-do">
                <h3 className="section-title" style={{ marginBottom: '0' }}>Bản Đồ Số Tình Nguyện (Điểm Tiếp Nhận Kết Nối Tình Nguyện)</h3>
                <p className="section-description">Danh sách các địa điểm, thông tin kết nối, tiếp nhận nguồn lực tổ chức các hoạt động tình nguyện do các cấp bộ Đoàn làm đầu mối</p>

                <div className="map-container">
                    {/* Iframe Google My Maps */}
                    {/* <MapComponent/> */}
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
                            <div class="marquee-content">
                                <span>
                                    Tỉnh đoàn - Hội LHTN - Hội đồng đội Việt Nam tỉnh Tuyên Quang rất mong được tiếp đón nhận sự ủng hộ của các tổ chức, cá nhân, nhà hảo tâm để cùng chung tay hỗ trợ các địa phương trong tỉnh thực hiện tốt công tác an sinh xã hội, chăm lo cho người nghèo, người có hoàn cảnh khó khăn trên địa bàn tỉnh. Mọi sự ủng hộ xin gửi về: Tỉnh đoàn - Hội LHTN Việt Nam tỉnh Tuyên Quang, Địa chỉ: Đường 17/8, Phường Minh Xuân - Tỉnh Tuyên Quang . Điện thoại: 0207 3822 666
                                </span>
                                <span>
                                    Tỉnh đoàn - Hội LHTN - Hội đồng đội Việt Nam tỉnh Tuyên Quang rất mong được tiếp đón nhận sự ủng hộ của các tổ chức, cá nhân, nhà hảo tâm để cùng chung tay hỗ trợ các địa phương trong tỉnh thực hiện tốt công tác an sinh xã hội, chăm lo cho người nghèo, người có hoàn cảnh khó khăn trên địa bàn tỉnh. Mọi sự ủng hộ xin gửi về: Tỉnh đoàn - Hội LHTN Việt Nam tỉnh Tuyên Quang, Địa chỉ: Đường 17/8, Phường Minh Xuân - Tỉnh Tuyên Quang . Điện thoại: 0207 3822 666
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chú thích Bản đồ */}
                <div className="map-legend-wrapper">
                    <div className="map-legend" id="legendContainer">
                        <div className="legend-item"><img src="/images/tim-kiem.png" alt="Tìm kiếm" /> <span>Tìm kiếm địa điểm</span></div>
                        <div className="legend-item"><img src="/images/nha-khan-quang-do.png" alt="Công trìnhh" /> <span>Nhà khăn quàng đỏ</span></div>
                        <div className="legend-item"><img src="/images/truong-dep-cho-em.png" alt="Trường" /> <span>Nhiều nhu cầu khác</span></div>
                        <div className="legend-item"><img src="/images/ngoi-nha.png" alt="Đang cần hỗ trợ" /> <span>Ngôi nhà hạnh phúc</span></div>
                        <div className="legend-item"><img src="/images/ngoi-nha-yeu-thuong.png" alt="Đang cần hỗ trợ" /> <span>Ngôi nhà yêu thương</span></div>
                        <div className="legend-item"><img src="/images/cong-trinh.png" alt="Công trìnhh" /> <span>Công trình thắp sáng đường quê</span></div>
                        <div className="legend-item"><img src="/images/truong-hoc.png" alt="Công trìnhh" /> <span>Trường đẹp cho em</span></div>
                    </div>
                    <button className="legend-next" onClick={() => nextLegend()}> <ChevronRight /> </button>

                </div>
            </div>

            {/* THÔNG TIN KẾT QUẢ VÀ BAN PHONG TRÀO */}
            <div className="main-content-area" id="ban-phong-trao">
                <div className="committee-section glass-panel" style={{ marginBottom: '20px' }}>
                    <h3 className="section-title"><Users /> Ban Quản Trị Tỉnh Đoàn</h3>

                    <div className="slider-container">
                        {/* Chỉ hiển thị nút khi có nhiều hơn 4 thành viên */}
                        {committee.length > 4 && (
                            <>
                                <button className="nav-btn left" onClick={() => scroll('left')}><ChevronLeft /></button>
                                <button className="nav-btn right" onClick={() => scroll('right')}><ChevronRight /></button>
                            </>
                        )}

                        <div className="committee-list slider-mode" ref={scrollRef}>
                            {committee.map((member, idx) => (
                                <div className="committee-card hover-lift" key={idx}>
                                    <img src={member.avatar} style={{ width: 200, height: 200 }} alt={member.name} className="c-avatar" />
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
                                {formatVietnameseDate(new Date())}
                            </div>
                        </div>

                        <div className="report-content">
                            {/* Khối MÔ HÌNH */}
                            {/* <CardSlider data={statistics} /> */}
                            <div className="report-card">
                                <div className="card-body">
                                    <div className="info-group main-info">
                                        <span className="badge-blue">MÔ HÌNH</span>
                                        <h4 className="item-name">Phụng dưỡng người già neo đơn</h4>
                                    </div>

                                    <div className="info-group">
                                        <span className="info-label">Số lượng hỗ trợ lâu dài:</span>
                                        <span className="info-value">68</span>
                                    </div>

                                    <div className="info-group">
                                        <span className="info-label">Đã tiếp nhận (tổng trị giá):</span>
                                        <span className="info-value">2.1 tỷ đồng</span>
                                    </div>
                                </div>
                            </div>


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
                                        <span className="info-value">200 nghìn - 2 triệu VND</span>
                                    </div>
                                </div>
                            </div>

                            <div className="report-card">
                                <div className="card-body">
                                    <div className="info-group main-info">
                                        <span className="badge-blue">ĐỊA ĐIỂM</span>
                                        <h4 className="item-name">Tiếp nhận nguồn lực hỗ trợ</h4>
                                    </div>

                                    <div className="info-group">
                                        <span className="info-label">Quy mô tiếp nhận thực hiện:</span>
                                        <span className="info-value">Cấp Xã</span>
                                    </div>

                                    <div className="info-group">
                                        <span className="info-label">Số lượng điểm:</span>
                                        <span className="info-value">124 xã</span>
                                    </div>

                                    <div className="info-group">
                                        <span className="info-label">Đã tiếp nhận trong năm 2023</span>
                                        <span className="info-value">3.51 tỷ đồng</span>
                                    </div>
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
