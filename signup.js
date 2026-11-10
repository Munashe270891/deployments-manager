/**
 * FILE: signup.js
 * WHAT: Handles signup form. Creates PENDING deployment officer.
 * WHY: New officer must NOT edit until Super Admin approves.
 * FLOW: Fill form -> Validate -> Save as Pending -> Show "Waiting for approval"
 * USED BY: signup.html only
 * FUTURE: Replace localStorage with real database. Do not change the flow.
 */

// For now we save to localStorage so UI works without backend.
// Later: change savePendingOfficer() to call AuthService.

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('fullName').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  const msg = document.getElementById('signupMsg');

  // 1. Simple checks
  if (password !== confirm) {
    msg.textContent = 'Passwords do not match.';
    msg.className = 'error';
    return;
  }
  if (password.length < 6) {
    msg.textContent = 'Password must be at least 6 characters.';
    msg.className = 'error';
    return;
  }

  // 2. Create PENDING officer - not Approved yet
  const newOfficer = {
    id: 'officer_' + Date.now(),
    name: name,
    phone: phone,
    email: email,
    password: password, // NOTE: In real app, hash this. Never save plain password.
    role: 'DeploymentOfficer',
    status: 'Pending', // Pending | Approved | Rejected
    createdAt: new Date().toISOString(),
    approvedBy: null
  };

  // 3. Save request for Super Admin to see
  const pending = JSON.parse(localStorage.getItem('pendingOfficers') || '[]');
  // Stop duplicate email
  if (pending.some(o => o.email === email)) {
    msg.textContent = 'This email already sent a request. Please wait for approval.';
    msg.className = 'error';
    return;
  }
  pending.push(newOfficer);
  localStorage.setItem('pendingOfficers', JSON.stringify(pending));

  // 4. Tell user to wait
  msg.textContent = 'Request sent to Super Admin. You will be able to log in after approval.';
  msg.className = 'success';
  document.getElementById('signupForm').reset();
});
