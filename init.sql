CREATE DATABASE IF NOT EXISTS bandoso_tq CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bandoso_tq;

-- Đảm bảo session MySQL dùng UTF8MB4 --
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

CREATE TABLE statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_active TINYINT(1) DEFAULT 1,
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
    is_active BOOL DEFAULT 1 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'guest') DEFAULT 'guest',
  is_active BOOL DEFAULT 1 NULL
);

CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_active BOOL DEFAULT 1 NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  is_active BOOL DEFAULT 1 NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id VARCHAR(50) PRIMARY KEY,
    number VARCHAR(100),
    file_path VARCHAR(255),
    excerpt TEXT,
    date VARCHAR(50),
    is_active BOOL DEFAULT 1 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE committee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150),
    role VARCHAR(100),
    phone VARCHAR(50),
    avatar VARCHAR(255),
    unit VARCHAR(150),
    is_active BOOL DEFAULT 1 NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    is_active BOOL DEFAULT 1 NULL,
    name VARCHAR(255),
    type VARCHAR(255),
    note TEXT
);

CREATE TABLE receipts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_id INT,
    number_of_support DECIMAL(12,2),
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

INSERT INTO users (username, password, role)
VALUES ('admin', '123', 'admin');

INSERT INTO statistics (total_value, activities_count, volunteers_count, projects_count)
VALUES ('15.5 Tỷ VNĐ', 320, 15400, 45);

INSERT INTO news (title, image, date) VALUES
('Hành trình Tháng Thanh Niên 2025 tại Tuyên Quang', '/images/news1.jpg', '26/03/2025'),
('Khánh thành công trình Thắp sáng đường quê', '/images/news2.jpg', '20/03/2025'),
('Tuổi trẻ Tuyên Quang chung tay bảo vệ môi trường', '/images/news3.jpg', '15/03/2025');

INSERT INTO videos (title, url) VALUES
('Hành trình Tháng Thanh Niên 2025 tại Tuyên Quang', 'https://www.youtube.com/embed/zJSfQxhg23c');

INSERT INTO audios (title, url) VALUES
('Thanh niên VN', '/images/1773738020337-471845361.mp3');

INSERT INTO documents (id, number, excerpt, date) VALUES
('VB01', '123-CV/TĐTN', 'V/v triển khai chiến dịch thanh niên tình nguyện hè năm 2025', '01/04/2025'),
('VB02', '124-KH/TĐTN', 'Kế hoạch tổ chức các hoạt động chào mừng kỷ niệm ngày thành lập Đoàn', '15/03/2025'),
('VB03', '125-TB/TĐTN', 'Thông báo kết quả cuộc thi sáng tạo khởi nghiệp thanh niên', '10/03/2025');

INSERT INTO committee (name, role, phone, avatar, unit) VALUES
('Đ/c Hoàng Tường Vi', 'Phó bí thư tỉnh đoàn', '0942.167.235', '/images/dc-huong-tuong-vi.jpg', 'Tỉnh đoàn Tuyên Quang'),
('Đ/c Lục Minh Hoài', 'Ban Phong trào', '0912.345.678', '/images/dc-luc-minh-hoai.jpg', 'Tỉnh đoàn Tuyên Quang'),
('Đ/c Nguyễn Văn A', 'Ban Phong trào', '0912.345.678', '/images/dc-nguyen-thi-hau.jpg', 'Tỉnh đoàn Tuyên Quang'),
('Đ/c Trần Thị B', 'Ban Phong trào', '0912.345.678', '/images/dc-nguyen-trung-kien.jpg', 'Tỉnh đoàn Tuyên Quang');
 
INSERT INTO bandoso_tq.activities (is_active,name,`type`,note) VALUES
	 (1,'Giúp đỡ người già neo đơn','Mô Hình',''),
	 (1,'Người em của Đoàn','Mô hình','note');
INSERT INTO bandoso_tq.receipts (activity_id,number_of_support,donor_name,donor_type,location_name,received_at,note) VALUES
	 (1,100.00,'Tỉnh Đoàn TQ','individual','TQ','2026-03-20 07:26:00','note');
INSERT INTO bandoso_tq.receipt_items (receipt_id,item_name,unit,quantity,unit_price,total_value,note) VALUES
	 (1,'bóng đèn','cái',100.00,100000.00,10000000.00,'');

