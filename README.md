# Library Management REST API 📚

Proyek ini adalah backend REST API untuk sistem perpustakaan yang dibangun menggunakan **Express.js, TypeScript**, dan **Prisma ORM**. Database terhubung via **Supabase PostgreSQL**. API ini dirancang khusus untuk memenuhi kebutuhan `Librarian Dashboard`, termasuk pengaturan layout beranda (Hero, Featured Books, Kategori) dan manajemen visibilitas katalog buku perpustakaan.

---

## 🚀 Cara Menjalankan Project

Ikuti instruksi berikut untuk menjalankan server API secara lokal di komputer Anda:

1. **Install Dependencies**
   Buka terminal di dalam folder proyek ini `rest-api`, lalu jalankan perintah:
   ```bash
   npm install
   ```
2. **Setup Environment Variables**
   File konfigurasi `.env` telah disetel bersama dengan URL database Supabase Anda. Apabila memindahkan / melakukan setup di tempat baru, pastikan file `.env` berisi:
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
   DIRECT_URL="postgresql://postgres.[ID]:[PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
   ```
3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Server akan berjalan dan bisa diakses lewat `http://localhost:5000/`. (Karena menggunakan `ts-node-dev`, server akan melakukan auto-restart jika ada perubahan disaat Anda memodifikasi script `.ts`).

---

## 🛠️ Penjelasan Fitur & Struktur Code

Proyek direkayasa menggunakan arsitektur Controller-Route yang rapi (Bisa dilihat di `src/controllers` dan `src/routes/api.ts`).

### F-01: Librarian Dashboard (Library Layout)
Memungkinkan Pustakawan memodifikasi tampilan beranda secara *real-time*.
- **`GET /api/public/layout` (View Public Layout)**
  Menggunakan `prisma.libraryLayout.findFirst()` dipadu instruksi *include SQL* bawaan dari prisma untuk memuat semua referensi "Book" dan "Category" yang menjadi sorotan.
- **`PUT /api/admin/layout` (Edit Layout)**
  Menerima input JSON (`heroText`, `featuredBookIds`, dll). Fungsi akan terhubung ke Prisma `libraryLayout.update` untuk mengganti *Hero Section* dengan fitur pintar, sehingga ia tidak akan menimpa field kosong yang tidak sengaja terkirim.

### F-02: Librarian Dashboard (Manage Books)
Mengelola status buku-buku di dalam perpustakaan.
- **`POST /api/admin/books` (Add Book)**
  Menambahkan buku baru dengan *title, author, image, dan categoryId*. Data ditampung langsung lewat instruksi `prisma.book.create()`.
- **`GET /api/books` (View Visible Catalog)**
  Menampilkan semua list buku. Fungsi direkayasa lewat baris `where: { isHidden: false }` untuk memastikan buku yang disembunyikan admin takkan bocor ke layar pengguna. 
- **`PATCH /api/admin/books/:id/status` (Hide/Show Book)**
  Fitur andalan _toggle_. Ini membalik keadaan bool dengan logic `isHidden: !book.isHidden` di level update database Prisma tanpa men-*delete* fisik data tsb.
- **`DELETE /api/admin/books/:id` (Remove Book)**
  Fitur ini men-*delete* entri `Book` secara asli/permanen menggunakan fungsi `prisma.book.delete()`.

---

## 🧪 Cara Cek & Testing Menggunakan Postman (Dokumentasi API)

Aplikasi Express (*Backend/REST API*) hanya menerima satu jenis HTTP method standar melalui browser, yaitu **GET** (contoh: bila Anda memuat `localhost:5000` maka browser akan mencetak pesan pembuka).

Browser tidak didesain untuk mengirimkan *Request Body, POST, PUT, DELETE*, apalagi JSON header secara mudah. **Postman diperlukan** untuk menstimulasi fungsi-fungsi CRUD dan layout _updating_ di atas. 

**Panduan Import Collection:**
1. Di dalam proyek ini telah disediakan file konfigurasi otomatis bernama `Library_API_Postman_Collection.json`.
2. Buka Aplikasi **Postman**.
3. Di Menu Navigasi (biasanya tombol pojok kiri atas/File tab), Klik **Import**.
4. Pilih **File / upload**, lalu buka dan _Load_ file JSON tersebut.
5. Anda akan mendapatkan seluruh _folder_ dan Endpoint dari project API ini yang mana tersemat pula dokumentasi dan contoh pengisian *Body*.
6. Anda bisa mengklik sembarang endpoint > masuk tab **Body** > ganti tulisan JSON semau Anda > dan tekan tombol biru besar **SEND** untuk mengetesnya secara langsung terhadap Database Supabase Anda!
