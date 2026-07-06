const NAV_LINKS = [
  { href: "index.html", label: "🏠 Home & How To Use" },
  { section: "The Kit" },
  { href: "budget-tracker.html", label: "💰 Budget Tracker" },
  { href: "packing-checklist.html", label: "🎒 Packing Checklist" },
  { href: "meal-planner.html", label: "🍎 Meal & Hydration Planner" },
  { href: "pre-comp-routine.html", label: "⏰ Pre-Competition Routine" },
  { href: "stress-reduction.html", label: "😌 Stress Reduction Log" },
  { href: "weekly-checklist.html", label: "✅ Weekly Checklist" },
  { href: "emergency-contact.html", label: "🏥 Emergency Contact Card" },
];

function renderNav(activeHref) {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const active = activeHref || current;
  let items = "";
  NAV_LINKS.forEach(link => {
    if (link.section) {
      items += `<div class="section-label">${link.section}</div>`;
    } else {
      const cls = link.href === active ? "active" : "";
      items += `<a href="${link.href}" class="${cls}">${link.label}</a>`;
    }
  });
  const nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.innerHTML = `
    <a href="index.html" class="brand">🥾 Survival Kit Hub</a>
    <div class="nav-menu-wrap">
      <button class="nav-menu-btn" id="navMenuBtn">☰ Menu</button>
      <div class="nav-dropdown" id="navDropdown">${items}</div>
    </div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  const btn = document.getElementById("navMenuBtn");
  const dd = document.getElementById("navDropdown");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    dd.classList.toggle("open");
  });
  document.addEventListener("click", () => dd.classList.remove("open"));
}

function saveField(key, value) {
  localStorage.setItem("survivalKit_" + key, value);
}
function loadField(key, fallback = "") {
  const v = localStorage.getItem("survivalKit_" + key);
  return v === null ? fallback : v;
}
function bindAutoSave(el, key) {
  el.value = loadField(key, el.value || "");
  el.addEventListener("input", () => saveField(key, el.value));
}
function bindAutoSaveCheckbox(el, key) {
  el.checked = loadField(key, el.checked ? "true" : "false") === "true";
  el.addEventListener("change", () => saveField(key, el.checked));
}
function flashSaved(msgEl) {
  if (!msgEl) return;
  msgEl.textContent = "✓ Saved to this browser";
  clearTimeout(msgEl._t);
  msgEl._t = setTimeout(() => { msgEl.textContent = "Changes save automatically in this browser."; }, 1500);
}
