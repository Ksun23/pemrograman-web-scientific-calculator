# Scientific Calculator

Kalkulator ilmiah berbasis web yang dibuat menggunakan **HTML, CSS, dan JavaScript murni** tanpa framework atau library tambahan. Proyek ini dibuat sebagai tugas Pemrograman Web untuk mempraktikkan struktur halaman, styling, interaksi DOM, fungsi JavaScript, dan operasi matematika.

## Fitur

- Operasi aritmetika: penjumlahan, pengurangan, perkalian, pembagian, dan modulo.
- Operasi ilmiah: pangkat, akar kuadrat, dan faktorial.
- Trigonometri: `sin`, `cos`, dan `tan`.
- Logaritma: `log` (basis 10) dan `ln` (logaritma natural).
- Konstanta matematika: `π` dan `e`.
- Mode sudut **DEG** (derajat) dan **RAD** (radian).
- `Ans` untuk menggunakan hasil perhitungan terakhir.
- Riwayat hingga delapan perhitungan terakhir, dengan tombol untuk memakai kembali ekspresi.
- Validasi input, termasuk penanganan pembagian dengan nol dan ekspresi yang tidak valid.
- Dukungan keyboard, penyalinan hasil, dan tampilan responsif untuk layar kecil.

## Struktur File

```text
scientific-calculator/
├── index.html   # Struktur halaman dan tombol kalkulator
├── style.css    # Tampilan, warna, layout, dan responsivitas
├── script.js    # Logika perhitungan dan interaksi pengguna
└── README.md    # Dokumentasi proyek
```

## Teknologi yang Digunakan

- **HTML5** untuk struktur dan elemen halaman.
- **CSS3** untuk desain dark mode, grid tombol, dan tata letak responsif.
- **JavaScript** untuk membaca input, menghitung ekspresi, memperbarui tampilan, dan mengelola riwayat.

Proyek ini tidak memerlukan framework, package manager, atau proses build.

## Cara Menjalankan

### Opsi 1: Buka langsung

1. Unduh atau clone repository.
2. Buka file `index.html` di browser.

### Opsi 2: Jalankan melalui server lokal

Jika Python sudah terpasang, buka terminal di folder proyek dan jalankan:

```bash
python -m http.server 8000
```

Kemudian buka alamat berikut di browser:

```text
http://localhost:8000
```

## Cara Menggunakan

1. Klik tombol angka dan operator untuk menyusun ekspresi.
2. Gunakan tombol fungsi seperti `sin`, `cos`, `tan`, `√`, `ln`, atau `log`. Fungsi akan menambahkan tanda kurung; masukkan angkanya lalu tutup kurung jika diperlukan.
3. Pilih **DEG** untuk sudut dalam derajat atau **RAD** untuk sudut dalam radian.
4. Tekan tombol `=` atau **Enter** untuk menghitung.
5. Gunakan `AC` untuk menghapus seluruh ekspresi dan `⌫` atau **Backspace** untuk menghapus karakter terakhir.
6. Tekan `Ans` untuk memasukkan hasil perhitungan terakhir.
7. Hasil perhitungan yang berhasil masuk ke bagian riwayat. Tekan **GUNAKAN** untuk memuat kembali ekspresi tersebut.
8. Tekan **COPY** untuk menyalin hasil, jika clipboard di browser tersedia.

### Contoh Perhitungan

| Ekspresi | Hasil |
| --- | ---: |
| `12 + 8` | `20` |
| `5 × 6 − 4` | `26` |
| `2^3` | `8` |
| `√(81)` | `9` |
| `sin(30)` dalam mode DEG | `0.5` |
| `log(100)` | `2` |
| `5!` | `120` |

## Gambaran Cara Kerja Program

- **HTML** menyediakan elemen layar, tombol kalkulator, pilihan mode sudut, dan area riwayat.
- **CSS** mengatur tampilan dark mode, warna aksen, grid tombol, dan penyesuaian tampilan pada layar kecil.
- **JavaScript** menangani klik tombol dan input keyboard, mengubah ekspresi menjadi token, memproses operasi berdasarkan prioritas matematika, lalu menampilkan hasil.
- Program menggunakan parser ekspresi sendiri dan tidak menggunakan `eval()` untuk menghitung input.
- Riwayat disimpan sementara selama halaman dibuka. Riwayat akan kembali kosong setelah halaman dimuat ulang atau ditutup.

## Batasan

- Faktorial hanya mendukung bilangan bulat nonnegatif hingga `170`.
- Akar kuadrat bilangan negatif dan logaritma dari nol atau bilangan negatif tidak menghasilkan bilangan real, sehingga ditolak.
- `tan` tidak terdefinisi pada sudut ketika nilai cosinus mendekati nol.
- Riwayat belum disimpan secara permanen di browser.

## Pengembangan Selanjutnya

Fitur yang bisa ditambahkan pada versi berikutnya antara lain penyimpanan riwayat menggunakan `localStorage`, tema terang, lebih banyak fungsi ilmiah, dan pengujian otomatis.

## Tujuan Pembelajaran

Melalui proyek ini, mahasiswa dapat berlatih menggunakan elemen HTML, selector dan layout CSS, event listener, fungsi JavaScript, manipulasi DOM, validasi input, serta penerapan operasi matematika dalam aplikasi web sederhana.

---

