import React from 'react';
import { LogOut } from 'lucide-react';

const AdminHeader = ({ title }) => {
    return (
        <header className="admin-header glass-panel">
            <h3>{title}</h3>
            <div className="admin-user-info">
                <div className="avatar ui-circle">AD</div>
                <span>Admin</span>
                <button
                    onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}
                    style={{ background: 'transparent', border: 'none', color: '#ff3b30', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '16px', fontWeight: '500' }}
                >
                    <LogOut size={18} /> Đăng xuất
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
