const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "barang_db",
});

//cek koneksi
db.connect((err) => {
  if (err) {
    console.error("gagal konek ke database:", err);
  } else {
    console.log("berhasil konek ke database mysql");
  }
});
app.get("/", (req, res) => {
  res.send("server backend nyala");
});

//route barang ambil dari db
app.get("/barang", (req, res) => {
  const sql = "SELECT * FROM barang";

  db.query(sql, (err, data) => {
    if (err) {
      res.status(500).send("ada eror saat ambil data");
    } else {
      res.json(data);
    }
  });
});

//POST
app.post("/barang", (req, res) => {
  const { nama_barang, kategori, harga, stok } = req.body;

  const sql =
    "INSERT INTO barang (nama_barang, kategori, harga, stok) VALUES (?, ?, ?, ?)";

  db.query(sql, [nama_barang, kategori, harga, stok], (err, result) => {
    if (err) {
      res.status(500).send("gagal simpan data");
    } else {
      res.status(201).json({
        pesan: "berhasil nambah data!",
        dataBaru: { nama_barang, kategori, harga, stok },
      });
    }
  });
});

//DELETE
app.delete("/barang/:id", (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM barang WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ pesan: "Data berhasil dihapus" });
    }
  });
});

// PUT
app.put("/barang/:id", (req, res) => {
  const id = req.params.id;
  const { nama_barang, kategori, harga, stok } = req.body; // Data baru dari frontend

  const sql = `UPDATE barang SET nama_barang = ?,kategori = ?, harga = ?, stok = ? WHERE id = ?`;

  db.query(sql, [nama_barang, kategori, harga, stok, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ pesan: "Data berhasil diupdate" });
    }
  });
});

//login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      res.status(500).send("erorr server");
    } else {
      if (result.length > 0) {
        res.json({
          success: true,
          pesan: "login berhasil",
          token: "ini_token_rahasia_12345",
        });
      } else {
        res.status(401).json({
          success: false,
          pesan: "Username atau password salah",
        });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`server jalan di http://localhost:${port}`);
});
