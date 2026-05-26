const token = localStorage.getItem("access_token");   // ← was "token"
const role  = localStorage.getItem("role");

const navbar = `
<nav class="navbar">

    <button class="menu-toggle" id="menu-toggle">☰</button>

    <a href="../index.html" class="logo-link">
        <h1 class="logo">RETRO<span>WORLD</span></h1>
    </a>

    <ul id="nav-links">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../html/shop.html">Shop</a></li>
        <li><a href="../html/build-pc.html">Build PC</a></li>

        ${token ? `<li><a href="../html/profile.html">Profile</a></li>` : ""}

        ${token && role === "admin"
            ? `<li><a href="../admin/dashboard.html">Dashboard</a></li>`
            : ""}
    </ul>

    <div class="auth-btn">
        ${token
            ? `<button id="logout-btn">Logout</button>`
            : `<a href="../html/login.html">Login / Register</a>`
        }
    </div>

</nav>
`;

document.getElementById("navbar-container").innerHTML = navbar;

setTimeout(() => {
    const toggle    = document.getElementById("menu-toggle");
    const links     = document.getElementById("nav-links");
    const logoutBtn = document.getElementById("logout-btn");

    if (toggle && links) {
        toggle.addEventListener("click", () => {
            links.classList.toggle("active");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("access_token");   // ← was "token"
            localStorage.removeItem("refresh_token");  // ← new
            localStorage.removeItem("role");
            window.location.href = "../index.html";
        });
    }

}, 0);