document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("resetPasswordForm");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            alert("Passwords don't match. Please try again.");
            return;
        }
        
        // Check password length
        if (newPassword.length < 10) {
            alert("Password must be at least 10 characters long.");
            return;
        }
        
        // Get the email from localStorage
        const email = localStorage.getItem('resetEmail');
        
        // Get user data from localStorage
        let userData = JSON.parse(localStorage.getItem("user"));
        
        if (userData && userData.email === email) {
            // Update the password
            userData.password = newPassword;
            localStorage.setItem("user", JSON.stringify(userData));
            
            alert("Password reset successfully! You can now login with your new password.");
            window.location.href = "login.html";
        } else {
            alert("Error updating password. Please try the password reset process again.");
        }
        
        // Clean up
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetOTP');
    });
});