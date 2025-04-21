

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("verifyOtpForm");
    const otpInput = document.getElementById("otp");
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const enteredOTP = otpInput.value.trim();
        const storedOTP = localStorage.getItem('resetOTP');
        
        if (enteredOTP === storedOTP) {
            alert("OTP verified successfully! You can now reset your password.");
            window.location.href = "reset-password.html";
        } else {
            alert("Invalid OTP. Please try again.");
        }
    });
});