const dataWilayah = {
    "Kabupaten Madiun": [
        { nama: "Mejayan", letak: "-7.5960, 111.6420" },
        { nama: "Wungu", letak: "-7.6667, 111.5500" },
        { nama: "Jiwan", letak: "-7.6074, 111.4925" },
        { nama: "Saradan", letak: "-7.5682, 111.7583" }
    ],
    "Kota Madiun": [
        { nama: "Kartoharjo", letak: "-7.6186, 111.5239" },
        { nama: "Manguharjo", letak: "-7.6321, 111.5165" },
        { nama: "Taman", letak: "-7.6483, 111.5361" }
    ],
    "Kabupaten Magetan": [
        { nama: "Magetan", letak: "-7.6582, 111.3259" },
        { nama: "Plaosan", letak: "-7.6705, 111.2333" },
        { nama: "Maospati", letak: "-7.6025, 111.4425" }
    ]
};

const map = L.map('map').setView([-7.6298, 111.5239], 12); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let riwayatKasus = [];

const indeksPenyakit = {
    "Demam Berdarah": 0,
    "Tifus": 1,
    "Diare": 2,
    "Influenza": 3
};

const ctx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
        datasets: [
            { label: 'Demam Berdarah (DBD)', data: Array(12).fill(0), borderColor: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.1)', borderWidth: 2, fill: true, tension: 0.3 },
            { label: 'Tifus / Tipes', data: Array(12).fill(0), borderColor: '#f39c12', backgroundColor: 'rgba(243, 156, 18, 0.1)', borderWidth: 2, fill: true, tension: 0.3 },
            { label: 'Diare Parah', data: Array(12).fill(0), borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', borderWidth: 2, fill: true, tension: 0.3 },
            { label: 'Influenza', data: Array(12).fill(0), borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.1)', borderWidth: 2, fill: true, tension: 0.3 }
        ]
    },
    options: {
        responsive: true,
        scales: { 
            y: { 
                beginAtZero: true, suggestedMax: 5, ticks: { stepSize: 1 },
                title: { display: true, text: 'Jumlah Pasien', color: '#2c3e50', font: { weight: 'bold', size: 14 } }
            },
            x: {
                title: { display: true, text: 'Waktu Pelaporan', color: '#2c3e50', font: { weight: 'bold', size: 14 } }
            }
        }
    }
});

function getMingguKe(tanggal) {
    if (tanggal <= 7) return 0;       
    else if (tanggal <= 14) return 1; 
    else if (tanggal <= 21) return 2; 
    else return 3;                    
}

const selectKabupaten = document.getElementById('kabupaten');
const selectKecamatan = document.getElementById('lokasi');

selectKabupaten.addEventListener('change', function() {
    const kabupatenPilihan = this.value;
    if (!kabupatenPilihan) {
        selectKecamatan.innerHTML = '<option value="">Pilih Kabupaten terlebih dahulu...</option>';
        selectKecamatan.disabled = true;
        return;
    }
    selectKecamatan.disabled = false;
    selectKecamatan.innerHTML = '<option value="">Pilih Kecamatan...</option>';

    const daftarKecamatan = dataWilayah[kabupatenPilihan];
    daftarKecamatan.forEach(kec => {
        const option = document.createElement('option');
        option.value = kec.letak; 
        option.textContent = kec.nama; 
        selectKecamatan.appendChild(option);
    });
});

function renderGrafik() {
    const filterBulan = document.getElementById('filterBulan').value;

    if (filterBulan === 'semua') {
        trendChart.data.labels = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        trendChart.data.datasets.forEach(dataset => { dataset.data = Array(12).fill(0); });
    } else {
        trendChart.data.labels = ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'];
        trendChart.data.datasets.forEach(dataset => { dataset.data = Array(4).fill(0); });
    }

    riwayatKasus.forEach(kasus => {
        const parts = kasus.waktu.split('-'); 
        const bulanKasus = (parseInt(parts[1], 10) - 1).toString();
        const tanggalKasus = parseInt(parts[2], 10);
        
        const indeksDataset = indeksPenyakit[kasus.diagnosis];

        if (indeksDataset !== undefined) {
            if (filterBulan === 'semua') {
                trendChart.data.datasets[indeksDataset].data[parseInt(bulanKasus)] += 1;
            } else if (filterBulan === bulanKasus) {
                const indeksMinggu = getMingguKe(tanggalKasus);
                trendChart.data.datasets[indeksDataset].data[indeksMinggu] += 1;
            }
        }
    });

    trendChart.update();
}

document.getElementById('filterBulan').addEventListener('change', renderGrafik);

document.getElementById('formPenyakit').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const pasien = document.getElementById('nama').value;
    const usia = document.getElementById('usia').value;         
    const alamat = document.getElementById('alamat').value;     
    const gejala = document.getElementById('gejala').value;     
    const diagnosis = document.getElementById('diagnosis').value;
    const waktu = document.getElementById('waktu').value;
    
    const namaKabupaten = selectKabupaten.options[selectKabupaten.selectedIndex].text;
    const namaKecamatan = selectKecamatan.options[selectKecamatan.selectedIndex].text;
    const koordinatRaw = selectKecamatan.value;

    const coords = koordinatRaw.split(',');
    const lat = parseFloat(coords[0].trim());
    const lng = parseFloat(coords[1].trim());

    const idUnik = Date.now();

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`<b>${diagnosis}</b><br>Pasien: ${pasien} (${usia} th)<br>Kec. ${namaKecamatan}`).openPopup();
    map.setView([lat, lng], 13);

    riwayatKasus.push({
        id: idUnik, waktu: waktu, pasien: pasien, usia: usia, 
        alamat: alamat, gejala: gejala, diagnosis: diagnosis,
        lokasiTeks: `${namaKecamatan}, ${namaKabupaten}`, marker: marker 
    });

    renderTabel();
    renderGrafik();

    alert("Data pasien berhasil disimpan!");
    
    this.reset();
    selectKecamatan.innerHTML = '<option value="">Pilih Kabupaten terlebih dahulu...</option>';
    selectKecamatan.disabled = true;
});

function renderTabel() {
    const tbody = document.getElementById('bodyTabelRiwayat');
    tbody.innerHTML = ''; 
    
    riwayatKasus.forEach(kasus => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${kasus.waktu}</td>
            <td>${kasus.pasien}</td>
            <td>${kasus.usia} thn</td>
            <td>${kasus.alamat}</td>
            <td>${kasus.gejala}</td>
            <td>${kasus.diagnosis}</td>
            <td>${kasus.lokasiTeks}</td>
            <td><button class="btn-delete" onclick="hapusData(${kasus.id})">Hapus</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function hapusData(idHapus) {
    if(confirm("Apakah Anda yakin ingin menghapus data laporan ini?")) {
        const index = riwayatKasus.findIndex(kasus => kasus.id === idHapus);
        if (index !== -1) {
            const dataYangDihapus = riwayatKasus[index];
            map.removeLayer(dataYangDihapus.marker);
            
            riwayatKasus.splice(index, 1);
            
            renderTabel();
            renderGrafik();
        }
    }
}