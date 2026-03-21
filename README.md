# Bản đồ số - Ban Thiện nguyện Tuyên Quang

Website thông tin và quản lý hoạt động thiện nguyện tỉnh Tuyên Quang.

**Stack:** React (Vite) + Node.js (Express) + MySQL 8.0 + Nginx + Docker

---

## 📋 Yêu cầu máy chủ (Server Requirements)

| Thành phần | Phiên bản tối thiểu |
|---|---|
| OS | Ubuntu 20.04+ / CentOS 8+ |
| Docker | 24.x+ |
| Docker Compose | v2.x+ |
| RAM | 1 GB+ |
| Disk | 10 GB+ |
| Port mở | 22 (SSH), 80 (HTTP) |

---

## 🚀 Hướng dẫn Deploy Production (Từng bước)

### Bước 1 — SSH vào máy chủ

```bash
ssh username@<IP_SERVER>
# Ví dụ:
ssh root@192.168.1.100
```

> Nếu dùng key SSH:
> ```bash
> ssh -i ~/.ssh/id_rsa root@192.168.1.100
> ```

---

### Bước 2 — Cài đặt Docker (nếu chưa có)

```bash
# Cập nhật package list
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com | sh

# Thêm user hiện tại vào group docker (không cần sudo mỗi lần)
sudo usermod -aG docker $USER

# Kích hoạt Docker khởi động cùng hệ thống
sudo systemctl enable docker
sudo systemctl start docker

# Kiểm tra phiên bản
docker --version
docker compose version
```

---

### Bước 3 — Clone source code lên server

```bash
# Di chuyển tới thư mục làm việc
cd /opt

# Clone repository
sudo git clone https://github.com/<your-org>/bandoso-tuyenquang.git

# Vào thư mục project
cd bandoso-tuyenquang

# Phân quyền cho thư mục nếu cần
sudo chown -R $USER:$USER /opt/bandoso-tuyenquang
```

> Nếu repository **private**, cần cấu hình SSH key hoặc dùng Personal Access Token:
> ```bash
> git clone https://<TOKEN>@github.com/<your-org>/bandoso-tuyenquang.git
> ```

---

### Bước 4 — Tạo file `.env` (Thông tin nhạy cảm)

> ⚠️ **File `.env` KHÔNG được commit lên Git.** Phải tạo thủ công trên server.

```bash
# Sao chép file mẫu
cp .env.example .env

# Mở và chỉnh sửa thông tin thực tế
nano .env
```

Nội dung file `.env` cần điền:

```env
# --- CẤU HÌNH DATABASE ---
MYSQL_ROOT_PASSWORD=Mat_Khau_Manh_Cua_Ban!
MYSQL_DATABASE=bandoso_tq

# --- CẤU HÌNH BACKEND ---
DB_HOST=db
DB_USER=root
DB_PASSWORD=Mat_Khau_Manh_Cua_Ban!
DB_NAME=bandoso_tq
PORT=3000
NODE_ENV=production
```

> 💡 **Lưu ý mật khẩu mạnh:** Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt. Ví dụ: `BandosoTQ@2024#!`

---

### Bước 5 — Tạo thư mục upload (volumes)

```bash
# Tạo thư mục lưu ảnh và file upload của backend
mkdir -p public/images
mkdir -p public/uploads
```

---

### Bước 6 — Build và khởi chạy toàn bộ hệ thống

```bash
# Build image và start tất cả container ở background
docker compose up -d --build
```

> Lần đầu chạy sẽ mất **3–10 phút** để pull image MySQL, build frontend và backend.

---

### Bước 7 — Kiểm tra trạng thái

```bash
# Xem danh sách container đang chạy
docker compose ps

# Kết quả mong đợi:
# NAME                STATUS              PORTS
# bandoso_db          running (healthy)   3306/tcp
# bandoso_backend     running             3000/tcp
# bandoso_frontend    running             0.0.0.0:80->80/tcp
```

```bash
# Xem log theo dõi toàn bộ (Ctrl+C để thoát)
docker compose logs -f

# Xem log riêng từng service
docker compose logs -f backend
docker compose logs -f db
docker compose logs -f frontend
```

---

### Bước 8 — Kiểm tra website

Mở trình duyệt và truy cập:

```
http://<IP_SERVER>
```

Thử gọi API kiểm tra backend:

```bash
curl http://<IP_SERVER>/api/statistics
```

---

## 🔄 Cập nhật code (Re-deploy)

Khi có code mới cần deploy lại:

```bash
# Di chuyển vào thư mục project
cd /opt/bandoso-tuyenquang

# Pull code mới nhất từ Git
git pull origin main

# Rebuild và restart (chỉ build lại image thay đổi)
docker compose up -d --build

# Xem log để kiểm tra không có lỗi
docker compose logs -f --tail=50
```

---

## 🛑 Dừng / Khởi động lại hệ thống

```bash
# Dừng tất cả container (giữ nguyên data)
docker compose stop

# Khởi động lại tất cả container
docker compose start

# Dừng và xóa container (giữ nguyên volume/data)
docker compose down

# Dừng và xóa TOÀN BỘ kể cả data database ⚠️ CẨN THẬN
docker compose down -v
```

---

## 💾 Backup Database

```bash
# Backup database vào file sql
docker exec bandoso_db mysqldump -u root -p"${MYSQL_ROOT_PASSWORD}" bandoso_tq > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database từ file backup
docker exec -i bandoso_db mysql -u root -p"${MYSQL_ROOT_PASSWORD}" bandoso_tq < backup_20240101_120000.sql
```

---

## 🔧 Các lệnh hữu ích khác

```bash
# Vào shell trong container backend (debug)
docker exec -it bandoso_backend sh

# Vào MySQL trong container database
docker exec -it bandoso_db mysql -u root -p

# Xem resource sử dụng (CPU/RAM) của container
docker stats

# Xóa image cũ không dùng để giải phóng disk
docker image prune -f

# Xem log với số dòng giới hạn
docker compose logs --tail=100 backend
```

---

## 📂 Cấu trúc thư mục

```
bandoso-tuyenquang/
├── .env                    # ⚠️ Không commit - thông tin nhạy cảm
├── .env.example            # File mẫu - có thể commit
├── .dockerignore           # Loại trừ file khi build image frontend
├── docker-compose.yml      # Orchestration tất cả services
├── Dockerfile              # Build image Frontend (React + Nginx)
├── nginx.conf              # Cấu hình Nginx (proxy, cache, security)
├── init.sql                # SQL khởi tạo database lần đầu
├── public/
│   ├── images/             # 📁 Volume - ảnh upload (mount vào backend)
│   └── uploads/            # 📁 Volume - file upload (mount vào backend)
├── src/                    # Source code React frontend
├── backend/
│   ├── .dockerignore       # Loại trừ file khi build image backend
│   ├── Dockerfile          # Build image Backend (Node.js)
│   ├── server.js           # Express API server
│   ├── db.js               # Kết nối MySQL pool
│   └── package.json
└── README.md
```

---

## 🏗️ Kiến trúc hệ thống

```
Internet
    │
    │ :80
    ▼
┌─────────────────────────────────────────────────────┐
│                  Docker Network (bandoso_net)        │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │         Nginx (bandoso_frontend :80)         │   │
│  │  - Serve React SPA static files              │   │
│  │  - Proxy /api/* → backend:3000               │   │
│  │  - Proxy /uploads/* → backend:3000           │   │
│  └────────────────────┬─────────────────────────┘   │
│                       │ internal                    │
│  ┌────────────────────▼─────────────────────────┐   │
│  │      Node.js Express (bandoso_backend)        │   │
│  │  - REST API /api/*                            │   │
│  │  - File upload /api/upload                    │   │
│  └────────────────────┬─────────────────────────┘   │
│                       │ internal                    │
│  ┌────────────────────▼─────────────────────────┐   │
│  │         MySQL 8.0 (bandoso_db)               │   │
│  │  - Dữ liệu lưu trong Docker Volume           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

> **Lưu ý bảo mật:** Database và Backend KHÔNG expose port ra ngoài internet. Chỉ Nginx (port 80) là public.

---

## ❗ Xử lý sự cố thường gặp

### Container backend không start được

```bash
# Xem log lỗi
docker compose logs backend

# Nguyên nhân thường gặp: DB chưa sẵn sàng
# Giải pháp: Chờ DB healthy rồi restart backend
docker compose restart backend
```

### Lỗi "Permission denied" khi upload ảnh

```bash
# Phân quyền thư mục upload
chmod -R 777 public/images public/uploads
```

### Website không truy cập được

```bash
# Kiểm tra port 80 có đang mở không
sudo ufw allow 80/tcp
sudo ufw status

# Kiểm tra container frontend có chạy không
docker compose ps frontend
docker compose logs frontend
```

### Reset và chạy lại từ đầu (giữ nguyên .env)

```bash
# Dừng và xóa tất cả container + volume
docker compose down -v

# Build lại từ đầu
docker compose up -d --build
```