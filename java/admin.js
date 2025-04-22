document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user || user.role !== "admin") {
      alert("Access denied. Only admins can view this page.");
      window.location.href = "login.html";
      return;
    }
  
    // Set name and email
    document.getElementById("adminName").innerText = user.username;
    document.getElementById("adminEmail").innerText = user.email;
  });
  
  function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }