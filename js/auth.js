document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (token) {
        // Decode JWT to check expiration
        const tokenPayload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
        const expTime = tokenPayload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (currentTime >= expTime) {
            localStorage.removeItem("token"); // Remove expired token
            alert("Session expired! Please log in again.");
            return;
        }

        // Redirect if the token is still valid
        window.location.href = "executive-dashboard.html";
    }
});

// Login Form Handling
document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://hitbackend.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");
            window.location.href = "executive-dashboard.html";
        } else {
            document.getElementById("error-message").innerText = data.message;
        }
    } catch (error) {
        console.error("Login error:", error);
    }
});
