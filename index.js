class FamilyMember {
  constructor({ id, name, gender, birthDate, deathDate = null, parents = [], children = [], siblings = [], spouse = null }) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.birthDate = birthDate;
    this.deathDate = deathDate;
    this.parents = parents;
    this.children = children;
    this.siblings = siblings;
    this.spouse = spouse;
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
  }

  findMember(memberId, currentMember = this.root) {
    if (currentMember.id === memberId) {
      return currentMember;
    }
    if (currentMember.children) {
      for (let child of currentMember.children) {
        let result = this.findMember(memberId, child);
        if (result) return result;
      }
    }
    return null;
  }

  addMember(member, relationship, relativeId) {
    const relative = this.findMember(relativeId);
    if (!relative) {
      throw new Error(`Relative with ID ${relativeId} not found`);
    }

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

  displayFamilyTree(member = this.root, indent = "") {
    console.log(indent + member.name);
    if (member.spouse) {
      console.log(indent + "  Spouse: " + member.spouse.name);
    }
    if (member.children) {
      for (let child of member.children) {
        this.displayFamilyTree(child, indent + "  ");
      }
    }
  }
}

export default ADABsilsilah;
