
window.onload = function () {
  checkLogin();
};

function checkLogin() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    updateProfileLink(user.role);
    hideLoginSignup();
  }
}

function updateProfileLink(role) {
  const profileLink = document.getElementById('profile-link');
  if (role === 'admin') {
    profileLink.href = 'AdminPage.html';
  } else {
    profileLink.href = 'userprofile.html';
  }
}

function hideLoginSignup() {
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.querySelector('a[href="signup.html"]');
  if (loginBtn) loginBtn.style.display = 'none';
  if (signupBtn) signupBtn.style.display = 'none';
}
