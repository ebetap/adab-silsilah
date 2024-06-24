## Dokumentasi `ADABsilsilah`

`ADABsilsilah` adalah kelas JavaScript untuk mengelola pohon keluarga, termasuk penambahan anggota, penghapusan, pembaruan, pencarian, visualisasi, dan lain-lain. Kelas ini juga mendukung beberapa bahasa dan berbagai fitur canggih seperti pengingat dan integrasi API.

### Struktur Kelas

#### FamilyMember
Kelas ini merepresentasikan satu anggota keluarga dengan atribut seperti `id`, `name`, `gender`, `birthDate`, `deathDate`, `parents`, `children`, `siblings`, `spouse`, `phone`, dan `events`.

**Konstruktor:**
```javascript
constructor({ id, name, gender, birthDate, deathDate = null, parents = [], children = [], siblings = [], spouse = null, phone = null })
```

**Metode:**
- `addChild(child)`
- `addSibling(sibling)`
- `addSpouse(spouse)`
- `addEvent(event)`
- `recursiveUpdate(updatedInfo)`

#### ADABsilsilah
Kelas utama untuk mengelola pohon keluarga.

**Konstruktor:**
```javascript
constructor(rootMember)
```

**Metode:**
- `findMember(memberId)`
- `validateMember(member)`
- `validateDate(dateString)`
- `addMember(member, relationship, relativeId)`
- `removeMember(memberId)`
- `updateMember(memberId, updatedInfo)`
- `addEvent(memberId, event)`
- `toJson()`
- `displayFamilyTree(member = this.root, indent = "")`
- `displayFamilyTreeD3()`
- `searchMembers(query)`
- `exportToCSV()`
- `importFromCSV(csvData)`
- `backupToJSON()`
- `restoreFromJSON(jsonData)`
- `fetchDataFromAPI(apiEndpoint)`
- `sendNotification(event, recipientPhone)`
- `addReminder(memberId, event)`
- `scheduleReminder(callback, date)`

### Penggunaan

Berikut adalah contoh lengkap penggunaan `ADABsilsilah`:

#### 1. Inisialisasi dan Penambahan Anggota

```javascript
import ADABsilsilah from './ADABsilsilah';

// Inisialisasi pohon keluarga dengan anggota akar
const rootMember = {
  id: 1,
  name: "John Doe",
  gender: "male",
  birthDate: "1970-01-01",
  phone: "1234567890"
};

const familyTree = new ADABsilsilah(rootMember);

// Menambahkan anak
const childMember = {
  id: 2,
  name: "Jane Doe",
  gender: "female",
  birthDate: "1995-06-15",
  phone: "0987654321"
};
familyTree.addMember(childMember, 'child', 1);

// Menambahkan saudara
const siblingMember = {
  id: 3,
  name: "Jim Doe",
  gender: "male",
  birthDate: "1975-03-22",
  phone: "1112223333"
};
familyTree.addMember(siblingMember, 'sibling', 1);

// Menambahkan pasangan
const spouseMember = {
  id: 4,
  name: "Mary Doe",
  gender: "female",
  birthDate: "1971-02-20",
  phone: "4445556666"
};
familyTree.addMember(spouseMember, 'spouse', 1);
```

#### 2. Pembaruan Anggota

```javascript
const updatedInfo = {
  name: "John Smith",
  phone: "1231231234"
};
familyTree.updateMember(1, updatedInfo);
```

#### 3. Pencarian Anggota

```javascript
const searchResults = familyTree.searchMembers('Jane');
console.log(searchResults);
```

#### 4. Menambahkan Kejadian Khusus

```javascript
const event = {
  date: "2024-06-24",
  description: "Graduation Ceremony"
};
familyTree.addEvent(2, event);
```

#### 5. Export dan Import CSV

```javascript
const csvData = familyTree.exportToCSV();
console.log(csvData);

// Mengimpor data dari CSV
const csvDataToImport = `ID,Name,Gender,BirthDate,DeathDate,Parents,Children,Siblings,Spouse,Phone
5, "Jake Doe", male, "2000-05-10", , , , , , "7778889999"
6, "Jill Doe", female, "2002-08-25", , , , , , "0001112222"`;
familyTree.importFromCSV(csvDataToImport);
```

#### 6. Backup dan Restore JSON

```javascript
const backupData = familyTree.backupToJSON();
console.log(backupData);

// Merestorasi dari backup
familyTree.restoreFromJSON(backupData);
```

#### 7. Visualisasi dengan D3

Tambahkan elemen `<svg>` di HTML:
```html
<svg width="500" height="500"></svg>
```

Lalu panggil metode visualisasi:
```javascript
familyTree.displayFamilyTreeD3();
```

#### 8. Pengingat dan Notifikasi

```javascript
const eventReminder = {
  date: "2024-12-01",
  description: "Doctor Appointment"
};
familyTree.addReminder(2, eventReminder);
```

#### 9. Mengambil Data dari API

```javascript
const apiEndpoint = "https://example.com/api/familyMembers";
familyTree.fetchDataFromAPI(apiEndpoint);
```

### Penjelasan

- **Dukungan Multibahasa**: Menggunakan `i18next` untuk pesan error yang dapat disesuaikan dengan bahasa yang dipilih.
- **Penanganan Error**: Menggunakan `FamilyTreeError` untuk memberikan informasi lebih lanjut tentang error yang terjadi.
- **Validasi Data**: Validasi untuk tanggal dan nomor telepon untuk memastikan integritas data.
- **Visualisasi**: Menggunakan `d3.js` untuk memvisualisasikan pohon keluarga.
- **Backup dan Restore**: Metode untuk melakukan backup dan restore data menggunakan JSON.
- **Pencarian**: Fitur pencarian yang memungkinkan pencarian anggota berdasarkan nama dan jenis kelamin.
- **Pengingat dan Notifikasi**: Menambahkan fitur untuk mengirim pengingat acara khusus.
- **Integrasi API**: Menambahkan kemampuan untuk mengambil data anggota keluarga dari API eksternal.

### Kesimpulan

Kelas `ADABsilsilah` dirancang untuk menjadi alat yang kuat dan fleksibel untuk mengelola pohon keluarga. Dengan berbagai fitur yang mendukung multibahasa, validasi data yang kuat, dan kemampuan untuk mengelola dan menampilkan informasi keluarga secara visual, kelas ini dapat digunakan dalam berbagai konteks aplikasi.
