import React, { useEffect, useState } from 'react';
import { Volume2, Video } from 'lucide-react';

const SidebarMedia = () => {
  const [videos, setVideos] = useState([]);
  const [audios, setAudios] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const [videoRes, audioRes] = await Promise.all([
          fetch('/api/videos'),
          fetch('/api/audios')
        ]);

        if (videoRes.ok) setVideos(await videoRes.json());
        if (audioRes.ok) setAudios(await audioRes.json());
      } catch (error) {
        console.error('Không thể tải dữ liệu media:', error);
      }
    };

    fetchMedia();
  }, []);

  return (
    <div className="sidebar-widget media-widget">
      <h3 className="widget-title">Góc truyền thông</h3>

      <a href="http://doanthanhnien.vn" target="_blank" rel="noreferrer" className="banner-link hover-lift">
        <img src="/images/tuoi-tre-thanh-nien.jpg" alt="TW Đoàn" className="banner-img" />
      </a>
      {/* Phần Video YouTube */}
      <div className="media-item">
        <h4 className="media-title"><Video size={18} style={{ marginRight: 8 }} /> Video mới nhất</h4>
        {videos.length === 0 ? (
          <p>Đang tải video...</p>
        ) : (
          videos.slice(0, 2).map((video) => (
            <div
              key={video.id}
              className="video-wrapper"
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '12px'
              }}
            >
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))
        )}
      </div>

      {/* Phần Audio */}
      <div className="media-item audio-item" style={{ marginTop: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Volume2 size={20} className="audio-icon" style={{ marginRight: '8px', color: '#0056b3' }} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Audio mới nhất</span>
        </div>

        {audios.length === 0 ? (
          <p>Đang tải audio...</p>
        ) : (
          audios.slice(0, 2).map((audio) => (
            <div key={audio.id} className="audio-item-row" style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: 13, marginBottom: 4 }}>{audio.title}</div>
              <audio controls style={{ width: '100%', height: '35px' }}>
                <source src={audio.url} type="audio/mpeg" />
              </audio>
            </div>
          ))
        )}
      </div>

      <style jsx>{`

      `}</style>
    </div>
  );
};

export default SidebarMedia;