const THEMES = [
  { bg: "#4c1d95", stripe: "linear-gradient(90deg,#a855f7,#6d28d9,#a855f7)" },
  { bg: "#0d9488", stripe: "linear-gradient(90deg,#2dd4bf,#0d9488,#2dd4bf)" },
  { bg: "#1d4ed8", stripe: "linear-gradient(90deg,#60a5fa,#1d4ed8,#60a5fa)" },
  { bg: "#c2410c", stripe: "linear-gradient(90deg,#fb923c,#c2410c,#fb923c)" },
  { bg: "#0369a1", stripe: "linear-gradient(90deg,#38bdf8,#0369a1,#38bdf8)" },
  { bg: "#15803d", stripe: "linear-gradient(90deg,#4ade80,#15803d,#4ade80)" },
  { bg: "#b45309", stripe: "linear-gradient(90deg,#fcd34d,#b45309,#fcd34d)" },
  { bg: "#9333ea", stripe: "linear-gradient(90deg,#e879f9,#9333ea,#e879f9)" },
];

async function loadCategories() {
  try {
    const res = await apiFetch("http://127.0.0.1:8000/api/categories");
    if (!res.ok) throw new Error("Failed to fetch categories");

    const categories = await res.json();
    const container = document.getElementById("categories-container");
    if (!container) return;

    container.innerHTML = categories.map((cat, i) => {
      const theme = THEMES[i % THEMES.length];
      const imageUrl = (cat.image || "").replace("/upload/", "/upload/f_auto,q_auto/");
      const bgStyle = imageUrl
        ? `background-image: url('${imageUrl}'); background-color: ${theme.bg};`
        : `background-color: ${theme.bg};`;

      return `
        <a href="/category/${cat.slug}" class="card" style="${bgStyle}">
          <div class="card-stripe" style="background:${theme.stripe};"></div>
          <div class="card-label">
            <div class="card-label-icon">${cat.icon || "📦"}</div>
            <div class="card-label-name">${cat.name}</div>
          </div>
        </a>
      `;
    }).join("");

  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
}

loadCategories();