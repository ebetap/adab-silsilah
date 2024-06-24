class FamilyMember {
  constructor({ id, name, gender, birthDate, deathDate = null, parents = [], children = [], siblings = [], spouse = null, phone = null }) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
    this.deathDate = deathDate;
    this.parents = parents;
    this.children = children;
    this.siblings = siblings;
    this.spouse = spouse;
    this.phone = phone;
    this.events = [];
  }

  addChild(child) {
    if (!this.children) this.children = [];
    this.children.push(new FamilyMember(child));
  }

  addSibling(sibling) {
    if (!this.siblings) this.siblings = [];
    this.siblings.push(new FamilyMember(sibling));
  }

  addSpouse(spouse) {
    this.spouse = new FamilyMember(spouse);
  }

  addEvent(event) {
    this.events.push(event);
  }

  // Additional method for updating member information recursively
  recursiveUpdate(updatedInfo) {
    for (const key in updatedInfo) {
      if (updatedInfo.hasOwnProperty(key)) {
        this[key] = updatedInfo[key];
      }
    }

    if (this.children) {
      this.children.forEach(child => {
        child.recursiveUpdate({ parents: [this.id] });
      });
    }

    if (this.siblings) {
      this.siblings.forEach(sibling => {
        sibling.siblings = sibling.siblings.map(sib => sib.id === this.id ? this.id : sib.id);
        sibling.recursiveUpdate({ siblings: sibling.siblings });
      });
    }
  }
}

class ADABsilsilah {
  constructor(rootMember) {
    this.root = new FamilyMember(rootMember);
    this.members = new Map();
    this.members.set(rootMember.id, this.root);
  }

  findMember(memberId) {
    return this.members.get(memberId) || null;
  }

  validateMember(member) {
    if (!member.id || !member.name || !member.gender || !member.birthDate) {
      throw new Error('Member must have id, name, gender, and birthDate');
    }
    if (this.members.has(member.id)) {
      throw new Error(`Member with ID ${member.id} already exists`);
    }
    if (member.phone && !/^\d{10,15}$/.test(member.phone)) {
      throw new Error(`Phone number ${member.phone} is invalid. It should be 10 to 15 digits.`);
    }
    // Additional validation for date format
    this.validateDate(member.birthDate);
    if (member.deathDate) {
      this.validateDate(member.deathDate);
    }
  }

  validateDate(dateString) {
    if (!moment(dateString, 'YYYY-MM-DD', true).isValid()) {
      throw new Error(`Invalid date format for ${dateString}. Should be in YYYY-MM-DD format.`);
    }
  }

  addMember(member, relationship, relativeId) {
    this.validateMember(member);
    const relative = this.findMember(relativeId);
    if (!relative) {
      throw new Error(`Relative with ID ${relativeId} not found`);
    }

    const newMember = new FamilyMember(member);
    this.members.set(newMember.id, newMember);

    switch (relationship) {
      case "child":
        relative.addChild(member);
        break;
      case "sibling":
        relative.addSibling(member);
        break;
      case "spouse":
        relative.addSpouse(member);
        break;
      default:
        throw new Error(`Unsupported relationship type: ${relationship}`);
    }
  }

  removeMember(memberId) {
    const member = this.findMember(memberId);
    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`);
    }

    member.parents.forEach(parentId => {
      const parent = this.findMember(parentId);
      if (parent) {
        parent.children = parent.children.filter(child => child.id !== memberId);
      }
    });

    member.siblings.forEach(siblingId => {
      const sibling = this.findMember(siblingId);
      if (sibling) {
        sibling.siblings = sibling.siblings.filter(sibling => sibling.id !== memberId);
      }
    });

    if (member.spouse) {
      const spouse = this.findMember(member.spouse.id);
      if (spouse) {
        spouse.spouse = null;
      }
    }

    this.members.delete(memberId);
  }

  updateMember(memberId, updatedInfo) {
    const member = this.findMember(memberId);
    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`);
    }

    // Ensure phone validation
    if (updatedInfo.phone && !/^\d{10,15}$/.test(updatedInfo.phone)) {
      throw new Error(`Phone number ${updatedInfo.phone} is invalid. It should be 10 to 15 digits.`);
    }

    // Validate date format if updating birthDate or deathDate
    if (updatedInfo.birthDate) {
      this.validateDate(updatedInfo.birthDate);
    }
    if (updatedInfo.deathDate) {
      this.validateDate(updatedInfo.deathDate);
    }

    // Only allow certain properties to be updated
    const allowedUpdates = ['name', 'gender', 'birthDate', 'deathDate', 'phone'];
    for (const key in updatedInfo) {
      if (allowedUpdates.includes(key)) {
        member[key] = updatedInfo[key];
      }
    }

    // Update recursively if needed
    member.recursiveUpdate(updatedInfo);
  }

  addEvent(memberId, event) {
    const member = this.findMember(memberId);
    if (!member) {
      throw new Error(`Member with ID ${memberId} not found`);
    }

    member.addEvent(event);
  }

  toJson() {
    const membersArray = Array.from(this.members.values());
    return JSON.stringify(membersArray, null, 2);
  }

  displayFamilyTree(member = this.root, indent = "") {
    console.log(indent + member.name + (member.phone ? ` (Phone: ${member.phone})` : ""));
    if (member.spouse) {
      console.log(indent + "  Spouse: " + member.spouse.name + (member.spouse.phone ? ` (Phone: ${member.spouse.phone})` : ""));
    }
    if (member.children) {
      for (let child of member.children) {
        this.displayFamilyTree(child, indent + "  ");
      }
    }
  }

  searchMembers(query) {
    const results = [];
    for (const member of this.members.values()) {
      // Implementasi pencarian berdasarkan nama atau jenis kelamin
      if (member.name.toLowerCase().includes(query.toLowerCase()) || member.gender.toLowerCase() === query.toLowerCase()) {
        results.push(member);
      }
    }
    return results;
  }

  exportToCSV() {
    let csv = "ID,Name,Gender,BirthDate,DeathDate,Parents,Children,Siblings,Spouse,Phone\n";
    for (const member of this.members.values()) {
      csv += `${member.id},"${member.name}",${member.gender},${member.birthDate},${member.deathDate || ""},${member.parents.join(';') || ""},${member.children.map(child => child.id).join(';') || ""},${member.siblings.map(sibling => sibling.id).join(';') || ""},${member.spouse ? member.spouse.id : ""},${member.phone || ""}\n`;
    }
    return csv;
  }

  importFromCSV(csvData) {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    const membersData = lines.slice(1);

    membersData.forEach(memberData => {
      const data = memberData.split(',');
      const member = {
        id: parseInt(data[0]),
        name: data[1].replace(/"/g, ''),
        gender: data[2],
        birthDate: data[3],
        deathDate: data[4] || null,
        parents: data[5] ? data[5].split(';').map(id => parseInt(id)) : [],
        children: data[6] ? data[6].split(';').map(id => parseInt(id)) : [],
        siblings: data[7] ? data[7].split(';').map(id => parseInt(id)) : [],
        spouse: data[8] ? parseInt(data[8]) : null,
        phone: data[9] || null
      };
      this.members.set(member.id, new FamilyMember(member));
    });
  }
}

export default ADABsilsilah;
