// Utilitaires de stockage local pour l'application
// NOTE: Démo côté client uniquement. Pour production, utilisez un backend sécurisé.

const STORAGE_USERS_KEY = 'cn_users';
const STORAGE_CURRENT_KEY = 'cn_currentUser';

function getUsers(){
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e){
    console.error('Erreur lecture users', e);
    return [];
  }
}

function saveUsers(users){
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users || []));
}

function findUserByUsername(username){
  if (!username) return null;
  const users = getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

function setCurrentUser(username){
  localStorage.setItem(STORAGE_CURRENT_KEY, username);
}

function getCurrentUser(){
  return localStorage.getItem(STORAGE_CURRENT_KEY);
}

function clearCurrentUser(){
  localStorage.removeItem(STORAGE_CURRENT_KEY);
}

// Hachage SHA-256 (retourne hex) via SubtleCrypto
async function hashPassword(password){
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2,'0')).join('');
  return hashHex;
}

// expose functions globally for pages
window.getUsers = getUsers;
window.saveUsers = saveUsers;
window.findUserByUsername = findUserByUsername;
window.setCurrentUser = setCurrentUser;
window.getCurrentUser = getCurrentUser;
window.clearCurrentUser = clearCurrentUser;
window.hashPassword = hashPassword;
