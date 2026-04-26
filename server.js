const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();
const port = 3000;

// Cấp giấy thông hành (CORS)
app.use(cors());
app.use(express.json());

// Chìa khóa mở cửa vào kho MariaDB
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'admin_web',
  password: 'hoangphuc', 
  database: 'dulich_dongthap',
  connectionLimit: 5
});

// API 1: Kiểm tra nhịp đập (Cũ)
app.get('/api/kiemtra', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("SELECT 1"); 
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json({ message: "Trạm trung chuyển đã kết nối thành công với Kho dữ liệu Đồng Tháp!" });
  } catch (err) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.status(500).send("Lỗi kết nối: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// API 2: Lấy danh sách bài viết (MỚI)
app.get('/api/baiviet', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    // Ra lệnh lấy toàn bộ bài viết, sắp xếp bài mới nhất lên đầu
    const rows = await conn.query("SELECT * FROM bai_viet ORDER BY ngay_tao DESC");
    
    // Trả dữ liệu về cho web
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.json(rows);
  } catch (err) {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.status(500).send("Lỗi lấy dữ liệu: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

// Khởi động động cơ Backend
app.listen(port, () => {
  console.log(`🚀 Trạm trung chuyển Backend đang chạy tưng bừng tại cổng ${port}`);
});
