document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Stop form from submitting

        // Get values
        const username = form.querySelector('input[placeholder="User Name"]').value.trim();
        const email = form.querySelector('input[placeholder="Email"]').value.trim();
        const password = form.querySelector('input[placeholder="Enter a strong password"]').value;
        const confirmPassword = form.querySelector('input[placeholder="Confirm password"]').value;
        const role = form.querySelector('input[name="rule"]:checked').value;

        // Validations
        if (password.length < 6) {
            alert("Password should be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Store data in localStorage 
        const user = {
            username,
            email,
            password, 
            role
        };

        // Save user data
        localStorage.setItem("user", JSON.stringify(user)); //stringify converts the  javascript object to a string

        // Redirect to login
        alert("Account created! Redirecting to login...");
        window.location.href = "login.html"; // Change this to your login page URL



        








    });
   
});
