const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const navbar = `
<nav class="navbar">

     <button class="menu-toggle" id="menu-toggle">☰</button>

    <a href="/" class="logo-link">
        <h1 class="logo">RETRO<span>WORLD</span></h1>
    </a>

   

    <ul id="nav-links">

        <li><a href="/">Home</a></li>
        <li><a href="#">Shop</a></li>
        <li><a href="#">Build PC</a></li>

       ${token ? `<li><a href="/profile">Profile</a></li>` : ""}

        ${token && role === "admin" 
        ? `<li><a href="/dashboard">Dashboard</a></li>`
        : ""}
    </ul>

    <div class="auth-btn">

        ${
            token
            ? `<button id="logout-btn">Logout</button>`
            : `<a href="/login">Login / Register</a>`
        }

    </div>

</nav>
`;

document.getElementById("navbar-container").innerHTML = navbar;

/* wait for DOM injection */
setTimeout(() => {

    const toggle = document.getElementById("menu-toggle");
    const links = document.getElementById("nav-links");
    const logoutBtn = document.getElementById("logout-btn");

    if (toggle && links) {
        toggle.addEventListener("click", () => {
            links.classList.toggle("active");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/";
        });
    }

}, 0);