## Dokumentasi Kelas `ADABsilsilah`

### FamilyMember Class
Represents an individual member of the family tree.

#### Attributes:
- **id** (Number): Unique identifier for the family member.
- **name** (String): Name of the family member.
- **gender** (String): Gender of the family member.
- **birthDate** (String): Birth date of the family member in `YYYY-MM-DD` format.
- **deathDate** (String, optional): Death date of the family member in `YYYY-MM-DD` format.
- **parents** (Array): Array of parent IDs.
- **children** (Array): Array of child `FamilyMember` instances.
- **siblings** (Array): Array of sibling `FamilyMember` instances.
- **spouse** (FamilyMember, optional): Spouse `FamilyMember` instance.
- **phone** (String, optional): Phone number of the family member.
- **events** (Array): Array to store special events related to the member.

#### Methods:
- **addChild(child)**: Adds a child to the member.
- **addSibling(sibling)**: Adds a sibling to the member.
- **addSpouse(spouse)**: Adds a spouse to the member.
- **addEvent(event)**: Adds an event to the member.
- **recursiveUpdate(updatedInfo)**: Recursively updates member's information and related members.

### ADABsilsilah Class
Manages the entire family tree structure.

#### Constructor:
- **constructor(rootMember)**: Initializes the family tree with a root member.

#### Methods:
- **findMember(memberId)**: Finds and returns a member by ID.
- **validateMember(member)**: Validates the given member object for required attributes and correct formats.
- **validateDate(dateString)**: Validates the format of a date string (`YYYY-MM-DD`).
- **addMember(member, relationship, relativeId)**: Adds a new member to the tree with a specified relationship (child, sibling, spouse) to an existing relative.
- **removeMember(memberId)**: Removes a member from the tree by ID and updates related members.
- **updateMember(memberId, updatedInfo)**: Updates information of an existing member by ID.
- **addEvent(memberId, event)**: Adds an event to a member by ID.
- **toJson()**: Converts the family tree to a JSON format.
- **displayFamilyTree(member, indent)**: Displays the family tree hierarchy starting from the given member (default is root).
- **searchMembers(query)**: Searches for members based on name or gender.
- **exportToCSV()**: Exports the family tree data to a CSV format.
- **importFromCSV(csvData)**: Imports family tree data from a CSV format.

#### Usage Example:
```javascript
// Creating a family tree instance
const rootMember = {
  id: 1,
  name: "John Doe",
  gender: "Male",
  birthDate: "1990-01-01"
};
const familyTree = new ADABsilsilah(rootMember);

// Adding members and relationships
familyTree.addMember({ id: 2, name: "Jane Doe", gender: "Female", birthDate: "1995-02-15" }, "spouse", 1);
familyTree.addMember({ id: 3, name: "Alice Doe", gender: "Female", birthDate: "2020-05-10" }, "child", 1);

// Displaying family tree
familyTree.displayFamilyTree();

// Updating a member
familyTree.updateMember(1, { name: "John Smith", phone: "1234567890" });

// Adding an event
familyTree.addEvent(1, { date: "2024-01-01", description: "New Year Celebration" });

// Exporting to CSV
const csvData = familyTree.exportToCSV();
console.log(csvData);

// Importing from CSV
familyTree.importFromCSV(csvData);

// Searching for members
const searchResults = familyTree.searchMembers("Jane");
console.log(searchResults);
```

### Penjelasan Metode Baru dan yang Diperbarui:
- **validateDate(dateString)**: Menambahkan validasi untuk memastikan bahwa string tanggal berada dalam format `YYYY-MM-DD`.
- **recursiveUpdate(updatedInfo)**: Metode tambahan dalam `FamilyMember` untuk memperbarui informasi anggota dan informasi terkait (anak, saudara) secara rekursif.
- **updateMember(memberId, updatedInfo)**: Memperbarui logika untuk memastikan validasi tambahan pada format tanggal dan memperbarui informasi terkait menggunakan `recursiveUpdate`.

### Penanganan Impor dan Ekspor CSV:
- **exportToCSV()**: Mengekspor data pohon keluarga ke format CSV dengan header yang jelas.
- **importFromCSV(csvData)**: Mengimpor data pohon keluarga dari format CSV, memastikan setiap anggota diubah menjadi instance `FamilyMember`.

### Kesimpulan:
Dengan perbaikan ini, kelas `ADABsilsilah` menjadi lebih kuat dan fleksibel dalam menangani berbagai skenario manajemen pohon keluarga, termasuk validasi yang lebih baik, pembaruan rekursif, dan kemampuan impor/ekspor yang lebih efisien.
