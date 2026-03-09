import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/admin.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (data.success) {
                // Lưu vào local storage
                localStorage.setItem('user', JSON.stringify(data.user));
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    alert('Xin lỗi, chỉ có Admin mới được vào trang quản trị.');
                    navigate('/'); // Có thể chuyển hướng Guest về trang chủ
                }
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            console.error(err);
            setError('Lỗi kết nối tới Server');
        }
    };

    return (
        <div className="admin-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '16px' }}>
                <div className="admin-logo">
                    <h2>ĐĂNG NHẬP</h2>
                    <p>Hệ thống Bản đồ số tình nguyện</p>
                </div>
                {error && <div style={{ color: '#ff3b30', background: 'rgba(255,59,48,0.1)', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleLogin} className="crud-form">
                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
                        Đăng nhập
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="btn btn-secondary" style={{ width: '100%', marginTop: '12px', textAlign: 'center', display: 'block' }}>
                        Quay lại trang chủ
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
