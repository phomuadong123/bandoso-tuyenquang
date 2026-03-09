import express from 'express';
import cors from 'cors';
import pool from './db.js';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Docker volume maps ./public/images to /app/public/images in backend container
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route Upload Image
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ url: '/images/' + req.file.filename });
  } else {
    res.status(400).json({ error: 'Vui lòng chọn ảnh' });
  }
});

// Lấy dữ liệu video/audio cho SidebarMedia
app.get('/api/videos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM videos ORDER BY id DESC');
    console.log(rows);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/audios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM audios ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1. Lấy thống kê chung
app.get('/api/statistics', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM statistics ORDER BY id DESC LIMIT 1');
    res.json(rows[0] ? {
      totalValue: rows[0].total_value,
      activitiesCount: rows[0].activities_count,
      volunteersCount: rows[0].volunteers_count,
      projectsCount: rows[0].projects_count
    } : {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Lấy danh sách tin tức
app.get('/api/news', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM news ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Lấy văn bản chỉ đạo
app.get('/api/documents', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM documents ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Lấy Ban phong trào
app.get('/api/committee', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM committee');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Lấy danh sách địa điểm bản đồ
app.get('/api/locations', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM locations');
    // Map data for client
    const locations = rows.map(r => ({
      id: r.id,
      name: r.name,
      coords: { lat: parseFloat(r.lat), lng: parseFloat(r.lng) },
      secretary: r.secretary,
      phone: r.phone,
      needs: r.needs,
      status: r.status,
      image: r.image
    }));
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO TIN TỨC (NEWS) ---
app.post('/api/news', async (req, res) => {
  const { title, image, date } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO news (title, image, date) VALUES (?, ?, ?)', [title, image, date]);
    res.json({ id: result.insertId, title, image, date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/news/:id', async (req, res) => {
  const { title, image, date } = req.body;
  try {
    await pool.query('UPDATE news SET title = ?, image = ?, date = ? WHERE id = ?', [title, image, date, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/news/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO VĂN BẢN (DOCUMENTS) ---
app.post('/api/documents', async (req, res) => {
  const { id, number, excerpt, date } = req.body;
  try {
    await pool.query('INSERT INTO documents (id, number, excerpt, date) VALUES (?, ?, ?, ?)', [id, number, excerpt, date]);
    res.json({ id, number, excerpt, date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/documents/:id', async (req, res) => {
  const { number, excerpt, date } = req.body;
  try {
    await pool.query('UPDATE documents SET number = ?, excerpt = ?, date = ? WHERE id = ?', [number, excerpt, date, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM documents WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO BAN PHONG TRÀO (COMMITTEE) ---
app.post('/api/committee', async (req, res) => {
  const { name, role, phone, avatar, unit } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO committee (name, role, phone, avatar, unit) VALUES (?, ?, ?, ?, ?)', [name, role, phone, avatar, unit]);
    res.json({ id: result.insertId, name, role, phone, avatar, unit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/committee/:id', async (req, res) => {
  const { name, role, phone, avatar, unit } = req.body;
  try {
    await pool.query('UPDATE committee SET name = ?, role = ?, phone = ?, avatar = ?, unit = ? WHERE id = ?', [name, role, phone, avatar, unit, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/committee/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM committee WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO VIDEOS ---
app.post('/api/videos', async (req, res) => {
  const { title, url } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO videos (title, url) VALUES (?, ?)', [title, url]);
    res.json({ id: result.insertId, title, url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/videos/:id', async (req, res) => {
  const { title, url } = req.body;
  try {
    await pool.query('UPDATE videos SET title = ?, url = ? WHERE id = ?', [title, url, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM videos WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO AUDIOS ---
app.post('/api/audios', async (req, res) => {
  const { title, url } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO audios (title, url) VALUES (?, ?)', [title, url]);
    res.json({ id: result.insertId, title, url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/audios/:id', async (req, res) => {
  const { title, url } = req.body;
  try {
    await pool.query('UPDATE audios SET title = ?, url = ? WHERE id = ?', [title, url, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/audios/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM audios WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- XÁC THỰC (AUTH) ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (rows.length > 0) {
      res.json({ success: true, user: { id: rows[0].id, username: rows[0].username, role: rows[0].role } });
    } else {
      res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO NGƯỜI DÙNG (USERS) ---
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role FROM users'); // Loại bỏ trả về password
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, password, role]);
    res.json({ id: result.insertId, username, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    if (password) { // Nếu có nhập password mới thì cập nhật
        await pool.query('UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?', [username, password, role, req.params.id]);
    } else {
        await pool.query('UPDATE users SET username = ?, role = ? WHERE id = ?', [username, role, req.params.id]);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server is running on port ${PORT}`);
});
