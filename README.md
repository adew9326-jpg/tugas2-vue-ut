# Tugas Praktik 2: Sistem Pemesanan & Distribusi Bahan Ajar SITTA UT
### Implementasi JavaScript Framework Vue.js

Aplikasi antarmuka dan alur interaktif berbasis **Vue.js** untuk sistem kebutuhan proses pemesanan dan distribusi bahan ajar (SITTA) di Universitas Terbuka.

---

## 📁 Struktur Direktori Proyek

Proyek ini disusun rapi sesuai standar struktur yang disepakati pada soal tugas:

```text
/tugas2-vue-ut/
├─ index.html             ← Menampilkan navigasi portal menu ke 2 halaman web: stok.html dan tracking.html
├─ stok.html              ← Halaman 1: Stok Bahan Ajar UT Daerah (WAJIB)
├─ tracking.html          ← Halaman 2: Tracking Delivery Order (DO) (WAJIB)
├─ css/
│   └─ style.css          ← Desain CSS modern, ringan & palet warna resmi Universitas Terbuka
├─ js/
│   ├─ dataBahanAjar.js   ← Template/acuan dummy data master SITTA UT
│   ├─ stok-app.js        ← Logika Vue.js untuk stok.html
│   └─ tracking-app.js    ← Logika Vue.js untuk tracking.html
└─ README.md              ← Dokumentasi teknis & panduan rekaman video penjelasan (15 menit)
```

---

## 🎯 Pemetaan Indikator Capaian Hasil Belajar (100 Poin)

| No | Indikator Penilaian | Implementasi Teknis dalam Kode | Skor |
|---|---|---|:---:|
| 1.1 | **Arsitektur & Struktur Proyek** | Pemisahan berkas terstruktur (`index.html`, `stok.html`, `tracking.html`, `style.css`, `stok-app.js`, `tracking-app.js`, `dataBahanAjar.js`). Menggunakan Vue.js tanpa template SFC sesuai instruksi soal. | 5 Poin |
| 1.2 | **Data Binding & Directive List Rendering** | • **Mustaches `{{ }}`**: Menampilkan kode, judul, harga, dan tanggal.<br>• **Directive `v-text`**: Menampilkan kategori MK, total ringkasan, dan status log.<br>• **Directive `v-html`**: Menampilkan data `catatanHTML` yang berisi tag `<em>`, `<strong>`, `<u>`, `<i>`.<br>• **Directive `v-bind` (`:`)**: Binding `:class`, `:value`, `:key`, `:disabled`.<br>• **Directive `v-model`**: Two-way data binding form dan filter.<br>• **Directive `v-for`**: Perulangan list stok, upbjj, kategori, paket, dan ekspedisi. | 20 Poin |
| 1.3 | **Penggunaan Conditional** | • **`v-if`, `v-else-if`, `v-else`**: Penentuan 3 status stok otomatis:<br>&nbsp;&nbsp;- `stok >= safety` &rarr; `🟢 Aman` (badge hijau)<br>&nbsp;&nbsp;- `stok < safety && stok > 0` &rarr; `⚠️ Menipis` (badge oranye/warning)<br>&nbsp;&nbsp;- `stok === 0` &rarr; `⛔ Kosong` (badge merah/danger)<br>• **`v-show`**: Menampilkan dependent option Kategori Mata Kuliah hanya ketika UT Daerah dipilih, serta menampilkan rincian isi buku paket di bawah dropdown. | 10 Poin |
| 1.4 | **Property: Computed & Methods** | • **Computed Properties**: `filteredStok`, `totalJudul`, `totalUnitStok`, `totalPerluReorder`, `nextNomorDO`, `selectedPaketDetail`, `trackingArrayList`. Menerapkan **Computed Caching** sehingga data filter tidak dihitung ulang (*recompute*) jika dependensi tidak berubah.<br>• **Methods**: `simpanBahanAjarBaru()`, `simpanPerubahanEdit()`, `quickAdjustQty()`, `hapusBahanAjar()`, `resetFilter()`, `simpanDOBaru()`, `isiTanggalHariIni()`, `lacakDO()`, `formatRupiah()`. | 10 Poin |
| 1.5 | **Fungsi Watcher (Minimal 2 Watcher)** | • **`stok-app.js`**: <br>&nbsp;&nbsp;1. *Watcher `selectedUpbjj`*: Mereset filter kategori saat daerah berubah.<br>&nbsp;&nbsp;2. *Watcher `stok` (deep watch)*: Mendeteksi stok kritis dan memunculkan peringatan dini re-order tiras UT.<br>&nbsp;&nbsp;3. *Watcher `formTambah.safety`*: Peringatan real-time jika safety melebihi stok awal.<br>• **`tracking-app.js`**: <br>&nbsp;&nbsp;1. *Watcher `formDO.paketKode`*: Mengisi `totalHarga` otomatis dari master data dan menyiapkan rincian paket.<br>&nbsp;&nbsp;2. *Watcher `keywordCariDO`*: Live-search nomor DO otomatis.<br>&nbsp;&nbsp;3. *Watcher `formDO.nim`*: Validasi format 9 digit angka secara reaktif. | 10 Poin |
| 1.6 | **Formulir Input & Validasi Sederhana** | Formulir tambah dan edit stok serta formulir DO dengan validasi wajib diisi, format numerik, pencegahan kode ganda, dan pesan umpan balik real-time. | 20 Poin |
| 1.7 | **Kreativitas & Desain Antarmuka** | Antarmuka bertema resmi SITTA Universitas Terbuka (Navy Blue & Gold), responsif, metric dashboard cards, live visual tracking stepper, dan pengalaman pengguna yang nyaman. | 10 Poin |
| 1.8 | **Penjelasan Video Tugas** | Panduan naskah presentasi terstruktur (maks 15 menit) dengan alur berpikir konseptual dan teknis. | 15 Poin |
| **TOTAL** | | | **100 Poin** |

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini menggunakan Vue.js versi standalone via CDN resmi tanpa memerlukan instalasi Node.js atau proses build:

1. Buka folder `/tugas2-vue-ut/` pada penjelajah berkas (File Explorer).
2. Klik ganda pada berkas **`index.html`** untuk membuka portal navigasi di browser (Google Chrome, Microsoft Edge, Mozilla Firefox, dll).
3. Anda dapat berpindah ke halaman **Stok Bahan Ajar (`stok.html`)** dan **Tracking DO (`tracking.html`)** melalui tombol menu atau navbar atas.

---

## 🎙️ PANDUAN LENGKAP REKAMAN VIDEO PENJELASAN (MAKSIMAL 15 MENIT)
*Dapat digunakan langsung oleh mahasiswa saat merekam video presentasi tugas.*

### ⏱️ Pembagian Waktu (Time Allocation):
- **00:00 - 01:00 (1 Menit)** : Pembukaan & Identitas Mahasiswa
- **01:00 - 02:30 (1.5 Menit)** : Penjelasan Arsitektur & Struktur Proyek Vue.js
- **02:30 - 07:30 (5 Menit)** : Pembahasan & Demo Halaman 1 (Stok Bahan Ajar)
- **07:30 - 12:30 (5 Menit)** : Pembahasan & Demo Halaman 2 (Tracking Delivery Order)
- **12:30 - 14:30 (2 Menit)** : Ringkasan Keunggulan Vue.js (Computed vs Watcher) & Penutup

---

### 📝 Skrip Naskah Video Presentasi (Word-for-Word Guide):

#### 1. Pembukaan (00:00 - 01:00)
> *"Halo Bapak/Ibu Tutor dan rekan-rekan mahasiswa. Perkenalkan nama saya [NAMA LENGKAP MAHASISWA], NIM [NOMOR INDUK MAHASISWA], Program Studi Sistem Informasi / Ilmu Komputer Universitas Terbuka.*
>
> *Pada video kali ini, saya akan mendemonstrasikan dan menjelaskan hasil pengerjaan **Tugas Praktik 2**, yaitu mengimplementasikan konsep pengorganisasian kode JavaScript Framework **Vue.js** dalam membangun antarmuka dan alur interaktif aplikasi pemesanan dan distribusi bahan ajar **SITTA UT**.*
>
> *Tugas ini mencakup lima indikator capaian belajar: arsitektur kode, data binding dan directive, conditional logic, computed dan methods property, fungsi watcher, formulir validasi, hingga pelacakan Delivery Order."*

#### 2. Struktur & Arsitektur Proyek (01:00 - 02:30)
> *(Tampilkan tampilan Visual Studio Code / File Explorer)*
>
> *"Mari kita lihat struktur proyek yang telah dibangun. Proyek ini dinamakan `tugas2-vue-ut` dengan pemisahan berkas yang rapi dan modular:*
> 1. *`index.html` sebagai halaman beranda dan portal navigasi.*
> 2. *`stok.html` sebagai halaman utama pertama untuk manajemen stok bahan ajar.*
> 3. *`tracking.html` sebagai halaman kedua untuk tracking dan input Delivery Order.*
> 4. *Folder `css/style.css` untuk tata letak modern bertema resmi Universitas Terbuka.*
> 5. *Folder `js/` yang berisi `dataBahanAjar.js` sebagai sumber dummy data acuan, `stok-app.js` sebagai logika Vue untuk stok, dan `tracking-app.js` untuk logika pelacakan DO.*
>
> *Sesuai petunjuk tugas, kami tidak menggunakan SFC template component melainkan Vue instance mandiri yang ringan dan kompatibel langsung dengan browser."*

#### 3. Halaman 1: Stok Bahan Ajar (`stok.html` & `stok-app.js`) (02:30 - 07:30)
> *(Buka browser ke `stok.html` dan perlihatkan kode `stok-app.js`)*
>
> *"Sekarang kita buka halaman Stok Bahan Ajar. Di sini saya menerapkan indikator-indikator berikut:*
>
> **1. Data Binding & Directives:**
> * *Mustaches `{{ item.kode }}` dan `{{ item.judul }}` digunakan untuk menampilkan teks.*
> * *Directive `v-text` digunakan untuk menampilkan kategori dan info counter.*
> * *Directive `v-html="item.catatanHTML"` secara khusus digunakan untuk me-render catatan khusus yang mengandung tag HTML seperti `<em>`, `<strong>`, `<u>`, dan `<i>`.*
> * *Directive `v-for="item in filteredStok"` me-render baris tabel secara dinamis.*
>
> **2. Conditional Directives (Status Bahan Ajar):**
> * *Sesuai aturan bisnis SITTA UT, status bahan ajar ditentukan secara otomatis menggunakan `v-if`, `v-else-if`, dan `v-else`:*
>   - *Jika `stok === 0`, maka muncul status `⛔ Kosong` berwarna merah.*
>   - *Jika `stok < safety`, maka muncul status `⚠️ Menipis` berwarna oranye.*
>   - *Jika `stok >= safety`, maka muncul status `🟢 Aman` berwarna hijau.*
>
> **3. Dependent Options & Caching Computed Property:**
> * *Perhatikan fitur filter: ketika filter UT-Daerah belum dipilih, filter kategori disembunyikan. Begitu kita memilih misalnya 'UT Jakarta', directive `v-show` langsung memunculkan dropdown Kategori Mata Kuliah yang tergantung pada daerah tersebut.*
> * *Filter dan pengurutan (berdasarkan judul, stok, harga) serta checkbox re-order tiras dibuat menggunakan **Computed Property `filteredStok`**. Keunggulannya adalah fitur **caching** bawaan Vue.js: Vue tidak akan menghitung ulang (recompute) seluruh daftar jika variabel reaktifnya tidak berubah, sehingga performa sangat cepat.*
>
> **4. Penerapan Watchers pada Stok:**
> * *Watcher 1 memantau `selectedUpbjj`: saat pengguna mengganti UT Daerah, watcher otomatis mereset pilihan kategori agar data selalu valid.*
> * *Watcher 2 memantau array `stok` dengan opsi `{ deep: true }`: jika ada stok buku yang berkurang di bawah safety stock, watcher langsung memicu banner alert peringatan dini di bagian atas: 'Peringatan Tiras UT: Terdapat bahan ajar yang menipis/kosong!'.*
>
> **5. Formulir Tambah & Edit Data:**
> * *Tersedia tombol 'Tambah Bahan Ajar Baru' dan tombol 'Edit'. Keduanya dilengkapi validasi sederhana (kode tidak boleh kosong/duplikat, judul minimal 3 karakter, harga > 0, lokasi rak harus terisi). Mari kita coba tambahkan 1 buku baru dan ubah stoknya secara live."*

#### 4. Halaman 2: Tracking Delivery Order (`tracking.html` & `tracking-app.js`) (07:30 - 12:30)
> *(Buka browser ke `tracking.html` dan perlihatkan kode `tracking-app.js`)*
>
> *"Selanjutnya, mari kita masuk ke Halaman 2: Tracking Delivery Order (DO).*
>
> **1. Generator Otomatis Nomor DO:**
> * *Pada form input registrasi DO, Nomor DO digenerate secara otomatis melalui computed property `nextNomorDO` dengan format: `DO{Tahun}-{Sequence 3 Digit}`. Jika data awal adalah `DO2025-001`, maka pesanan berikutnya otomatis menjadi `DO2025-002`, `DO2025-003`, dan seterusnya.*
>
> **2. Formulir Input Pemesanan & Detail Isi Paket:**
> * *NIM dan Nama Mahasiswa diisi manual.*
> * *Pilihan ekspedisi diambil dari master `pengirimanList` (JNE Reguler / Ekspres).*
> * *Pada elemen `<select>` Paket Bahan Ajar, ditampilkan kode dan nama paket. Ketika paket dipilih, di bawahnya langsung muncul kotak rincian buku apa saja yang termasuk dalam paket tersebut menggunakan directive `v-show="selectedPaketDetail"`.*
> * *Total harga otomatis disinkronkan dari data array `paket -> harga`.*
> * *Tanggal kirim dapat diisi manual atau dengan menekan tombol 'Hari Ini' yang memanggil fungsi JavaScript `new Date()` untuk mengambil local time.*
>
> **3. Penerapan Watcher pada Tracking DO:**
> * *Watcher 1 memantau `formDO.paketKode`: ketika paket dipilih di dropdown, watcher langsung mengisi `formDO.totalHarga` dan mencatat log rincian pesanan.*
> * *Watcher 2 memantau `keywordCariDO`: mengaktifkan fitur live-search reaktif. Saat kita mengetikkan nomor DO, watcher otomatis mencari dan menampilkan status perjalanan beserta stepper timeline ekspedisi.*
> * *Watcher 3 memantau input NIM mahasiswa dan memvalidasi digit angka secara real-time.*
>
> **4. Demonstrasi Tambah DO & Lacak Status:**
> * *Mari kita input satu pesanan baru untuk mahasiswa bernama Budi Santoso, pilih PAKET IPA Dasar, lalu klik 'Simpan & Terbitkan DO'. Perhatikan bahwa nomor DO baru langsung terbit, masuk ke tabel riwayat, dan timeline status perjalanan langsung ter-update."*

#### 5. Kesimpulan & Penutup (12:30 - 14:30)
> *"Sebagai kesimpulan, melalui Tugas Praktik 2 ini, seluruh 5 indikator capaian pembelajaran telah berhasil diimplementasikan secara komprehensif:*
> 1. *Struktur folder dan kode Vue.js modular dan mudah dipahami.*
> 2. *Semua directive data rendering (`{{ }}`, `v-text`, `v-html`, `v-for`, `v-bind`, `v-model`) berfungsi optimal.*
> 3. *Kondisional `v-if` / `v-else` dan `v-show` diterapkan tepat sasaran.*
> 4. *Computed property memberikan efisiensi caching tanpa recomputing yang tidak perlu.*
> 5. *Fungsi Watcher aktif memantau perubahan data penting.*
>
> *Demikian demonstrasi dan penjelasan Tugas Praktik 2 Aplikasi SITTA UT. Terima kasih atas perhatian Bapak/Ibu Tutor. Wassalamu’alaikum Warahmatullahi Wabarakatuh."*

---

## 📚 Sumber Referensi
1. Sufandi, U. U., Aprijani, D. A., & Pandiangan, P. (2021). *Evaluasi dan hasil review desain user interface prototype aplikasi mobile SITTA Universitas Terbuka*. Jurnal Nasional Pendidikan Teknik Informatika: JANAPATI, 10(3), 147-156.
2. Sufandi, U. U. (2022). *Analisis Kebutuhan dan Dokumentasi Sistem Informasi Tiras dan Transaksi Bahan Ajar Universitas Terbuka*. Jurnal Nasional Pendidikan Teknik Informatika: JANAPATI, 11(2), 112-122.
