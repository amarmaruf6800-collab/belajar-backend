const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 4000; // <--- SUDAH SAYA GANTI JADI 4000 (Biar cocok sama Frontend)

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
  user: "3nZhmGmS9EnKbZH.root",
  password: "kNxKIMp0MnEmivcR",
  database: "test",
  port: 4000,
  ssl: {
    rejectUnauthorized: true,
  },
});

db.connect((err) => {
  if (err) {
    console.error("Gagal konek database:", err);
  } else {
    console.log("Berhasil konek ke database MySQL!");
  }
});

// ==========================================
// 1. RUTE LOGIN (YANG HILANG TADI)
// ==========================================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Cek ke tabel admin
  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, data) => {
    if (err)
      return res.status(500).json({ success: false, pesan: "Error server" });

    if (data.length > 0) {
      // Ketemu user yang cocok
      res.json({ success: true, pesan: "Login Berhasil" });
    } else {
      // Tidak ketemu
      res
        .status(401)
        .json({ success: false, pesan: "Username/Password Salah!" });
    }
  });
});

// ==========================================
// 2. RUTE BARANG (CRUD)
// ==========================================
// Ambil semua barang
app.get("/barang", (req, res) => {
  db.query("SELECT * FROM barang", (err, data) => {
    if (err) return res.status(500).send("Error ambil data");
    res.json(data);
  });
});

// Tambah barang
app.post("/barang", (req, res) => {
  const { nama_barang, kategori, harga, stok } = req.body;
  const sql =
    "INSERT INTO barang (nama_barang, kategori, harga, stok) VALUES (?, ?, ?, ?)";
  db.query(sql, [nama_barang, kategori, harga, stok], (err, result) => {
    if (err) return res.status(500).send("Gagal simpan");
    res.json({ pesan: "Berhasil disimpan" });
  });
});

// Update barang
app.put("/barang/:id", (req, res) => {
  const { nama_barang, kategori, harga, stok } = req.body;
  const sql =
    "UPDATE barang SET nama_barang=?, kategori=?, harga=?, stok=? WHERE id=?";
  db.query(
    sql,
    [nama_barang, kategori, harga, stok, req.params.id],
    (err, result) => {
      if (err) return res.status(500).send("Gagal update");
      res.json({ pesan: "Berhasil update" });
    }
  );
});

// Hapus barang
app.delete("/barang/:id", (req, res) => {
  const sql = "DELETE FROM barang WHERE id=?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).send("Gagal hapus");
    res.json({ pesan: "Berhasil hapus" });
  });
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server Backend jalan di http://localhost:${port}`);
});
