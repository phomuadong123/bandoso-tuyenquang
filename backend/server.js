import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Ensure upload directories exist so multer won't fail with ENOENT
const imageDir = path.join(process.cwd(), "public", "images");
const uploadDir = path.join(process.cwd(), "public", "uploads");
fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Docker volume maps ./public/images to /app/public/images in backend container
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// Route Upload Image (vẫn hỗ trợ upload file nhị phân lớn)
app.post("/api/upload", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "Tệp quá lớn, cho phép tối đa 500MB" });
      }
      return next(err);
    }

    if (req.file) {
      return res.json({ url: "/images/" + req.file.filename });
    }

    // Nếu không có image, thử upload bằng field file (cho mp4, mp3, ...)
    upload.single("file")(req, res, (err2) => {
      if (err2) {
        if (err2.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({ error: "Tệp quá lớn, cho phép tối đa 500MB" });
        }
        return next(err2);
      }

      if (req.file) {
        return res.json({ url: "/uploads/" + req.file.filename });
      }

      res.status(400).json({ error: "Vui lòng chọn tệp" });
    });
  });
});

// Serve uploaded files (pdf/doc/audio/video/etc)
// Serve static uploaded images and files
app.use(
  "/images",
  express.static(path.join(process.cwd(), "public", "images")),
);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads")),
);

// Route Upload Generic File (pdf/doc/docx/mp3...)
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const uploadFile = multer({ storage: fileStorage, limits: { fileSize: 500 * 1024 * 1024 } });

app.post("/api/upload-file", (req, res, next) => {
  uploadFile.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "Tệp quá lớn, cho phép tối đa 500MB" });
      }
      return next(err);
    }

    if (req.file) {
      res.json({ url: "/uploads/" + req.file.filename });
    } else {
      res.status(400).json({ error: "Vui lòng chọn tệp" });
    }
  });
});

app.get("/api/activities/support-summary", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
          a.id,
          a.name AS title,
          a.type ,
          COALESCE(SUM(r.amount_of_support), 0) AS totalMoney,
          COALESCE(SUM(ri.total_value), 0) AS totalItemsValue,
          COALESCE(SUM(r.amount_of_support), 0) + COALESCE(SUM(ri.total_value), 0) AS totalSupport
      FROM activities a
      JOIN receipts r ON r.activity_id = a.id
      LEFT JOIN receipt_items ri ON ri.receipt_id = r.id
      GROUP BY a.id
    `);

    const normalized = rows.map((row) => ({
      id: row.id,
      title: row.title,
      totalMoney: row.totalMoney || 0,
      totalItemsValue: row.totalItemsValue || 0,
      totalSupport: row.totalSupport || 0,
    }));

    res.json(normalized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const [[userRow]] = await pool.query(`
      SELECT COUNT(*) AS totalUsers FROM users
    `);

    const [[fundRow]] = await pool.query(`
      SELECT 
        SUM(ri.total_value) AS items
      FROM receipts r
      LEFT JOIN receipt_items ri ON ri.receipt_id = r.id
    `);

    res.json({
      totalUsers: userRow.totalUsers,
      fundItemsValue: fundRow.items 
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/statistics", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM statistics ORDER BY id DESC LIMIT 1",
    );
    res.json(
      rows[0]
        ? {
            totalValue: rows[0].total_value,
            activitiesCount: rows[0].activities_count,
            volunteersCount: rows[0].volunteers_count,
            projectsCount: rows[0].projects_count,
          }
        : {},
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getData = (table, orderBy) => async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true";

    let query = `SELECT * FROM ${table}`;
    if (!isAdmin) {
      query += " WHERE is_active = 1";
    }
    query += ` ORDER BY ${orderBy}`;

    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
app.get("/api/documents", getData("documents", "date DESC"));
app.get("/api/news", getData("news", "date DESC"));
app.get("/api/videos", getData("videos", "id ASC"));
app.get("/api/audios", getData("audios", "id ASC"));
app.get("/api/committee", getData("committee", "id ASC"));
app.get("/api/activities", getData("activities", "id DESC"));

// --- CRUD CHO TIN TỨC (NEWS) ---
app.post("/api/news", async (req, res) => {
  const { title, image, date, is_active = 1 } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO news (title, image, date, is_active) VALUES (?, ?, ?, ?)",
      [title, image, date, is_active],
    );
    res.json({ id: result.insertId, title, image, date, is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/news/:id", async (req, res) => {
  const { title, image, date, is_active } = req.body;
  try {
    await pool.query(
      "UPDATE news SET title = ?, image = ?, date = ?, is_active = ? WHERE id = ?",
      [title, image, date, is_active, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/news/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM news WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO VĂN BẢN (DOCUMENTS) ---
app.post("/api/documents", async (req, res) => {
  const { id, number, excerpt, date, file_path, is_active = 1 } = req.body;
  try {
    await pool.query(
      "INSERT INTO documents (id, number, excerpt, date, file_path, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [id, number, excerpt, date, file_path, is_active],
    );
    res.json({ id, number, excerpt, date, file_path, is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/documents/:id(*)", async (req, res) => {
  const { number, excerpt, date, file_path, is_active } = req.body;
  try {
    if (file_path) {
      await pool.query(
        "UPDATE documents SET number = ?, excerpt = ?, date = ?, file_path = ?, is_active = ? WHERE id = ?",
        [number, excerpt, date, file_path, is_active, req.params.id],
      );
    } else {
      await pool.query(
        "UPDATE documents SET number = ?, excerpt = ?, date = ?, is_active = ? WHERE id = ?",
        [number, excerpt, date, is_active, req.params.id],
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/documents/:id(*)", async (req, res) => {
  try {
    await pool.query("DELETE FROM documents WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO ACTIVITIES ---

app.post("/api/activities", async (req, res) => {
  const { name, type, note, is_active = 1 } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO activities (name, type, note, is_active) VALUES (?, ?, ?, ?)",
      [name, type, note, is_active],
    );
    res.json({ id: result.insertId, name, type, note, is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/activities/:id", async (req, res) => {
  const { name, type, note, is_active } = req.body;
  try {
    await pool.query(
      "UPDATE activities SET name = ?, type = ?, note = ?, is_active = ? WHERE id = ?",
      [name, type, note, is_active, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/activities/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM activities WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO RECEIPTS ---
app.get("/api/receipts", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, a.name as activity_name, COALESCE(SUM(ri.total_value),0) as total_value
       FROM receipts r
       LEFT JOIN activities a ON a.id = r.activity_id
       LEFT JOIN receipt_items ri ON ri.receipt_id = r.id
       GROUP BY r.id
       ORDER BY r.received_at DESC`,
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/receipts/:id", async (req, res) => {
  try {
    const [receiptRows] = await pool.query(
      "SELECT * FROM receipts WHERE id = ?",
      [req.params.id],
    );
    if (receiptRows.length === 0)
      return res.status(404).json({ error: "Not found" });

    const receipt = receiptRows[0];
    const [items] = await pool.query(
      "SELECT * FROM receipt_items WHERE receipt_id = ?",
      [req.params.id],
    );

    res.json({ ...receipt, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/receipts", async (req, res) => {
  const {
    activity_id,
    donor_name,
    donor_type,
    location_name,
    received_at,
    note,
    items,
    number_of_support,
  } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO receipts (activity_id, donor_name, donor_type, location_name, received_at, note, number_of_support) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        activity_id,
        donor_name,
        donor_type,
        location_name,
        received_at,
        note,
        number_of_support,
      ],
    );

    const receiptId = result.insertId;
    if (Array.isArray(items)) {
      const itemRows = items.map((item) => [
        receiptId,
        item.item_name,
        item.unit,
        item.quantity || 0,
        item.unit_price || 0,
        (item.quantity || 0) * (item.unit_price || 0),
        item.note || "",
      ]);
      if (itemRows.length > 0) {
        await pool.query(
          "INSERT INTO receipt_items (receipt_id, item_name, unit, quantity, unit_price, total_value, note) VALUES ?",
          [itemRows],
        );
      }
    }

    res.json({ success: true, id: receiptId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/receipts/:id", async (req, res) => {
  const {
    activity_id,
    donor_name,
    donor_type,
    location_name,
    received_at,
    note,
    items,
    number_of_support,
  } = req.body;
  try {
    await pool.query(
      "UPDATE receipts SET activity_id = ?, donor_name = ?, donor_type = ?, location_name = ?, received_at = ?, note = ?, number_of_support = ? WHERE id = ?",
      [
        activity_id,
        donor_name,
        donor_type,
        location_name,
        received_at,
        note,
        number_of_support,
        req.params.id,
      ],
    );

    // Replace items
    await pool.query("DELETE FROM receipt_items WHERE receipt_id = ?", [
      req.params.id,
    ]);

    if (Array.isArray(items) && items.length > 0) {
      const itemRows = items.map((item) => [
        req.params.id,
        item.item_name,
        item.unit,
        item.quantity || 0,
        item.unit_price || 0,
        (item.quantity || 0) * (item.unit_price || 0),
        item.note || "",
      ]);

      await pool.query(
        "INSERT INTO receipt_items (receipt_id, item_name, unit, quantity, unit_price, total_value, note) VALUES ?",
        [itemRows],
      );
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/receipts/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM receipt_items WHERE receipt_id = ?", [
      req.params.id,
    ]);
    await pool.query("DELETE FROM receipts WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO BAN PHONG TRÀO (COMMITTEE) ---
app.post("/api/committee", async (req, res) => {
  const { name, role, phone, avatar, unit, is_active = 1 } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO committee (name, role, phone, avatar, unit, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [name, role, phone, avatar, unit, is_active],
    );
    res.json({
      id: result.insertId,
      name,
      role,
      phone,
      avatar,
      unit,
      is_active,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/committee/:id", async (req, res) => {
  const { name, role, phone, avatar, unit, is_active } = req.body;
  try {
    await pool.query(
      "UPDATE committee SET name = ?, role = ?, phone = ?, avatar = ?, unit = ?, is_active = ? WHERE id = ?",
      [name, role, phone, avatar, unit, is_active, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/committee/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM committee WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO VIDEOS ---
app.post("/api/videos", async (req, res) => {
  const { title, url, is_active = 1 } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO videos (title, url, is_active) VALUES (?, ?, ?)",
      [title, url, is_active],
    );
    res.json({ id: result.insertId, title, url, is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/videos/:id", async (req, res) => {
  const { title, url, is_active } = req.body;
  try {
    await pool.query(
      "UPDATE videos SET title = ?, url = ?, is_active = ? WHERE id = ?",
      [title, url, is_active, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/videos/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM videos WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO AUDIOS ---
app.post("/api/audios", async (req, res) => {
  const { title, url, is_active = 1 } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO audios (title, url, is_active) VALUES (?, ?, ?)",
      [title, url, is_active],
    );
    res.json({ id: result.insertId, title, url, is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/audios/:id", async (req, res) => {
  const { title, url, is_active } = req.body;
  try {
    await pool.query(
      "UPDATE audios SET title = ?, url = ?, is_active = ? WHERE id = ?",
      [title, url, is_active, req.params.id],
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/audios/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM audios WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- XÁC THỰC (AUTH) ---
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND password = ? ",
      [username, password],
    );
    if (rows.length > 0) {
      res.json({
        success: true,
        user: {
          id: rows[0].id,
          username: rows[0].username,
          role: rows[0].role,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CRUD CHO NGƯỜI DÙNG (USERS) ---
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, role, is_active FROM users ",
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users", async (req, res) => {
  const { username, password, role, is_active = 1 } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO users (username, password, role, is_active) VALUES (?, ?, ?, ?)",
      [username, password, role, is_active],
    );
    res.json({ id: result.insertId, username, role, is_active });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { username, password, role, is_active } = req.body;
  try {
    if (password) {
      // Nếu có nhập password mới thì cập nhật
      await pool.query(
        "UPDATE users SET username = ?, password = ?, role = ?, is_active = ? WHERE id = ?",
        [username, password, role, is_active, req.params.id],
      );
    } else {
      await pool.query(
        "UPDATE users SET username = ?, role = ?, is_active = ? WHERE id = ?",
        [username, role, is_active, req.params.id],
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Server is running on port ${PORT}`);
});
