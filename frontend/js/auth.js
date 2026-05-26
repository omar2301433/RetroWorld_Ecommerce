const BASE_URL = "http://127.0.0.1:8000/api/auth";

console.log("AUTH JS LOADED");

/* ─── Token Helpers ───────────────────────────────── */

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

function getAccessToken() {
    return localStorage.getItem("access_token");
}

function getRefreshToken() {
    return localStorage.getItem("refresh_token");
}

function isLoggedIn() {
    return getAccessToken() !== null;
}

function getCurrentUser() {
    const token = getAccessToken();
    if (!token) return null;
    return parseJwt(token);
}

function isTokenExpired(token) {
    const payload = parseJwt(token);
    if (!payload?.exp) return true;
    // exp is in seconds, Date.now() is in ms
    return payload.exp * 1000 < Date.now();
}

/* ─── Auto Refresh ────────────────────────────────── */

async function refreshAccessToken() {
    const refresh_token = getRefreshToken();

    if (!refresh_token) {
        logout();
        return null;
    }

    try {
        const res = await fetch(`${BASE_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token })
        });

        if (!res.ok) {
            logout();
            return null;
        }

        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
        console.log("Access token refreshed successfully");
        return data.access_token;
        

    } catch {
        logout();
        return null;
    }
}

window.apiFetch = async function (url, options = {}) {
    let token = getAccessToken();

    if (token && isTokenExpired(token)) {
        token = await refreshAccessToken();
        if (!token) {
            logout();
            return null;
        }
        console.log("Access token was expired and has been refreshed");
    }

    let res = await fetch(url, {
        ...options,
        headers: {
            ...(options.body instanceof FormData
                ? {}
                : { "Content-Type": "application/json" }
            ),
            "Authorization": `Bearer ${token}`,
            ...options.headers
        }
    });

    if (res.status === 401) {
        token = await refreshAccessToken();
        if (!token) {
            logout();
            return null;
        }

        res = await fetch(url, {
            ...options,
            headers: {
                ...(options.body instanceof FormData
                    ? {}
                    : { "Content-Type": "application/json" }
                ),
                "Authorization": `Bearer ${token}`,
                ...options.headers
            }
        });
    }

    return res;
}

/* ─── Page Protection ─────────────────────────────── */

function protectPage() {
    if (!isLoggedIn()) {
        window.location.href = "../html/login.html";
    }
}

/* ─── Login ───────────────────────────────────────── */

async function login() {
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msgEl    = document.getElementById("message");

    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("access_token",  data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("role",          data.user.role);

            msgEl.innerText = "Login successful";
            window.location.href = "../index.html";
        } else if (res.status === 422) {
            msgEl.innerText = "Please fill in all fields correctly";
        } else {
            msgEl.innerText = data.detail || "Login failed";
        }

    } catch {
        msgEl.innerText = "Server error — please try again";
    }
}

/* ─── Register ────────────────────────────────────── */

async function register() {
    const username = document.getElementById("username").value.trim();
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msgEl    = document.getElementById("message");

    try {
        const res = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            msgEl.innerText = "Registration successful — redirecting...";
            window.location.href = "../html/login.html";
        } else if (res.status === 422) {
            msgEl.innerText = "Please fill in all fields correctly";
        } else {
            msgEl.innerText = data.detail || "Registration failed";
        }

    } catch {
        msgEl.innerText = "Server error — please try again";
    }
}

/* ─── Logout ──────────────────────────────────────── */

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    window.location.href = "../index.html";
}