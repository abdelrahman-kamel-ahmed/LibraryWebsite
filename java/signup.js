document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = form.querySelector('input[placeholder="User Name"]').value.trim();
        const email = form.querySelector('input[placeholder="Email"]').value.trim();
        const password = form.querySelector('input[placeholder="Enter a strong password"]').value;
        const confirmPassword = form.querySelector('input[placeholder="Confirm password"]').value;
        const role = form.querySelector('input[name="rule"]:checked').value;

        if (password.length < 6) {
            alert("Password should be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const user = {
            username,
            email,
            password,
            role,
            borrowedBooks: [] // ⭐ كل يوزر معاه لسته فاضية في الاول
        };

        const users = JSON.parse(localStorage.getItem("users")) || [];
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created! Redirecting to login...");
        window.location.href = "login.html";
    });
});

