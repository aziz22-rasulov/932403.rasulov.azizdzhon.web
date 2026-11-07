const STORAGE_SKILLS_KEY = "travelSkills";
const STORAGE_THEME_KEY = "travelTheme";
const DEFAULT_SKILLS = [
  "Знание иностранных языков",
  "Умение ориентироваться по карте",
  "Навыки выживания в дикой природе"
];

function findElement(id) {
  const element = document.getElementById(id);
  if (element === null) {
    console.log(`Элемент не найден: #${id}`);
  }
  return element;
}

function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.log(`Не удалось прочитать localStorage: ${key}`);
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.log(`Не удалось записать в localStorage: ${key}`);
  }
}

function loadSavedSkills() {
  const raw = readStorage(STORAGE_SKILLS_KEY);
  if (raw === null) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string");
    }
  } catch (error) {
    console.log("Сохранённые навыки повреждены");
  }
  return null;
}

function saveSkills() {
  const list = findElement("skillsList");
  if (!list) {
    return;
  }
  const names = [];
  for (const label of list.querySelectorAll(".skill-text")) {
    names.push(label.textContent);
  }
  writeStorage(STORAGE_SKILLS_KEY, JSON.stringify(names));
}

function createSkillItem(name) {
  const item = document.createElement("li");
  item.className = "skill-item";

  const label = document.createElement("span");
  label.className = "skill-text";
  label.textContent = name;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-btn";
  removeButton.textContent = "Удалить";
  removeButton.setAttribute("aria-label", `Удалить навык: ${name}`);
  removeButton.addEventListener("click", () => {
    item.remove();
    saveSkills();
  });

  item.appendChild(label);
  item.appendChild(removeButton);
  return item;
}

function renderSkills(names) {
  const list = findElement("skillsList");
  if (!list) {
    return;
  }
  list.replaceChildren();
  for (const name of names) {
    list.appendChild(createSkillItem(name));
  }
}

function addSkill() {
  const list = findElement("skillsList");
  if (!list) {
    return;
  }
  const answer = prompt("Введите название навыка:");
  if (answer === null) {
    return;
  }
  const name = answer.trim();
  if (name === "") {
    alert("Название навыка не может быть пустым");
    return;
  }
  list.appendChild(createSkillItem(name));
  saveSkills();
}

function clearSkills() {
  const list = findElement("skillsList");
  if (!list) {
    return;
  }
  const items = list.querySelectorAll("li");
  if (items.length === 0) {
    alert("Навыки уже удалены");
    return;
  }
  for (const item of items) {
    item.remove();
  }
  saveSkills();
}

function applyTheme(isDark) {
  const body = document.querySelector("body");
  if (!body) {
    console.log("Элемент не найден: body");
    return false;
  }
  const button = findElement("toggleThemeBtn");
  if (!button) {
    return false;
  }
  body.classList.toggle("dark", isDark);
  button.textContent = isDark ? "Светлая тема" : "Тёмная тема";
  button.setAttribute("aria-pressed", String(isDark));
  return true;
}

function toggleTheme() {
  const body = document.querySelector("body");
  if (!body) {
    console.log("Элемент не найден: body");
    return;
  }
  const isDark = !body.classList.contains("dark");
  if (applyTheme(isDark)) {
    writeStorage(STORAGE_THEME_KEY, isDark ? "dark" : "light");
  }
}

function toggleSkillsVisibility() {
  const block = findElement("skillsBlock");
  if (!block) {
    return;
  }
  const button = findElement("toggleSkillsBtn");
  if (!button) {
    return;
  }
  const isHidden = block.classList.toggle("invisible");
  button.textContent = isHidden ? "Показать список навыков" : "Скрыть список навыков";
  button.setAttribute("aria-expanded", String(!isHidden));
}

function initSkillManager() {
  const list = findElement("skillsList");
  if (!list) {
    return;
  }
  const addButton = findElement("addSkillBtn");
  if (!addButton) {
    return;
  }
  const clearButton = findElement("clearSkillsBtn");
  if (!clearButton) {
    return;
  }
  const visibilityButton = findElement("toggleSkillsBtn");
  if (!visibilityButton) {
    return;
  }
  const themeButton = findElement("toggleThemeBtn");
  if (!themeButton) {
    return;
  }

  const savedSkills = loadSavedSkills();
  renderSkills(savedSkills !== null ? savedSkills : DEFAULT_SKILLS);
  applyTheme(readStorage(STORAGE_THEME_KEY) === "dark");

  addButton.addEventListener("click", addSkill);
  clearButton.addEventListener("click", clearSkills);
  visibilityButton.addEventListener("click", toggleSkillsVisibility);
  themeButton.addEventListener("click", toggleTheme);
}

initSkillManager();
