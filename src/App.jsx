import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

// Component Bảo vệ Tuyến đường
const ProtectedRoute = ({ children }) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return <Navigate to="/login" />;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
        return <Navigate to="/login" />; // Hoặc trang cấm
    }
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/*" element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
