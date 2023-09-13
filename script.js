class Pendaftar {
    constructor(nama, umur, uang) {
        this.nama = nama;
        this.umur = umur;
        this.uang = uang;
    }
}

let wadah = [];

function kirim() {
    const nameInput = document.getElementById("name");
    const umurInput = document.getElementById("umur");
    const uangInput = document.getElementById("uang");

    const name = nameInput.value;
    const umur = parseInt(umurInput.value);
    const uang = parseInt(uangInput.value);

    // Reset pesan kesalahan
    document.getElementById("errorName").textContent = "";
    document.getElementById("errorUmur").textContent = "";
    document.getElementById("errorUang").textContent = "";

    let isValid = true;

    if (name.length < 10) {
        document.getElementById("errorName").textContent = "Nama minimal 10 karakter.";
        isValid = false;
    }

    if (isNaN(umur) || umur < 25) {
        document.getElementById("errorUmur").textContent = "Umur minimal 25 tahun.";
        isValid = false;
    }

    if (isNaN(uang) || uang < 100000 || uang > 1000000) {
        document.getElementById("errorUang").textContent = "Uang saku minimal 100 ribu dan maksimal 1 juta.";
        isValid = false;
    }

    if (!isValid) {
        return; // Jangan lanjutkan jika ada kesalahan
    }

    const pendaftar = new Pendaftar(name, umur, uang);
    wadah.push(pendaftar);

    // Simpan data ke localStorage
    // Ambil data yang sudah ada dari local storage
    const existingData = JSON.parse(localStorage.getItem('wadah')) || [];

    
    // Arahkan pengguna ke halaman "listPendaftar.html"
    window.location.href = "/listPendaftar.html";
    // Tambahkan data baru ke array yang sudah ada
    existingData.push(pendaftar);

    // Simpan kembali array yang telah diperbarui ke local storage
    localStorage.setItem('wadah', JSON.stringify(existingData));
    console.log(wadah);

    // Membuat baris baru untuk tabel
    const newRow = document.createElement("tr");

    // Membuat sel-sel untuk data nama, umur, dan uang
    for (let i = 0; i < 3; i++) {
        const cell = document.createElement("td");
        const cellText = document.createTextNode(i === 0 ? pendaftar.nama : (i === 1 ? pendaftar.umur : pendaftar.uang));
        cell.appendChild(cellText);
        newRow.appendChild(cell);
    }

    // Memasukkan baris baru ke dalam tabel
    document.querySelector("table tbody").appendChild(newRow);

    // Mengosongkan input fields setelah data dimasukkan
    nameInput.value = "";
    umurInput.value = "";
    uangInput.value = "";
}

function tampilkanData() {
    const tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = "";

    // Ambil data dari local storage
    const storedData = JSON.parse(localStorage.getItem('wadah'));

    if (storedData) {
        let totalUmur = 0;
        let totalUang = 0;

        storedData.forEach((pendaftar, index) => {
            const newRow = document.createElement("tr");
            const data = [pendaftar.nama, pendaftar.umur, pendaftar.uang];

            data.forEach((value) => {
                const cell = document.createElement("td");
                const cellText = document.createTextNode(value);
                cell.appendChild(cellText);
                newRow.appendChild(cell);
            });

            // Add a delete button
            const deleteCell = document.createElement("td");
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.onclick = () => deletePendaftar(index);
            deleteCell.appendChild(deleteButton);
            newRow.appendChild(deleteCell);

            tableBody.appendChild(newRow);

            // Update total umur dan uang
            totalUmur += pendaftar.umur;
            totalUang += pendaftar.uang;
        });

        const rataRataUmur = totalUmur / storedData.length;
        const rataRataUang = totalUang / storedData.length;

        // Tampilkan rata-rata di bawah tabel
        const rataRataRow = document.createElement("tr");
        const rataRataCell = document.createElement("td");
        rataRataCell.setAttribute("colspan", "4");
        rataRataCell.textContent = `Rata-rata pendaftar memiliki uang saku sebesar ${rataRataUang} dengan rata-rata umur ${rataRataUmur}`;
        rataRataRow.appendChild(rataRataCell);

        tableBody.appendChild(rataRataRow);
    }
}

function deletePendaftar(index) {
    // Remove the pendaftar from the local storage data
    const storedData = JSON.parse(localStorage.getItem('wadah'));
    storedData.splice(index, 1);
    localStorage.setItem('wadah', JSON.stringify(storedData));

    // Refresh the table
    tampilkanData();
}

// Call tampilkanData when the page loads
window.onload = tampilkanData;

