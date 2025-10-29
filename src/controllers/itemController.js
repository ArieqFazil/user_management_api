import pool from "../config/db.js";

// ✅ Ambil semua data
export const getItems = async (req, res) => {
  try {
    console.log("📦 GET /api/items dipanggil");
    const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("🔥 Error getItems:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//  Tambah data baru
export const createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    console.log("📝 Data diterima dari frontend:", req.body);

    if (!title || !description) {
      return res.status(400).json({ message: "Title dan description wajib diisi" });
    }

    const result = await pool.query(
      "INSERT INTO items (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );

    console.log(" Data berhasil disimpan:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("🔥 Error createItem:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//  Update data
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    console.log(`✏️ Update item id=${id}`, req.body);

    const result = await pool.query(
      "UPDATE items SET title=$1, description=$2 WHERE id=$3 RETURNING *",
      [title, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    console.log(" Item berhasil diupdate:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 Error updateItem:", err.message);
    res.status(500).json({ message: err.message });
  }
};

//  Hapus data
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Menghapus item id=${id}`);

    const result = await pool.query("DELETE FROM items WHERE id=$1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    console.log(" Item berhasil dihapus");
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(" Error deleteItem:", err.message);
    res.status(500).json({ message: err.message });
  }
};
