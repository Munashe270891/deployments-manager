/**
 * FILE: admin.js
 * WHAT: Super Admin actions.
 * RULES:
 *  - Max 4 Super Admins. Block adding 5th.
 *  - Approve: Pending -> Approved (officer can now log in)
 *  - Reject: Pending -> Removed
 *  - Delete: Remove approved officer
 *  - Reset Password: Super Admin sets new password for officer who forgot
 * USED BY: admin.html only
 */
function approveOfficer(id) {
  const pending = JSON.parse(localStorage.getItem('pendingOfficers') || '[]');
  const approved = JSON.parse(localStorage.getItem('approvedOfficers') || '[]');
  const officer = pending.find(o => o.id === id);
  if (!officer) return;
  officer.status = 'Approved';
  approved.push(officer);
  localStorage.setItem('approvedOfficers', JSON.stringify(approved));
  localStorage.setItem('pendingOfficers', JSON.stringify(pending.filter(o => o.id !== id)));
  location.reload();
}
function rejectOfficer(id) {
  const pending = JSON.parse(localStorage.getItem('pendingOfficers') || '[]');
  localStorage.setItem('pendingOfficers', JSON.stringify(pending.filter(o => o.id !== id)));
  location.reload();
}
function deleteOfficer(id) {
  if (!confirm('Delete this deployment officer?')) return;
  const approved = JSON.parse(localStorage.getItem('approvedOfficers') || '[]');
  localStorage.setItem('approvedOfficers', JSON.stringify(approved.filter(o => o.id !== id)));
  location.reload();
}
function resetPassword(id, newPassword) {
  const approved = JSON.parse(localStorage.getItem('approvedOfficers') || '[]');
  const officer = approved.find(o => o.id === id);
  if (!officer) return;
  officer.password = newPassword; // In real app, hash this
  localStorage.setItem('approvedOfficers', JSON.stringify(approved));
  alert('Password reset for ' + officer.name);
}
function addSuperAdmin(newAdmin) {
  const admins = JSON.parse(localStorage.getItem('superAdmins') || '[]');
  if (admins.length >= 4) {
    alert('Maximum 4 Super Admins allowed. Cannot add more.');
    return false;
  }
  admins.push(newAdmin);
  localStorage.setItem('superAdmins', JSON.stringify(admins));
  return true;
  }
