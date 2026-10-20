/**
 * ==============================================================================
 * SITTA UT - Sistem Informasi Tiras dan Transaksi Bahan Ajar Universitas Terbuka
 * File: js/stok-app.js
 * Logika Vue.js untuk Halaman 1: Stok Bahan Ajar (stok.html)
 *
 * Mengimplementasikan 5 Indikator Capaian:
 * 1. Pengorganisasian kode Vue.js standar & rapi
 * 2. Data Display & Binding: Mustaches {{ }}, v-text, v-html, v-bind, v-model, v-for
 * 3. Conditional: v-if, v-else-if, v-else, v-show
 * 4. Property: Computed Property (dengan caching efisien) & Methods Property
 * 5. Watchers: Minimal 2 Watcher untuk memantau perubahan data reaktif
 * ==============================================================================
 */

var stokApp = new Vue({
  el: '#stok-app',

  // --------------------------------------------------------------------------
  // DATA REACTIVE STATE
  // --------------------------------------------------------------------------
  data: {
    // Daftar Master Data (diambil dari dataBahanAjar.js)
    upbjjList: (typeof dummyDataBahanAjar !== 'undefined')
      ? dummyDataBahanAjar.upbjjList
      : ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],

    kategoriList: (typeof dummyDataBahanAjar !== 'undefined')
      ? dummyDataBahanAjar.kategoriList
      : ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],

    // Data Stok Bahan Ajar
    stok: (typeof dummyDataBahanAjar !== 'undefined')
      ? JSON.parse(JSON.stringify(dummyDataBahanAjar.stok))
      : [
          {
            kode: "EKMA4116",
            judul: "Pengantar Manajemen",
            kategori: "MK Wajib",
            upbjj: "Jakarta",
            lokasiRak: "R1-A3",
            harga: 65000,
            qty: 28,
            safety: 20,
            catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
          },
          {
            kode: "EKMA4115",
            judul: "Pengantar Akuntansi",
            kategori: "MK Wajib",
            upbjj: "Jakarta",
            lokasiRak: "R1-A4",
            harga: 60000,
            qty: 7,
            safety: 15,
            catatanHTML: "<strong>Cover baru</strong>"
          },
          {
            kode: "BIOL4201",
            judul: "Biologi Umum (Praktikum)",
            kategori: "Praktikum",
            upbjj: "Surabaya",
            lokasiRak: "R3-B2",
            harga: 80000,
            qty: 12,
            safety: 10,
            catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
          },
          {
            kode: "FISIP4001",
            judul: "Dasar-Dasar Sosiologi",
            kategori: "MK Pilihan",
            upbjj: "Makassar",
            lokasiRak: "R2-C1",
            harga: 55000,
            qty: 2,
            safety: 8,
            catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
          }
        ],

    // State untuk Filter & Pencarian
    searchQuery: '',
    selectedUpbjj: '',       // Jika kosong = Semua UT-Daerah
    selectedKategori: '',    // Dependent: aktif saat selectedUpbjj dipilih
    hanyaPerluReorder: false, // Filter stok < safety atau stok === 0
    sortBy: 'judul-asc',     // Opsi: judul-asc, judul-desc, qty-asc, qty-desc, harga-asc, harga-desc

    // State Modal Tambah Data
    showTambahModal: false,
    formTambah: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    },
    errorsTambah: {},

    // State Modal Edit Data
    showEditModal: false,
    formEdit: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    },
    errorsEdit: {},

    // State Banner Notifikasi dari Watcher
    watcherAlertMessage: '',
    watcherAlertVisible: false,
    watcherFilterLog: 'Semua UT-Daerah terpilih',

    // Pesan Notifikasi Aksi (Flash alert)
    flashMessage: '',
    flashType: 'info'
  },

  // --------------------------------------------------------------------------
  // COMPUTED PROPERTIES
  // Keunggulan: Otomatis di-cache oleh Vue.js berdasarkan dependency reaktifnya,
  // sehingga filter tidak perlu dihitung ulang (recomputed) jika data dependensi tidak berubah.
  // --------------------------------------------------------------------------
  computed: {
    /**
     * Mengolah daftar stok berdasarkan seluruh kriteria filter dan sort.
     * Memenuhi kriteria:
     * - Filter UT-Daerah
     * - Filter Dependent Kategori Mata Kuliah
     * - Filter Re-order (qty < safety atau qty === 0)
     * - Filter Search Judul/Kode
     * - Sorting berdasarkan judul, stok, dan harga
     */
    filteredStok: function () {
      var self = this;
      var hasil = self.stok.filter(function (item) {
        // 1. Filter Pencarian Teks (Kode / Judul)
        var matchSearch = true;
        if (self.searchQuery.trim() !== '') {
          var query = self.searchQuery.toLowerCase();
          matchSearch = item.kode.toLowerCase().indexOf(query) !== -1 ||
                        item.judul.toLowerCase().indexOf(query) !== -1;
        }

        // 2. Filter UT-Daerah (upbjj)
        var matchUpbjj = true;
        if (self.selectedUpbjj !== '') {
          matchUpbjj = (item.upbjj === self.selectedUpbjj);
        }

        // 3. Filter Kategori (hanya aktif jika UT-Daerah dipilih / dependent)
        var matchKategori = true;
        if (self.selectedUpbjj !== '' && self.selectedKategori !== '') {
          matchKategori = (item.kategori === self.selectedKategori);
        }

        // 4. Filter Stok Kritis / Re-order (qty < safety ATAU qty === 0)
        var matchReorder = true;
        if (self.hanyaPerluReorder) {
          matchReorder = (item.qty < item.safety || item.qty === 0);
        }

        return matchSearch && matchUpbjj && matchKategori && matchReorder;
      });

      // 5. Fitur Pengurutan (Sorting)
      hasil.sort(function (a, b) {
        if (self.sortBy === 'judul-asc') {
          return a.judul.localeCompare(b.judul);
        } else if (self.sortBy === 'judul-desc') {
          return b.judul.localeCompare(a.judul);
        } else if (self.sortBy === 'qty-asc') {
          return a.qty - b.qty;
        } else if (self.sortBy === 'qty-desc') {
          return b.qty - a.qty;
        } else if (self.sortBy === 'harga-asc') {
          return a.harga - b.harga;
        } else if (self.sortBy === 'harga-desc') {
          return b.harga - a.harga;
        }
        return 0;
      });

      return hasil;
    },

    // Statistik Ringkasan untuk Metric Card di Dashboard
    totalJudul: function () {
      return this.stok.length;
    },

    totalUnitStok: function () {
      return this.stok.reduce(function (total, item) {
        return total + Number(item.qty);
      }, 0);
    },

    totalStokAman: function () {
      return this.stok.filter(function (item) {
        return item.qty >= item.safety && item.qty > 0;
      }).length;
    },

    totalPerluReorder: function () {
      return this.stok.filter(function (item) {
        return item.qty < item.safety || item.qty === 0;
      }).length;
    },

    // Kategori yang tersedia pada UT Daerah terpilih (meningkatkan UX dependent options)
    kategoriTersediaDiUpbjj: function () {
      if (!this.selectedUpbjj) {
        return this.kategoriList;
      }
      var self = this;
      var katSet = {};
      this.stok.forEach(function (item) {
        if (item.upbjj === self.selectedUpbjj) {
          katSet[item.kategori] = true;
        }
      });
      // Mengembalikan daftar kategori umum yang ada di UT tersebut
      var hasil = this.kategoriList.filter(function (k) {
        return katSet[k] === true;
      });
      return hasil.length > 0 ? hasil : this.kategoriList;
    }
  },

  // --------------------------------------------------------------------------
  // WATCHERS (Minimal 2 Watcher sesuai Indikator 1.5)
  // --------------------------------------------------------------------------
  watch: {
    /**
     * WATCHER 1: Memantau perubahan filter UT-Daerah (selectedUpbjj)
     * - Ketika pengguna memilih atau mengubah UT-Daerah, watcher mereset pilihan
     *   kategori mata kuliah agar konsisten dengan daerah yang baru dipilih.
     * - Memberikan log status feedback reaktif.
     */
    selectedUpbjj: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedKategori = ''; // Reset kategori dependent
        if (newVal === '') {
          this.watcherFilterLog = 'Menampilkan seluruh UT-Daerah (Pilihan filter kategori disembunyikan).';
        } else {
          this.watcherFilterLog = 'Filter diterapkan untuk UT-Daerah: ' + newVal + '. Filter Kategori Mata Kuliah kini aktif!';
        }
      }
    },

    /**
     * WATCHER 2: Memantau perubahan array stok secara mendalam (deep watcher)
     * - Ketika jumlah item stok bertambah, berkurang, atau qty diedit sehingga
     *   berada di bawah safety stock, watcher secara otomatis memunculkan
     *   pesan peringatan dini (early warning system re-order tiras bahan ajar).
     */
    stok: {
      handler: function (newStokList) {
        var kritisList = newStokList.filter(function (item) {
          return item.qty < item.safety || item.qty === 0;
        });

        if (kritisList.length > 0) {
          this.watcherAlertMessage = '⚠️ Peringatan Tiras UT: Terdapat ' + kritisList.length +
            ' bahan ajar yang berstatus MENIPIS atau KOSONG (Perlu Re-order segera ke Tiras Pusat UT)!';
          this.watcherAlertVisible = true;
        } else {
          this.watcherAlertVisible = false;
          this.watcherAlertMessage = '';
        }
      },
      deep: true,
      immediate: true // Jalankan saat aplikasi pertama kali dimuat
    },

    /**
     * WATCHER 3 (Tambahan): Memantau input safety stock pada modal tambah
     * Memberikan peringatan dini jika safety stock lebih besar dari stok awal yang diinput.
     */
    'formTambah.safety': function (newSafety) {
      if (Number(newSafety) > Number(this.formTambah.qty) && Number(this.formTambah.qty) > 0) {
        this.errorsTambah.safety = 'Perhatian: Safety stock (' + newSafety + ') melebihi stok awal (' + this.formTambah.qty + '). Status bahan ajar akan langsung "Menipis".';
      } else {
        delete this.errorsTambah.safety;
      }
    }
  },

  // --------------------------------------------------------------------------
  // METHODS PROPERTY
  // --------------------------------------------------------------------------
  methods: {
    // Format Rupiah standar Indonesia
    formatRupiah: function (angka) {
      var num = Number(angka) || 0;
      return 'Rp ' + num.toLocaleString('id-ID');
    },

    // Reset seluruh filter dan pencarian ke kondisi default
    resetFilter: function () {
      this.searchQuery = '';
      this.selectedUpbjj = '';
      this.selectedKategori = '';
      this.hanyaPerluReorder = false;
      this.sortBy = 'judul-asc';
      this.tampilkanFlash('Filter dan pencarian telah di-reset ke kondisi awal.', 'info');
    },

    // Menampilkan banner flash notification
    tampilkanFlash: function (pesan, tipe) {
      this.flashMessage = pesan;
      this.flashType = tipe || 'info';
      var self = this;
      setTimeout(function () {
        self.flashMessage = '';
      }, 4000);
    },

    // --- FITUR TAMBAH DATA BAHAN AJAR ---
    bukaTambahModal: function () {
      this.formTambah = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: this.selectedUpbjj || '',
        lokasiRak: '',
        harga: 50000,
        qty: 10,
        safety: 5,
        catatanHTML: ''
      };
      this.errorsTambah = {};
      this.showTambahModal = true;
    },

    tutupTambahModal: function () {
      this.showTambahModal = false;
      this.errorsTambah = {};
    },

    validasiFormTambah: function () {
      var err = {};
      var f = this.formTambah;

      if (!f.kode || f.kode.trim() === '') {
        err.kode = 'Kode mata kuliah wajib diisi!';
      } else {
        // Cek duplikasi kode
        var kodeSama = this.stok.some(function (item) {
          return item.kode.toUpperCase() === f.kode.trim().toUpperCase();
        });
        if (kodeSama) {
          err.kode = 'Kode bahan ajar sudah terdaftar!';
        }
      }

      if (!f.judul || f.judul.trim().length < 3) {
        err.judul = 'Nama / Judul mata kuliah minimal 3 karakter!';
      }

      if (!f.kategori) {
        err.kategori = 'Kategori mata kuliah harus dipilih!';
      }

      if (!f.upbjj) {
        err.upbjj = 'UT-Daerah (UPBJJ) harus dipilih!';
      }

      if (!f.lokasiRak || f.lokasiRak.trim() === '') {
        err.lokasiRak = 'Lokasi rak penyimpanan harus diisi (contoh: R1-A5)!';
      }

      if (f.harga === '' || Number(f.harga) <= 0) {
        err.harga = 'Harga satuan harus bernilai lebih dari 0!';
      }

      if (f.qty === '' || Number(f.qty) < 0) {
        err.qty = 'Jumlah stok tidak boleh negatif!';
      }

      if (f.safety === '' || Number(f.safety) < 0) {
        err.safety = 'Safety stock tidak boleh negatif!';
      }

      this.errorsTambah = err;
      return Object.keys(err).length === 0;
    },

    simpanBahanAjarBaru: function () {
      if (!this.validasiFormTambah()) {
        return;
      }

      var dataBaru = {
        kode: this.formTambah.kode.trim().toUpperCase(),
        judul: this.formTambah.judul.trim(),
        kategori: this.formTambah.kategori,
        upbjj: this.formTambah.upbjj,
        lokasiRak: this.formTambah.lokasiRak.trim(),
        harga: Number(this.formTambah.harga),
        qty: Number(this.formTambah.qty),
        safety: Number(this.formTambah.safety),
        catatanHTML: this.formTambah.catatanHTML.trim() || '<em>Belum ada catatan khusus</em>'
      };

      this.stok.push(dataBaru);
      this.tutupTambahModal();
      this.tampilkanFlash('Bahan ajar ' + dataBaru.kode + ' - ' + dataBaru.judul + ' berhasil ditambahkan!', 'success');
    },

    // --- FITUR EDIT DATA BAHAN AJAR ---
    bukaEditModal: function (item) {
      this.formEdit = {
        kode: item.kode,
        judul: item.judul,
        kategori: item.kategori,
        upbjj: item.upbjj,
        lokasiRak: item.lokasiRak,
        harga: item.harga,
        qty: item.qty,
        safety: item.safety,
        catatanHTML: item.catatanHTML
      };
      this.errorsEdit = {};
      this.showEditModal = true;
    },

    tutupEditModal: function () {
      this.showEditModal = false;
      this.errorsEdit = {};
    },

    validasiFormEdit: function () {
      var err = {};
      var f = this.formEdit;

      if (!f.judul || f.judul.trim().length < 3) {
        err.judul = 'Nama / Judul mata kuliah minimal 3 karakter!';
      }
      if (!f.kategori) {
        err.kategori = 'Kategori mata kuliah harus dipilih!';
      }
      if (!f.upbjj) {
        err.upbjj = 'UT-Daerah harus dipilih!';
      }
      if (!f.lokasiRak || f.lokasiRak.trim() === '') {
        err.lokasiRak = 'Lokasi rak tidak boleh kosong!';
      }
      if (f.harga === '' || Number(f.harga) <= 0) {
        err.harga = 'Harga harus lebih dari 0!';
      }
      if (f.qty === '' || Number(f.qty) < 0) {
        err.qty = 'Stok tidak boleh negatif!';
      }
      if (f.safety === '' || Number(f.safety) < 0) {
        err.safety = 'Safety stock tidak boleh negatif!';
      }

      this.errorsEdit = err;
      return Object.keys(err).length === 0;
    },

    simpanPerubahanEdit: function () {
      if (!this.validasiFormEdit()) {
        return;
      }

      var self = this;
      var idx = this.stok.findIndex(function (item) {
        return item.kode === self.formEdit.kode;
      });

      if (idx !== -1) {
        this.stok[idx].judul = this.formEdit.judul.trim();
        this.stok[idx].kategori = this.formEdit.kategori;
        this.stok[idx].upbjj = this.formEdit.upbjj;
        this.stok[idx].lokasiRak = this.formEdit.lokasiRak.trim();
        this.stok[idx].harga = Number(this.formEdit.harga);
        this.stok[idx].qty = Number(this.formEdit.qty);
        this.stok[idx].safety = Number(this.formEdit.safety);
        this.stok[idx].catatanHTML = this.formEdit.catatanHTML.trim();

        this.tutupEditModal();
        this.tampilkanFlash('Data bahan ajar ' + self.formEdit.kode + ' berhasil diperbarui!', 'success');
      }
    },

    // --- QUICK ACTION & HAPUS ---
    quickAdjustQty: function (item, delta) {
      var newQty = Number(item.qty) + delta;
      if (newQty < 0) {
        alert('Stok tidak boleh kurang dari 0!');
        return;
      }
      item.qty = newQty;
      var statusMsg = delta > 0 ? 'ditambah' : 'dikurangi';
      this.tampilkanFlash('Stok ' + item.kode + ' ' + statusMsg + ' 1 (Total: ' + item.qty + ').', 'info');
    },

    hapusBahanAjar: function (item) {
      if (confirm('Apakah Anda yakin ingin menghapus bahan ajar ' + item.kode + ' (' + item.judul + ')?')) {
        var idx = this.stok.indexOf(item);
        if (idx !== -1) {
          this.stok.splice(idx, 1);
          this.tampilkanFlash('Bahan ajar ' + item.kode + ' berhasil dihapus dari sistem.', 'warning');
        }
      }
    }
  }
});
