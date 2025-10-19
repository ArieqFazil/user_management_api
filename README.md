# User Management API

API sederhana untuk manajemen user dengan autentikasi JWT dan upload gambar ke Cloudinary.

## 🚀 Cara Menjalankan
1. Clone repository
2. Jalankan `npm install`
3. Buat file `.env` berdasarkan contoh di README
4. Jalankan `npm run dev`

## 🔑 Endpoint
| Method | URL | Deskripsi |
|--------|-----|------------|
| POST | /api/auth/register | Registrasi user baru |
| POST | /api/auth/login | Login user dan dapatkan token |
| GET | /api/users | Lihat semua user (perlu token) |
