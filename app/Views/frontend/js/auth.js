const BASE_URL = "http://127.0.0.1:8000";

console.log("AUTH JS LOADED");

function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}



function protectPage() {

    if (!isLoggedIn()) {
        window.location.href = "/login";
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("token", data.access_token);
            document.getElementById("message").innerText = "Login successful";

            window.location.href = "/"; 
        } else if (response.status === 422) {
            document.getElementById("message").innerText = "Invalid email or password";
        } else {
            document.getElementById("message").innerText = data.detail;
        }

    } catch (error) {
        console.log(error);
        document.getElementById("message").innerText = "Server error";
    }
}

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value;
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username ,email, password })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("message").innerText = "Registration successful";
             window.location.href = "/login"; // Redirect to login page
        } else if (response.status === 422) {
            document.getElementById("message").innerText = "Invalid email or password";
        } else {
            document.getElementById("message").innerText = data.detail;
        }

    } catch (error) {
        console.log(error);
        document.getElementById("message").innerText = "Server error";
    }
}



function logout() {

    localStorage.removeItem("token");

    window.location.href = "/";
}


function parseJwt(token) {

    try {

        return JSON.parse(atob(token.split('.')[1]));

    } catch (error) {

        return null;
    }
}


function getCurrentUser() {

    const token = localStorage.getItem("token");

    if (!token) return null;

    return parseJwt(token);
}



