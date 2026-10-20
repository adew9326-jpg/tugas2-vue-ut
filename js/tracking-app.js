/**
 * ==============================================================================
 * SITTA UT - Sistem Informasi Tiras dan Transaksi Bahan Ajar Universitas Terbuka
 * File: js/tracking-app.js
 * Logika Vue.js untuk Halaman 2: Tracking Delivery Order (tracking.html)
 *
 * Mengimplementasikan 5 Indikator Capaian:
 * 1. Pengorganisasian kode Vue.js standar & rapi
 * 2. Data Display & Binding: Mustaches {{ }}, v-text, v-html, v-bind, v-model, v-for
 * 3. Conditional: v-if, v-else-if, v-else, v-show
 * 4. Property: Computed Property (dengan caching reaktif) & Methods Property
 * 5. Watchers: Minimal 2 Watcher untuk memantau perubahan data reaktif
 * ==============================================================================
 */

var trackingApp = new Vue({
  el: '#tracking-app',

  // --------------------------------------------------------------------------
  // DATA REACTIVE STATE
  // --------------------------------------------------------------------------
  data: {
    // Master data ekspedisi & paket bahan ajar (diambil dari dataBahanAjar.js)
    pengirimanList: (typeof dummyDataBahanAjar !== 'undefined')
      ? dummyDataBahanAjar.pengirimanList
      : [
          { kode: "REG", nama: "Reguler (3-5 hari)" },
          { kode: "EXP", nama: "Ekspres (1-2 hari)" }
        ],

    paket: (typeof dummyDataBahanAjar !== 'undefined')
      ? dummyDataBahanAjar.paket
      : [
          { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
          { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
        ],

    // Data riwayat tracking DO (Dictionary Key: Nomor DO)
    trackingData: (typeof dummyDataBahanAjar !== 'undefined')
      ? JSON.parse(JSON.stringify(dummyDataBahanAjar.tracking))
      : {
          "DO2025-0001": {
            noDO: "DO2025-0001",
            nim: "123456789",
            nama: "Rina Wulandari",
            status: "Dalam Perjalanan",
            ekspedisi: "JNE Regular (3-5 hari)",
            tanggalKirim: "2025-08-25",
            paket: "PAKET-UT-001",
            paketNama: "PAKET IPS Dasar",
            total: 120000,
            perjalanan: [
              { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
              { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
              { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
            ]
          }
        },

    // State Formulir Tambah Delivery Order (DO) Baru
    formDO: {
      noDO: '',          // Digenerate otomatis oleh computed property
      nim: '',
      nama: '',
      ekspedisi: 'JNE Regular (3-5 hari)',
      paketKode: '',     // Dipilih via <select>
      tanggalKirim: '',  // Diisi manual atau via tombol local time Date
      totalHarga: 0
    },

    // State Validasi Form DO
    errorsDO: {},

    // State Fitur Pencarian / Lacak Tracking DO
    keywordCariDO: 'DO2025-0001',
    hasilCariDO: null,
    pesanErrorCari: '',

    // Notifikasi Aksi Pengguna
    flashMessage: '',
    flashType: 'info',

    // Feedback dari Watcher
    watcherLogDO: 'Sistem siap menerima input pemesanan DO baru.'
  },

  // --------------------------------------------------------------------------
  // LIFECYCLE HOOKS
  // --------------------------------------------------------------------------
  created: function () {
    // Inisialisasi tanggal kirim otomatis ke local date (YYYY-MM-DD)
    this.isiTanggalHariIni();

    // Set nomor DO awal otomatis ke form
    this.formDO.noDO = this.nextNomorDO;

    // Tampilkan data tracking default pada pencarian
    this.lacakDO('DO2025-0001');
  },

  // --------------------------------------------------------------------------
  // COMPUTED PROPERTIES
  // --------------------------------------------------------------------------
  computed: {
    /**
     * GENERATOR NOMOR DO OTOMATIS:
     * Format: DO{Tahun Berjalan}-{Sequence Number 3 digit}
     * Contoh: DO2025-001, jika ada tracking baru menjadi DO2025-002, dst.
     */
    nextNomorDO: function () {
      var tahunBerjalan = new Date().getFullYear(); // misal: 2025 / 2026
      var prefix = 'DO' + tahunBerjalan + '-';

      // Cari nomor sequence tertinggi yang ada di trackingData untuk tahun ini
      var maxSeq = 0;
      for (var key in this.trackingData) {
        if (this.trackingData.hasOwnProperty(key)) {
          var no = key.toUpperCase();
          if (no.indexOf(prefix) === 0) {
            var seqStr = no.substring(prefix.length);
            var seqNum = parseInt(seqStr, 10);
            if (!isNaN(seqNum) && seqNum > maxSeq) {
              maxSeq = seqNum;
            }
          } else if (no.indexOf('DO') === 0) {
            // Kompatibilitas jika ada data tahun berbeda (misal DO2025-001)
            var parts = no.split('-');
            if (parts.length === 2) {
              var sNum = parseInt(parts[1], 10);
              if (!isNaN(sNum) && sNum > maxSeq) {
                maxSeq = sNum;
              }
            }
          }
        }
      }

      var nextSeq = maxSeq + 1;
      var paddedSeq = ('000' + nextSeq).slice(-3);
      return prefix + paddedSeq;
    },

    /**
     * Mengambil detail objek paket terpilih berdasarkan formDO.paketKode
     * Digunakan untuk menampilkan informasi detail isi paket di bawah <select>
     */
    selectedPaketDetail: function () {
      var self = this;
      if (!this.formDO.paketKode) {
        return null;
      }
      var ditemukan = this.paket.find(function (p) {
        return p.kode === self.formDO.paketKode;
      });
      return ditemukan || null;
    },

    /**
     * Mengubah dictionary trackingData menjadi Array terurut
     * untuk dirender pada tabel riwayat pemesanan DO
     */
    trackingArrayList: function () {
      var arr = [];
      for (var key in this.trackingData) {
        if (this.trackingData.hasOwnProperty(key)) {
          var item = this.trackingData[key];
          // Pastikan noDO tersedia
          if (!item.noDO) {
            item.noDO = key;
          }
          arr.push(item);
        }
      }
      // Urutkan dari data paling baru (noDO descending)
      return arr.sort(function (a, b) {
        return b.noDO.localeCompare(a.noDO);
      });
    },

    // Total pengiriman DO terdaftar
    totalDORegistrasi: function () {
      return Object.keys(this.trackingData).length;
    }
  },

  // --------------------------------------------------------------------------
  // WATCHERS (Minimal 2 Watcher sesuai Indikator 1.5)
  // --------------------------------------------------------------------------
  watch: {
    /**
     * WATCHER 1: Memantau perubahan pilihan Paket Bahan Ajar (formDO.paketKode)
     * - Ketika pengguna memilih paket pada dropdown <select>, watcher otomatis
     *   mengupdate totalHarga form dari array of objects paket->harga
     * - Menyiapkan feedback informasi isi paket
     */
    'formDO.paketKode': function (newKode) {
      if (!newKode) {
        this.formDO.totalHarga = 0;
        this.watcherLogDO = 'Silakan pilih paket bahan ajar yang dipesan.';
        return;
      }

      var self = this;
      var selected = this.paket.find(function (p) {
        return p.kode === newKode;
      });

      if (selected) {
        // Otomatis sinkronisasi harga ke formDO
        this.formDO.totalHarga = selected.harga;
        this.watcherLogDO = 'Paket terpilih: ' + selected.nama +
          ' (' + selected.kode + ') | Total Biaya: ' + this.formatRupiah(selected.harga) +
          ' | Berisi ' + selected.isi.length + ' buku materi pokok.';
      }
    },

    /**
     * WATCHER 2: Memantau input kata kunci pencarian Nomor DO (keywordCariDO)
     * - Live search: Begitu pengguna mengetik atau memilih Nomor DO, watcher
     *   langsung melakukan pencarian otomatis (reactive lookup) tanpa harus tekan tombol.
     */
    keywordCariDO: function (newVal) {
      var query = (newVal || '').trim().toUpperCase();
      if (query === '') {
        this.hasilCariDO = null;
        this.pesanErrorCari = '';
        return;
      }

      // Cari langsung jika ada kesamaan nomor DO
      if (this.trackingData[query]) {
        this.hasilCariDO = this.trackingData[query];
        this.pesanErrorCari = '';
      } else {
        // Cek jika pencarian parsial cocok
        var keys = Object.keys(this.trackingData);
        var matchKey = keys.find(function (k) {
          return k.toUpperCase().indexOf(query) !== -1;
        });

        if (matchKey) {
          this.hasilCariDO = this.trackingData[matchKey];
          this.pesanErrorCari = '';
        } else {
          this.hasilCariDO = null;
          this.pesanErrorCari = 'Nomor Delivery Order "' + query + '" tidak ditemukan dalam sistem SITTA UT.';
        }
      }
    },

    /**
     * WATCHER 3 (Tambahan): Memantau input NIM mahasiswa
     * Memberikan validasi realtime bila input mengandung karakter selain angka.
     */
    'formDO.nim': function (newNIM) {
      if (newNIM && !/^\d+$/.test(newNIM)) {
        this.errorsDO.nim = 'NIM hanya boleh berisi digit angka (0-9)!';
      } else if (newNIM && (newNIM.length < 9 || newNIM.length > 10)) {
        this.errorsDO.nim = 'NIM mahasiswa UT umumnya terdiri dari 9 digit angka.';
      } else {
        delete this.errorsDO.nim;
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

    // Mengisi input tanggal kirim menggunakan fungsi Date untuk mengambil local time
    isiTanggalHariIni: function () {
      var d = new Date();
      var year = d.getFullYear();
      var month = ('0' + (d.getMonth() + 1)).slice(-2);
      var day = ('0' + d.getDate()).slice(-2);
      this.formDO.tanggalKirim = year + '-' + month + '-' + day;
    },

    // Mencari riwayat DO secara manual
    lacakDO: function (nomorDO) {
      this.keywordCariDO = nomorDO;
    },

    // Validasi form tambah DO
    validasiFormDO: function () {
      var err = {};
      var f = this.formDO;

      if (!f.nim || f.nim.trim() === '') {
        err.nim = 'NIM mahasiswa wajib diisi!';
      } else if (!/^\d{9,10}$/.test(f.nim.trim())) {
        err.nim = 'NIM harus berupa 9 digit angka!';
      }

      if (!f.nama || f.nama.trim().length < 2) {
        err.nama = 'Nama lengkap mahasiswa minimal 2 karakter!';
      }

      if (!f.ekspedisi) {
        err.ekspedisi = 'Pilih salah satu layanan ekspedisi!';
      }

      if (!f.paketKode) {
        err.paketKode = 'Silakan pilih Paket Bahan Ajar yang dipesan!';
      }

      if (!f.tanggalKirim) {
        err.tanggalKirim = 'Tanggal kirim wajib diisi!';
      }

      this.errorsDO = err;
      return Object.keys(err).length === 0;
    },

    // Menyimpan pengajuan DO baru ke reactive state trackingData
    simpanDOBaru: function () {
      if (!this.validasiFormDO()) {
        return;
      }

      var noBaru = this.nextNomorDO;
      var selectedPaket = this.selectedPaketDetail;
      var dNow = new Date();
      var timeStr = dNow.toTimeString().split(' ')[0];
      var tglKirimWaktu = this.formDO.tanggalKirim + ' ' + timeStr;

      // Buat objek DO baru
      var dataDO = {
        noDO: noBaru,
        nim: this.formDO.nim.trim(),
        nama: this.formDO.nama.trim(),
        status: "Pemesanan Diproses",
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.formDO.tanggalKirim,
        paket: selectedPaket.kode,
        paketNama: selectedPaket.nama,
        total: Number(this.formDO.totalHarga),
        perjalanan: [
          {
            waktu: tglKirimWaktu,
            keterangan: "Pemesanan Bahan Ajar berhasil dibuat di SITTA UT Pusat"
          },
          {
            waktu: tglKirimWaktu,
            keterangan: "Sedang proses packing dan persiapan pengiriman via " + this.formDO.ekspedisi
          }
        ]
      };

      // Simpan ke dictionary reactive Vue.js (menggunakan Vue.set untuk reaktivitas objek)
      this.$set(this.trackingData, noBaru, dataDO);

      // Tampilkan flash notification
      this.tampilkanFlash('Pemesanan Delivery Order ' + noBaru + ' berhasil dibuat!', 'success');

      // Set pencarian langsung ke DO baru tersebut
      this.lacakDO(noBaru);

      // Reset form untuk pesanan berikutnya
      this.resetFormDO();
    },

    // Reset formulir DO
    resetFormDO: function () {
      this.formDO.nim = '';
      this.formDO.nama = '';
      this.formDO.paketKode = '';
      this.formDO.totalHarga = 0;
      this.errorsDO = {};
      this.isiTanggalHariIni();
      this.formDO.noDO = this.nextNomorDO;
    },

    // Menampilkan flash alert
    tampilkanFlash: function (pesan, tipe) {
      this.flashMessage = pesan;
      this.flashType = tipe || 'info';
      var self = this;
      setTimeout(function () {
        self.flashMessage = '';
      }, 5000);
    }
  }
});
