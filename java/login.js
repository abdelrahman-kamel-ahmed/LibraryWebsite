document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent form from submitting

        // Get the entered values
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Get user data from localStorage
        const userData = JSON.parse(localStorage.getItem("user"));

        if (!userData) {
            alert("No user data found. Please sign up first.");
            return;
        }

        if (username === userData.username && password === userData.password) {
            alert("Login successful!");

            // Check which radio button is selected
            const isAdmin = document.querySelector('input[value="admin"]').checked;

            if (isAdmin) {
                window.location.href = "AdminPage.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert("Invalid username or password. Please try again.");
        }
    });
});
