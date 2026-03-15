## Penjelasan Struktur dan Blok Kode Program

Berikut adalah penjelasan untuk blok kode program yang menjadi fokus pada tugas praktikum ini:

### 1. `login.html` (Antarmuka Autentikasi)
File ini menangani antarmuka untuk proses *Login* dan *Register* pengguna dalam satu halaman (*Single Page*) menggunakan animasi pergeseran (*sliding form*).
* **Blok Layout & Animasi Tailwind:** Memanfaatkan *utility class* Tailwind seperti penambahan kelas `group` pada elemen *container* pembungkus. Form pendaftaran disembunyikan di luar area pandang menggunakan `translate-x-full` dan dimunculkan menggunakan transisi kelas secara dinamis.
* **Blok Script Interaksi:** Terdapat baris script JavaScript di bagian bawah kode yang bertugas mendeteksi kejadian klik (*event listener*) pada tombol "Daftar" atau "Masuk". Script ini akan menambahkan atau menghapus kelas `is-sign-up` pada *container* utama untuk mengeksekusi animasi pergeseran form.

### 2. `edukasi.html` (Pusat Informasi Penyakit)
File ini bertugas menyajikan informasi terkait gejala dan langkah pencegahan penyakit menular.
* **Blok *Responsive Grid*:** Memanfaatkan kelas utilitas Tailwind `grid-cols-1 md:grid-cols-2`. Pada ukuran layar *mobile*, kartu informasi akan disusun memanjang ke bawah (1 kolom). Namun, ketika dibuka pada layar yang lebih lebar seperti laptop (`md:`), *layout* akan otomatis berubah menjadi 2 kolom yang berdampingan.
* **Blok *Hover Effect* Kartu:** Setiap kotak kartu informasi (*card*) dilengkapi dengan kelas `hover:-translate-y-2`. Kelas ini memberikan efek di mana kartu seolah-olah sedikit terangkat ke atas ketika disorot oleh kursor *mouse*, sehingga tampilan *website* menjadi lebih hidup dan tidak kaku.
