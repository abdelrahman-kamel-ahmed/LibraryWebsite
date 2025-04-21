document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("forgotPasswordForm");
    const emailInput = document.getElementById("email");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // Store the OTP and email in localStorage temporarily
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('resetOTP', otp.toString());
        
        
        
        alert(`An OTP has been sent to ${email}.`);
        alert(`OTP for ${email}: ${otp}`);
        
        // Redirect to OTP verification page
        window.location.href = "verify-otp.html";
    });
});