document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            alert("Invalid username or password. Please try again.");
            return;
        }

        alert("Login successful!");

        localStorage.setItem("currentUser", JSON.stringify(user));

        if (user.role === "admin") {
            window.location.href = "AdminPage.html";
        } else {
            window.location.href = "userprofile.html";
        }
    });
});
