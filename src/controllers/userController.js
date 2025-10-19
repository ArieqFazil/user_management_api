import pool from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export const getUsers = async (req, res) => {
  const { rows } = await pool.query('SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users');
  res.json(rows);
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  const { rows } = await pool.query('SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1', [id]);
  if (!rows.length) return res.status(404).json({ message: 'User not found' });
  res.json(rows[0]);
};

export const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // check owner
    if (req.user.id !== id) return res.status(403).json({ message: 'Forbidden: only owner can edit' });

    const { username, email, password } = req.body;
    // validate email/password if provided
    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email' });
    }
    let query, params;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), password = COALESCE($3, password) WHERE id = $4 RETURNING id, username, email, avatar_url, updated_at';
      params = [username, email, hashed, id];
    } else {
      query = 'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE id = $3 RETURNING id, username, email, avatar_url, updated_at';
      params = [username, email, id];
    }
    const { rows } = await pool.query(query, params);
    res.json({ message: 'Profile updated', user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // only owner or admin could be allowed; here only owner
    if (req.user.id !== id) return res.status(403).json({ message: 'Forbidden' });
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const uploadStream = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    const result = await uploadStream();
    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [result.secure_url, req.user.id]);
    res.json({ message: 'Avatar uploaded', url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
