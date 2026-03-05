import React from 'react';
import { Volume2 } from 'lucide-react'; // Đảm bảo bạn đã cài lucide-react

const SidebarMedia = () => {
  return (
    <div className="sidebar-widget media-widget">
      <h3 className="widget-title">Góc truyền thông</h3>
      
       <a href="http://doanthanhnien.vn" target="_blank" rel="noreferrer" className="banner-link hover-lift">
            <img src="/images/tuoi-tre-thanh-nien.jpg" alt="TW Đoàn" className="banner-img" />
        </a>
      {/* Phần Video YouTube */}
      <div className="media-item">
        <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
          <iframe
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            src="https://www.youtube.com/embed/zJSfQxhg23c" // Thay ID video của bạn vào đây
            title="Video Tuyên truyền"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Phần Audio */}
      <div className="media-item audio-item" style={{ marginTop: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Volume2 size={20} className="audio-icon" style={{ marginRight: '8px', color: '#0056b3' }} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Bài ca Thanh niên VN.mp3</span>
        </div>
        <audio controls style={{ width: '100%', height: '35px' }}>
          <source src="audio/baicathanhnien.mp3" type="audio/mpeg" />
          Trình duyệt của bạn không hỗ trợ phát âm thanh.
        </audio>
      </div>

      <style jsx>{`

      `}</style>
    </div>
  );
};

export default SidebarMedia;