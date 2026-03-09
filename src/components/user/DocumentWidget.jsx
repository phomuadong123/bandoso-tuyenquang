import React, { useState, useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { MOCK_DATA } from '../../data/mockData';
import { createPortal } from 'react-dom';
// Sử dụng lucide-react cho icon chuyên nghiệp (npm install lucide-react)
import { 
  ZoomIn, ZoomOut, Grid, List, Play, Search, Bookmark, Share2, MoreVertical,
  ChevronLeft, ChevronRight, X, 
  Copy,
  Plus,
  Minus
} from 'lucide-react';

const DocumentWidget = () => {
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [mounted, setMounted] = useState(false);
    const flipBookRef = useRef(null);
    const [zoom, setZoom] = useState(1); // Mặc định là 100%
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    // Hàm xử lý Zoom
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2)); // Tối đa x2
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5)); // Tối thiểu 0.5

    // Hàm Auto Play (tự động lật trang)
    useEffect(() => {
        let interval;
        if (isAutoPlay) {
            interval = setInterval(() => {
                if (flipBookRef.current) {
                    const pageFlip = flipBookRef.current.pageFlip();
                    if (pageFlip.getCurrentPageIndex() < pageFlip.getPageCount() - 1) {
                        pageFlip.flipNext();
                    } else {
                        setIsAutoPlay(false); // Hết trang thì dừng
                    }
                }
            }, 3000); // 3 giây lật 1 lần
        }
        return () => clearInterval(interval);
    }, [isAutoPlay]);

    // Đảm bảo Portal chỉ chạy sau khi DOM đã sẵn sàng
    useEffect(() => {
        setMounted(true);
    }, []);

    // Hàm đóng/mở Modal
    const handleViewDetail = (e, doc) => {
        e.preventDefault();
        setSelectedDoc(doc);
    };

    const closeModal = () => setSelectedDoc(null);

    // Hàm điều khiển lật trang bằng nút bấm
    const prevPage = () => {
        if (flipBookRef.current && flipBookRef.current.pageFlip) {
            flipBookRef.current.pageFlip().flipPrev();
        }
    };

    const nextPage = () => {
        if (flipBookRef.current && flipBookRef.current.pageFlip) {
            flipBookRef.current.pageFlip().flipNext();
        }
    };

    const portalNode = typeof document !== 'undefined' ? document.getElementById('portal-root') : null;

    return (
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
                                <a 
                                    href="#" 
                                    className="read-more" 
                                    onClick={(e) => handleViewDetail(e, doc)}
                                >
                                    Xem chi tiết &gt;
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL PORTAL */}
            {mounted && selectedDoc && portalNode && createPortal(
                <div className="flipbook-modal-overlay" onClick={closeModal}>
                    <div className="flipbook-modal-content" onClick={(e) => e.stopPropagation()}>
                        
                        {/* THANH TOOLBAR GIỐNG ẢNH MẪU */}
                        <div className="flipbook-toolbar" onClick={(e) => e.stopPropagation()}>
                            <div className="toolbar-group">
                                <button title="Thu nhỏ" onClick={handleZoomOut}>
                                    <ZoomOut size={18} />
                                </button>
                                <button title="Phóng to" onClick={handleZoomIn}>
                                    <ZoomIn size={18} />
                                </button>
                                {/* <button title="Lưới" onClick={() => alert("Tính năng xem lưới đang phát triển")}>
                                    <Grid size={18} />
                                </button>
                                <button title="Danh sách" onClick={() => alert("Mở mục lục văn bản")}>
                                    <List size={18} />
                                </button> */}
                            </div>
                            
                            <div className="toolbar-group">
                                <button 
                                    title={isAutoPlay ? "Dừng chạy" : "Chạy tự động"} 
                                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                                    style={{ color: isAutoPlay ? '#007bff' : 'inherit' }}
                                >
                                    <Play size={18} />
                                </button>
                                {/* <button title="Tìm kiếm" onClick={() => alert("Tìm kiếm trong văn bản...")}>
                                    <Search size={18} />
                                </button>
                                <button title="Đánh dấu" onClick={() => alert("Đã đánh dấu trang này")}>
                                    <Bookmark size={18} />
                                </button> */}
                            </div>

                            <div className="toolbar-group">
                                <button title="Chia sẻ" onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Đã sao chép liên kết tài liệu!");
                                }}>
                                    <Copy size={18} />
                                </button>
                                <button title="Thêm">
                                    <Minus size={18} onClick={() => closeModal()} />
                                </button>
                            </div>
                        </div>

                        {/* KHU VỰC HIỂN THỊ SÁCH VÀ ĐIỀU HƯỚNG */}
                        <div className="flipbook-viewport">
                            <button className="nav-btn prev" onClick={prevPage} title="Trang trước">
                                <ChevronLeft size={48} />
                            </button>

                            <div className="book-wrapper">
                                <HTMLFlipBook 
                                    width={400} 
                                    height={550} 
                                    ref={flipBookRef}
                                    className="flipbook-container"
                                    showCover={true}
                                    startPage={0}
                                    drawShadow={true}
                                    maxShadowOpacity={0.5}
                                >
                                    {/* Trang 1: Bìa */}
                                    <div className="page page-cover">
                                        <div className="page-inner">
                                            <h3>{selectedDoc.number}</h3>
                                            <hr />
                                            <p>Ngày ban hành: {selectedDoc.date}</p>
                                            <div className="stamp">VĂN BẢN QUẢN LÝ</div>
                                        </div>
                                    </div>
                                    
                                    {/* Trang 2: Nội dung */}
                                    <div className="page">
                                        <div className="page-inner">
                                            <h4>Nội dung trích yếu</h4>
                                            <p className="excerpt-text">{selectedDoc.excerpt}</p>
                                        </div>
                                    </div>

                                    {/* Trang 3: Chi tiết */}
                                    <div className="page">
                                        <div className="page-inner">
                                            <h4>Chi tiết văn bản</h4>
                                            <div className="dummy-text">
                                                Căn cứ quy định hiện hành... <br/>
                                                Điều 1: Phê duyệt nội dung... <br/>
                                                Điều 2: Tổ chức thực hiện...
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trang 4: Bìa sau */}
                                    <div className="page page-cover">
                                        <div className="page-inner">
                                            <p>Hết nội dung văn bản.</p>
                                            <div className="footer-logo">Bản đồ số Tuyên Quang</div>
                                        </div>
                                    </div>
                                </HTMLFlipBook>
                            </div>

                            <button className="nav-btn next" onClick={nextPage} title="Trang sau">
                                <ChevronRight size={48} />
                            </button>
                        </div>

                        <div className="modal-footer-hint">
                            Sử dụng nút bấm hoặc kéo góc trang để lật
                        </div>
                    </div>
                </div>,
                portalNode
            )}
        </div>
    );
};

export default DocumentWidget;