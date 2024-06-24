# ADABsilsilah Documentation

## Introduction

`ADABsilsilah` is a JavaScript library designed for managing and documenting family lineage. It allows you to create and manipulate a family tree, add members with relationships, manage special events, search for members, and export/import data in CSV format.

## Installation

You can install `ADABsilsilah` via npm:

```bash
npm install adab-silsilah
```

## Usage

### Importing the Library

```javascript
import ADABsilsilah from 'adab-silsilah';

// Example data for the root member
const rootMemberData = {
  id: 1,
  name: 'John Doe',
  gender: 'male',
  birthDate: '1980-01-01',
  phone: '1234567890' // Optional: phone number
};

// Initialize the family tree with the root member
const familyTree = new ADABsilsilah(rootMemberData);
```

### Class: `ADABsilsilah`

#### Constructor: `new ADABsilsilah(rootMember)`

Initializes a new instance of `ADABsilsilah` with the root member specified.

- **Parameters:**
  - `rootMember` (Object): Data of the root member containing `id`, `name`, `gender`, `birthDate`, and optionally `phone`.

#### Methods:

1. **`addMember(member, relationship, relativeId)`**

   Adds a new member to the family tree with a specified relationship to an existing member.

   - **Parameters:**
     - `member` (Object): Data of the new member to be added.
     - `relationship` (String): Relationship type (`child`, `sibling`, `spouse`).
     - `relativeId` (Number): ID of the existing member to relate to.

   ```javascript
   const newMemberData = {
     id: 2,
     name: 'Jane Doe',
     gender: 'female',
     birthDate: '1985-03-15',
     phone: '9876543210' // Optional: phone number
   };

   familyTree.addMember(newMemberData, 'child', 1); // Adds Jane Doe as a child of John Doe
   ```

2. **`removeMember(memberId)`**

   Removes a member from the family tree.

   - **Parameters:**
     - `memberId` (Number): ID of the member to be removed.

   ```javascript
   familyTree.removeMember(2); // Removes Jane Doe from the family tree
   ```

3. **`updateMember(memberId, updatedInfo)`**

   Updates information of an existing member in the family tree.

   - **Parameters:**
     - `memberId` (Number): ID of the member to be updated.
     - `updatedInfo` (Object): Updated data fields for the member.

   ```javascript
   const updatedInfo = {
     name: 'Jane Doe-Smith',
     phone: '9876543210'
   };

   familyTree.updateMember(2, updatedInfo); // Updates Jane Doe's name and phone number
   ```

4. **`addEvent(memberId, event)`**

   Adds a special event to a member, such as birth, death, marriage, etc.

   - **Parameters:**
     - `memberId` (Number): ID of the member to add the event to.
     - `event` (String): Description of the event.

   ```javascript
   familyTree.addEvent(2, 'Married John Smith'); // Adds a marriage event to Jane Doe-Smith
   ```

5. **`findMember(memberId)`**

   Finds a member in the family tree based on their ID.

   - **Parameters:**
     - `memberId` (Number): ID of the member to find.

   - **Returns:**
     - `FamilyMember` object or `null` if not found.

   ```javascript
   const member = familyTree.findMember(2);
   if (member) {
     console.log(`Found member: ${member.name}`);
   } else {
     console.log('Member not found');
   }
   ```

6. **`searchMembers(query)`**

   Searches for members in the family tree based on a query (name or gender).

   - **Parameters:**
     - `query` (String): Search query.

   - **Returns:**
     - Array of `FamilyMember` objects that match the query.

   ```javascript
   const results = familyTree.searchMembers('Jane');
   console.log('Search results:', results);
   ```

7. **`exportToCSV()`**

   Exports the family tree data to a CSV format string.

   - **Returns:**
     - CSV format string containing member details.

   ```javascript
   const csvData = familyTree.exportToCSV();
   console.log('Exported CSV data:', csvData);
   ```

8. **`importFromCSV(csvData)`**

   Imports family tree data from a CSV format string.

   - **Parameters:**
     - `csvData` (String): CSV format data to import.

   ```javascript
   const csvData = `
     ID,Name,Gender,BirthDate,DeathDate,Parents,Children,Siblings,Spouse,Phone
     1,"John Doe",male,1980-01-01,,2,,,,1234567890
     2,"Jane Doe-Smith",female,1985-03-15,,,1,,1,9876543210
   `;

   familyTree.importFromCSV(csvData);
   ```

9. **`displayFamilyTree(member, indent)`**

   Displays the family tree starting from a specified member recursively.

   - **Parameters:**
     - `member` (FamilyMember): Optional. Starting member to display (default: root member).
     - `indent` (String): Optional. String for indentation (default: "").

   ```javascript
   familyTree.displayFamilyTree(); // Displays the entire family tree starting from the root member
   ```

10. **`toJson()`**

    Converts the family tree data to JSON format.

    - **Returns:**
      - JSON string representation of the family tree data.

    ```javascript
    const jsonData = familyTree.toJson();
    console.log('Family tree JSON:', jsonData);
    ```

### Class: `FamilyMember`

Represents a member of the family.

#### Constructor: `new FamilyMember(data)`

Initializes a new instance of `FamilyMember` with the provided data.

- **Parameters:**
  - `data` (Object): Data object containing member details (`id`, `name`, `gender`, `birthDate`, `deathDate`, `parents`, `children`, `siblings`, `spouse`, `phone`).

#### Methods:

- `addChild(child)`: Adds a child to the member.
- `addSibling(sibling)`: Adds a sibling to the member.
- `addSpouse(spouse)`: Sets the spouse of the member.
- `addEvent(event)`: Adds a special event to the member.

## Examples

```javascript
// Initialize the family tree
import ADABsilsilah from 'adabsilsilah';

const rootMemberData = {
  id: 1,
  name: 'John Doe',
  gender: 'male',
  birthDate: '1980-01-01',
  phone: '1234567890'
};

const familyTree = new ADABsilsilah(rootMemberData);

// Add members and relationships
const janeData = {
  id: 2,
  name: 'Jane Doe',
  gender: 'female',
  birthDate: '1985-03-15',
  phone: '9876543210'
};
familyTree.addMember(janeData, 'child', 1); // Jane Doe is a child of John Doe

// Update member information
const updatedInfo = {
  name: 'Jane Doe-Smith',
  phone: '9876543210'
};
familyTree.updateMember(2, updatedInfo); // Updates Jane Doe's name and phone number

// Display family tree
familyTree.displayFamilyTree(); // Displays the entire family tree

// Search members
const results = familyTree.searchMembers('Jane');
console.log('Search results:', results);

// Export to CSV
const csvData = familyTree.exportToCSV();
console.log('Exported CSV data:', csvData);

// Import from CSV
const csvImportData = `
  ID,Name,Gender,BirthDate,DeathDate,Parents,Children,Siblings,Spouse,Phone
  1,"John Doe",male,1980-01-01,,2,,,,1234567890
  2,"Jane Doe-Smith",female,1985-03-15,,,1,,1,9876543210
`;
familyTree.importFromCSV(csvImportData);
```

## Notes

- Ensure all data provided is valid according to the required format.
- Handle exceptions and errors appropriately when using methods.

---

Dokumentasi di atas memberikan gambaran lengkap tentang penggunaan `ADABsilsilah`, termasuk cara menginisialisasi, menambahkan anggota, mengelola relasi, mencari anggota, mengimpor/ mengekspor data, dan banyak lagi. Pastikan untuk memahami dan mengadaptasi sesuai dengan kebutuhan proyek Anda.
