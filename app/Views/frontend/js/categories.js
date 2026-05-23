async function loadCategories() {

    try {

        const res = await fetch("http://127.0.0.1:8000/categories");
        const categories = await res.json();

        const container = document.getElementById("categories-container");

       container.innerHTML = categories.map(cat => `
            <a href="/category/${cat.slug}" class="card"
            style="background-image: url('${cat.image || "/static/images/default.png"}');">
                
                <div class="card-overlay">
                    <span>${cat.icon || "📦"}</span>
                    <h3>${cat.name}</h3>
                </div>

            </a>
        `).join("");

    } catch (err) {
        console.error("Failed to load categories:", err);
    }
}

loadCategories();