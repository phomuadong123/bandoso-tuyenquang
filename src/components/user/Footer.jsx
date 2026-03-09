import React from 'react';
import { Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content glass-panel-dark">
                <div className="footer-col brand-col">
                    <img src="/images/logo-doan.png" alt="Logo" className="footer-logo" />
                    <h3>TỈNH ĐOÀN TUYÊN QUANG</h3>
                    <p>Khát vọng - Tiên phong - Đoàn kết - Sáng tạo - Phát triển</p>
                </div>

                <div className="footer-col contact-col">
                    <h4>Thông tin liên hệ</h4>
                    <ul>
                        <li><MapPin size={16} /> Số 2, Đường 17/8, Phường Minh Xuân, TP. Tuyên Quang</li>
                        <li><Phone size={16} /> 0207 3822 666</li>
                        <li><Mail size={16} /> tinhdoantq@tuyenquang.gov.vn</li>
                    </ul>
                </div>

                <div className="footer-col link-col">
                    <h4>Kết nối mạng xã hội</h4>
                    <div className="social-links">
                        <a href="https://www.facebook.com/tinhdoantuyenquang" target="_blank" rel="noreferrer" className="social-icon fb">
                            <Facebook size={24} />
                        </a>
                        <a href="#" className="social-icon zalo">
                            <img src="/images/zalo-logo.svg" alt="Zalo" width="24" />
                        </a>
                        <p className="visit-count">Lượt truy cập hôm nay: <strong>356</strong></p>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Bản đồ số tình nguyện Tỉnh đoàn Tuyên Quang. Sản phẩm thiết kế Demo.</p>
            </div>
        </footer>
    );
};

export default Footer;
