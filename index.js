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

    // Only allow certain properties to be updated
    const allowedUpdates = ['name', 'gender', 'birthDate', 'deathDate', 'phone'];
    for (const key in updatedInfo) {
      if (allowedUpdates.includes(key)) {
        member[key] = updatedInfo[key];
      }
    }
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
}

export default ADABsilsilah;
