import React from 'react';
import Header from '../components/user/Header';
import Sidebar from '../components/user/Sidebar';
import Slider from '../components/user/Slider';
import MainContent from '../components/user/MainContent';
import Chatbot from '../components/user/Chatbot';
import Footer from '../components/user/Footer';
import '../styles/home.css';

const HomePage = () => {
    return (
        <div className="home-layout">
            <Header />

            <div className="container main-wrapper">
                <Sidebar className="sidebar-section" />

                <div className="content-section">
                    <Slider />
                    <MainContent />
                </div>
            </div>

            <Footer />
            <Chatbot />
        </div>
    );
};

export default HomePage;
