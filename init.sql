CREATE DATABASE IF NOT EXISTS bandoso_tq CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bandoso_tq;

CREATE TABLE statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_active TINYINT(1) DEFAULT 0,
    total_value VARCHAR(100),
    activities_count INT,
    volunteers_count INT,
    projects_count INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    image VARCHAR(255),
    date VARCHAR(50),
    is_active BOOL DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  secretary VARCHAR(255),
  phone VARCHAR(50),
  needs TEXT,
  status VARCHAR(100),
  is_active BOOL DEFAULT 0 NULL,
  image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'guest') DEFAULT 'guest',
  is_active BOOL DEFAULT 0 NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_active BOOL DEFAULT 0 NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_active BOOL DEFAULT 0 NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id VARCHAR(50) PRIMARY KEY,
    number VARCHAR(100),
    excerpt TEXT,
    date VARCHAR(50),
    is_active BOOL DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE committee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    role VARCHAR(100),
    phone VARCHAR(50),
    avatar VARCHAR(255),
    unit VARCHAR(150),
    is_active BOOL DEFAULT 0 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    type ENUM('model', 'location', 'program'),
    note TEXT
);

CREATE TABLE receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT,
    
    donor_name VARCHAR(255),
    donor_type ENUM('individual', 'organization'),
    
    location_name VARCHAR(255), -- lưu text cho nhanh
    
    received_at DATETIME,
    note TEXT,

    FOREIGN KEY (activity_id) REFERENCES activities(id)
);

CREATE TABLE receipt_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    receipt_id INT,

    item_name VARCHAR(255),     -- tiền, gạo, sách...
    unit VARCHAR(50),           -- VND, kg, quyển

    quantity DECIMAL(12,2),
    unit_price DECIMAL(12,2),
    total_value DECIMAL(18,2),

    note TEXT,

    FOREIGN KEY (receipt_id) REFERENCES receipts(id)
);

-- SEED DATA --
INSERT INTO statistics (total_value, activities_count, volunteers_count, projects_count)
VALUES ('15.5 Tỷ VNĐ', 320, 15400, 45);

INSERT INTO news (title, image, date) VALUES
('Hành trình Tháng Thanh Niên 2024 tại Tuyên Quang', '/images/news1.jpg', '26/03/2024'),
('Khánh thành công trình Thắp sáng đường quê', '/images/news2.jpg', '20/03/2024'),
('Tuổi trẻ Tuyên Quang chung tay bảo vệ môi trường', '/images/news3.jpg', '15/03/2024');

INSERT INTO documents (id, number, excerpt, date) VALUES
('VB01', '123-CV/TĐTN', 'V/v triển khai chiến dịch thanh niên tình nguyện hè năm 2024', '01/04/2024'),
('VB02', '124-KH/TĐTN', 'Kế hoạch tổ chức các hoạt động chào mừng kỷ niệm ngày thành lập Đoàn', '15/03/2024'),
('VB03', '125-TB/TĐTN', 'Thông báo kết quả cuộc thi sáng tạo khởi nghiệp thanh niên', '10/03/2024');

INSERT INTO committee (name, role, phone, avatar, unit) VALUES
('Đ/c Nguyễn Văn A', 'Trưởng ban Phong trào', '0987.654.321', '/images/cay-da-tan-trao.jpg', 'Tỉnh đoàn Tuyên Quang'),
('Đ/c Trần Thị B', 'Phó ban Phong trào', '0912.345.678', '/images/cay-da-tan-trao.jpg', 'Tỉnh đoàn Tuyên Quang');

INSERT INTO locations (id, name, lat, lng, secretary, phone, needs, status, image) VALUES
('X01', 'Xã Tân Trào (Sơn Dương)', 21.6886, 105.4746, 'Lê Văn C - Bí thư Đoàn xã', '0988.111.222', 'Hỗ trợ xây dựng sân chơi cho trẻ em, tặng sách vở cho học sinh nghèo.', 'Đang cần hỗ trợ', '/images/cay-da-tan-trao.jpg'),
('X02', 'Phường Minh Xuân (TP. Tuyên Quang)', 21.8211, 105.2152, 'Nguyễn Thị D - Bí thư Đoàn phường', '0977.333.444', 'Hỗ trợ dọn dẹp vệ sinh môi trường, thu gom rác thải nhựa đê kè hồ điều hoà.', 'Đã hoàn thành', '/images/cot-co-lung-cu.jpg'),
('X03', 'Xã Hồng Thái (Na Hang)', 22.4501, 105.3524, 'Bàn Văn E - Bí thư Đoàn xã', '0966.555.666', 'Hỗ trợ lắp đặt hệ thống đèn đường năng lượng mặt trời (3km).', 'Đang triển khai', '/images/xa-hong-thai.jpg'),
('X04', 'Xã Xuân Lập (Lâm Bình)', 22.5123, 105.1234, 'Chảo Phúc F - Bí thư Đoàn xã', '0955.777.888', 'Hỗ trợ áo ấm mùa đông cho 200 em học sinh tiểu học.', 'Đang cần hỗ trợ', '/images/news1.jpg'),
('X05', 'Thị trấn Vĩnh Lộc (Chiêm Hóa)', 22.1487, 105.2678, 'Hoàng Thị G - Bí thư Đoàn thị trấn', '0944.999.000', 'Tổ chức lớp dạy bơi miễn phí cho trẻ em dịp hè.', 'Đang lên kế hoạch', '/images/news3.jpg');
