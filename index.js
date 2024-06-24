import i18next from 'i18next';
import * as d3 from 'd3';

i18next.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'memberMustHave': 'Member must have id, name, gender, and birthDate',
        'memberExists': 'Member with ID {{id}} already exists',
        'invalidPhoneNumber': 'Phone number {{phone}} is invalid. It should be 10 to 15 digits.',
        'invalidDate': 'Date {{date}} is invalid. It should be in the format YYYY-MM-DD.',
        'relativeNotFound': 'Relative with ID {{id}} not found',
        'unsupportedRelationship': 'Unsupported relationship type: {{relationship}}',
        'memberNotFound': 'Member with ID {{id}} not found',
      }
    },
    id: {
      translation: {
        'memberMustHave': 'Anggota harus memiliki id, nama, jenis kelamin, dan tanggal lahir',
        'memberExists': 'Anggota dengan ID {{id}} sudah ada',
        'invalidPhoneNumber': 'Nomor telepon {{phone}} tidak valid. Harus terdiri dari 10 hingga 15 digit.',
        'invalidDate': 'Tanggal {{date}} tidak valid. Harus dalam format YYYY-MM-DD.',
        'relativeNotFound': 'Kerabat dengan ID {{id}} tidak ditemukan',
        'unsupportedRelationship': 'Jenis hubungan tidak didukung: {{relationship}}',
        'memberNotFound': 'Anggota dengan ID {{id}} tidak ditemukan',
      }
    }
    // Tambahkan bahasa lain di sini
  }
});

class FamilyTreeError extends Error {
  constructor(message, data) {
    super(message);
    this.data = data;
    this.name = 'FamilyTreeError';
  }
}

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
    this.events = []; // Array untuk menyimpan kejadian khusus
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

  recursiveUpdate(updatedInfo) {
    const allowedUpdates = ['name', 'gender', 'birthDate', 'deathDate', 'phone'];
    for (const key in updatedInfo) {
      if (allowedUpdates.includes(key)) {
        this[key] = updatedInfo[key];
      }
    }

    this.children.forEach(child => child.recursiveUpdate(updatedInfo));
    this.siblings.forEach(sibling => sibling.recursiveUpdate(updatedInfo));
    if (this.spouse) {
      this.spouse.recursiveUpdate(updatedInfo);
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
      throw new FamilyTreeError(i18next.t('memberMustHave'));
    }
    if (this.members.has(member.id)) {
      throw new FamilyTreeError(i18next.t('memberExists', { id: member.id }));
    }
    if (member.phone && !/^\d{10,15}$/.test(member.phone)) {
      throw new FamilyTreeError(i18next.t('invalidPhoneNumber', { phone: member.phone }));
    }
  }

  validateDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      throw new FamilyTreeError(i18next.t('invalidDate', { date: dateString }));
    }
  }

  addMember(member, relationship, relativeId) {
    this.validateMember(member);
    this.validateDate(member.birthDate);
    if (member.deathDate) {
      this.validateDate(member.deathDate);
    }
    const relative = this.findMember(relativeId);
    if (!relative) {
      throw new FamilyTreeError(i18next.t('relativeNotFound', { id: relativeId }));
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
        throw new FamilyTreeError(i18next.t('unsupportedRelationship', { relationship }));
    }
  }

  removeMember(memberId) {
    const member = this.findMember(memberId);
    if (!member) {
      throw new FamilyTreeError(i18next.t('memberNotFound', { id: memberId }));
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
      throw new FamilyTreeError(i18next.t('memberNotFound', { id: memberId }));
    }

    if (updatedInfo.birthDate) {
      this.validateDate(updatedInfo.birthDate);
    }
    if (updatedInfo.deathDate) {
      this.validateDate(updatedInfo.deathDate);
    }
    if (updatedInfo.phone && !/^\d{10,15}$/.test(updatedInfo.phone)) {
      throw new FamilyTreeError(i18next.t('invalidPhoneNumber', { phone: updatedInfo.phone }));
    }

    member.recursiveUpdate(updatedInfo);
  }

  addEvent(memberId, event) {
    const member = this.findMember(memberId);
    if (!member) {
      throw new FamilyTreeError(i18next.t('memberNotFound', { id: memberId }));
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

  displayFamilyTreeD3() {
    const data = Array.from(this.members.values());
    const root = d3.stratify()
      .id(d => d.id)
      .parentId(d => d.parents[0])(data);

    const treeLayout = d3.tree();
    treeLayout.size([400, 200]);

    const treeData = treeLayout(root);

    const svg = d3.select('svg');
    const nodes = svg.append('g')
      .selectAll('circle')
      .data(treeData.descendants())
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 5);
  }

  searchMembers(query) {
    const results = [];
    for (const member of this.members.values()) {
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

  backupToJSON() {
    return JSON.stringify(Array.from(this.members.entries()), null, 2);
  }

  restoreFromJSON(jsonData) {
    const data = JSON.parse(jsonData);
    this.members = new Map(data.map(([id, memberData]) => [id, new FamilyMember(memberData)]));
  }

  async fetchDataFromAPI(apiEndpoint) {
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      data.forEach(member => {
        this.addMember(member, 'root', null); // Assume API gives members without needing relationships
      });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }

  sendNotification(event, recipientPhone) {
    // Placeholder for actual notification logic, e.g., via SMS or email
    console.log(`Sending notification about ${event} to ${recipientPhone}`);
  }

  addReminder(memberId, event) {
    const member = this.findMember(memberId);
    if (!member) {
      throw new FamilyTreeError(i18next.t('memberNotFound', { id: memberId }));
    }

    // Assume we have a function to schedule reminders
    this.scheduleReminder(() => {
      this.sendNotification(event, member.phone);
    }, event.date); // Placeholder for date logic
  }

  scheduleReminder(callback, date) {
    // Placeholder for actual scheduling logic
    const delay = new Date(date) - new Date();
    setTimeout(callback, delay);
  }
}

export default ADABsilsilah;


  
