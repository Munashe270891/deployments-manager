/**
 * FILE: auth.js
 * WHAT: Checks who is signed in. Shows Login button or Officer name.
 * RULE: Only Approved officers can edit. Pending = cannot log in.
 * USED BY: Every page - index.html, parade.html, checkin.html, etc.
 */
function getCurrentOfficer() {
  return JSON.parse(localStorage.getItem('currentOfficer') || 'null');
}

function isLoggedIn() {
  return !!getCurrentOfficer();
}

// On login page only
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const loginId = document.getElementById('loginId').value.trim();
    const password = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMsg');

    // 1. Check Super Admins first (they are always approved)
    const admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
    const admin = admins.find(a => (a.email === loginId || a.phone === loginId) && a.password === password);
    if (admin) {
      localStorage.setItem('currentOfficer', JSON.stringify({ ...admin, isSuperAdmin: true }));
      window.location.href = 'admin.html';
      return;
    }

    // 2. Check approved deployment officers
    const approved = JSON.parse(localStorage.getItem('approvedOfficers') || '[]');
    const officer = approved.find(o => (o.email === loginId || o.phone === loginId) && o.password === password);

    if (!officer) {
      // Check if still pending
      const pending = JSON.parse(localStorage.getItem('pendingOfficers') || '[]');
      const isPending = pending.find(o => o.email === loginId || o.phone === loginId);
      if (isPending) {
        msg.textContent = 'Your account is still waiting for Super Admin approval.';
      } else {
        msg.textContent = 'Wrong credentials or account not found.';
      }
      return;
    }

    localStorage.setItem('currentOfficer', JSON.stringify({ ...officer, isSuperAdmin: false }));
    window.location.href = 'index.html';
  });
}

// On home page: update topbar
const authArea = document.getElementById('authArea');
if (authArea) {
  const user = getCurrentOfficer();
  if (user) {
    authArea.innerHTML = `
      <span>Hi, ${user.name} ${user.isSuperAdmin ? '(Super Admin)' : ''}</span>
      ${user.isSuperAdmin ? '<a href="admin.html" class="btn">Admin</a>' : ''}
      <button class="btn" onclick="logout()">Log Out</button>
    `;
    const notice = document.getElementById('loginNotice');
    if (notice) notice.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('currentOfficer');
  window.location.href = 'index.html';
}

// Block edit buttons if not logged in
document.querySelectorAll('[data-need-login]').forEach(btn => {
  if (!isLoggedIn()) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Please log in as a deployment officer to edit.');
      window.location.href = 'login.html';
    });
  }
});
