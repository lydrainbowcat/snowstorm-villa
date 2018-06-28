const ROLES = [
  {
    name: "guide",
    title: "导游",
    methods: ["blade", "bludgeon"],
    clews: ["woman_foot", "woman_hand", "snack", "smartphone", "hat", "hanging", "earring"]
  },
  {
    name: "propsman",
    title: "道具师",
    methods: ["blade", "bludgeon", "strangle", "shoot", "trap", "poison"],
    clews: ["man_foot", "man_hand", "woman_foot", "woman_hand", "soil", "smell", "snack", "smartphone", "phone", "cloth", "glove", "glassed", "gun", "hat", "hanging", "earring", "watch"]
  },
  {
    name: "forensic_doctor",
    title: "法医",
    methods: ["blade", "bludgeon", "strangle", "poison"],
    clews: ["man_foot", "smell", "smartphone", "glove", "glassed", "hat", "watch"]
  },
  {
    name: "high_school_student",
    title: "高中生",
    methods: ["blade", "bludgeon"],
    clews: ["woman_foot", "woman_hand", "snack", "smartphone", "glassed", "hanging", "earring"]
  },
  {
    name: "manager",
    title: "管理员",
    methods: ["blade", "bludgeon", "strangle", "trap", "poison"],
    clews: ["man_foot", "soil", "snack", "smartphone", "glove", "hat", "watch"]
  },
  {
    name: "coach",
    title: "教练",
    methods: ["blade", "bludgeon", "strangle"],
    clews: ["man_foot", "man_hand", "phone", "cloth", "glassed", "hanging", "watch"]
  },
  {
    name: "police_woman",
    title: "警察",
    methods: ["blade", "bludgeon", "strangle", "shoot"],
    clews: ["woman_foot", "phone", "cloth", "glove", "gun", "hat", "watch"]
  },
  {
    name: "soldier",
    title: "军人",
    methods: ["blade", "bludgeon", "strangle", "shoot"],
    clews: ["man_foot", "man_hand", "phone", "cloth", "gun", "hat", "watch"]
  },
  {
    name: "hunter",
    title: "猎人",
    methods: ["blade", "shoot", "trap"],
    clews: ["woman_foot", "woman_hand", "soil", "smell", "phone", "cloth", "gun"]
  },
  {
    name: "conjurator",
    title: "灵媒",
    methods: ["blade", "bludgeon"],
    clews: ["woman_foot", "woman_hand", "snack", "smartphone", "cloth", "hanging", "earring"]
  },
  {
    name: "male_tourist",
    title: "男驴友",
    methods: ["blade", "strangle", "trap"],
    clews: ["man_foot", "man_hand", "soil", "smartphone", "cloth", "hat", "watch"]
  },
  {
    name: "male_doctor",
    title: "男医生",
    methods: ["blade", "bludgeon", "strangle", "poison"],
    clews: ["man_foot", "man_hand", "snack", "phone", "glassed", "hat", "watch"]
  },
  {
    name: "female_tourist",
    title: "女驴友",
    methods: ["blade", "bludgeon", "trap"],
    clews: ["woman_foot", "woman_hand", "soil", "smartphone", "cloth", "hat", "earring"]
  },
  {
    name: "female_doctor",
    title: "女医生",
    methods: ["blade", "bludgeon", "poison"],
    clews: ["woman_foot", "smell", "snack", "smartphone", "glove", "hanging", "watch"]
  },
  {
    name: "misterious_man",
    title: "神秘人",
    methods: ["blade", "bludgeon", "strangle", "shoot", "trap", "poison"],
    clews: ["man_foot", "smartphone", "cloth", "glove", "glassed", "gun", "hat"]
  },
  {
    name: "twins",
    title: "双胞胎",
    methods: ["blade", "bludgeon"],
    clews: ["woman_foot", "woman_hand", "smartphone", "phone", "cloth", "glassed", "hanging"]
  },
  {
    name: "student",
    title: "学生",
    methods: ["bludgeon", "trap"],
    clews: ["man_foot", "man_hand", "smartphone", "glassed", "hat", "hanging", "watch"]
  },
  {
    name: "detective",
    title: "侦探",
    methods: ["trap", "poison"],
    clews: ["snack", "phone", "glove", "glassed", "hat", "hanging", "watch"]
  },
  {
    name: "writer",
    title: "作家",
    methods: ["blade", "bludgeon"],
    clews: ["man_foot", "man_hand", "smartphone", "cloth", "glassed", "hat", "hanging"]
  }
];

export default ROLES;
