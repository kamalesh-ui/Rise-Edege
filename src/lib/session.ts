const SESSION_KEY = 'rise_edge_session';

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getUserProfile() {
  const raw = localStorage.getItem('rise_edge_profile');
  if (!raw) return null;
  return JSON.parse(raw);
}

export function setUserProfile(profile: { skills: string; interests: string; education: string }) {
  localStorage.setItem('rise_edge_profile', JSON.stringify(profile));
}
