document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser")); // ✅ خليها تقرأ currentUser
  
    if (user.role !== "admin") {
      alert("Access denied. Only admins can view this page.");
      window.location.href = "login.html";
      return;
  }
  
    // Set name and email
    document.getElementById("adminName").innerText = user.username;
    document.getElementById("adminEmail").innerText = user.email;
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logoutBtn");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();
            logout();
        });
    }
});

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.querySelector('a[href="signup.html"]');
        const profileLink = document.getElementById('profile-link');

        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block';
        if (profileLink) profileLink.style.display = 'none';

        localStorage.removeItem("currentUser");

        alert("You have successfully logged out.");

        window.location.href = "login.html";
    }
}

