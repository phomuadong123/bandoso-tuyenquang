import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = () => {
    const [news, setNews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                if (!res.ok) throw new Error('Failed to fetch news');
                const data = await res.json();
                setNews(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchNews();
    }, []);

    useEffect(() => {
        if (news.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [news.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const getPrev = () => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    const getNext = () => setCurrentIndex((prev) => (prev + 1) % news.length);

    if (news.length === 0) {
        return (
            <div className="slider-wrapper glass-panel" id="tin-tuc">
                <div className="slider-loading">Đang tải tin tức...</div>
            </div>
        );
    }

    return (
        <div className="slider-wrapper glass-panel" id="tin-tuc">
            <div
                className="slider-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {news.map((item, index) => (
                    <div className="slide" key={item.id ?? index}>
                        <div className="slide-image-container">
                            <img src={item.image} alt={item.title} className="slide-image" />
                            <div className="slide-overlay">
                                <span className="slide-date">{item.date}</span>
                                <h3 className="slide-title">{item.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="slider-btn prev-btn" onClick={getPrev}><ChevronLeft /></button>
            <button className="slider-btn next-btn" onClick={getNext}><ChevronRight /></button>

            <div className="slider-dots">
                {news.map((item, index) => (
                    <button
                        key={item.id ?? index}
                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Slider;
