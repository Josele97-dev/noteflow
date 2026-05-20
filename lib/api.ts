import auth from '@react-native-firebase/auth';

const BASE_URL = 'https://noteflow-api.vercel.app/api';

async function getToken() {
  const user = auth().currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

async function authHeaders() {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function register(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Error al registrarse');
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Error al iniciar sesión');
  return res.json();
}

export async function logout() {}

export async function getNotes() {
  const res = await fetch(`${BASE_URL}/notes`, { headers: await authHeaders() });
  if (!res.ok) throw new Error('Error al cargar notas');
  return res.json();
}

export async function createNote(data: { title: string; content?: string }) {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear nota');
  return res.json();
}

export async function updateNote(id: string, data: { title?: string; content?: string; archived?: boolean }) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar nota');
  return res.json();
}

export async function deleteNote(id: string) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar nota');
}

export async function getIdeas() {
  const res = await fetch(`${BASE_URL}/ideas`, { headers: await authHeaders() });
  if (!res.ok) throw new Error('Error al cargar ideas');
  return res.json();
}

export async function createIdea(data: { title: string; content?: string; color?: string; tags?: string[] }) {
  const res = await fetch(`${BASE_URL}/ideas`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear idea');
  return res.json();
}

export async function updateIdea(id: string, data: { title?: string; content?: string; color?: string; archived?: boolean; tags?: string[] }) {
  const res = await fetch(`${BASE_URL}/ideas/${id}`, {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar idea');
  return res.json();
}

export async function deleteIdea(id: string) {
  const res = await fetch(`${BASE_URL}/ideas/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar idea');
}

export async function getChecklists() {
  const res = await fetch(`${BASE_URL}/checklists`, { headers: await authHeaders() });
  if (!res.ok) throw new Error('Error al cargar tareas');
  return res.json();
}

export async function createChecklist(data: { title: string; items?: { text: string; isCompleted?: boolean }[] }) {
  const res = await fetch(`${BASE_URL}/checklists`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear tarea');
  return res.json();
}

export async function updateChecklist(id: string, data: { title?: string; archived?: boolean; items?: { text: string; isCompleted?: boolean }[] }) {
  const res = await fetch(`${BASE_URL}/checklists/${id}`, {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar tarea');
  return res.json();
}

export async function deleteChecklist(id: string) {
  const res = await fetch(`${BASE_URL}/checklists/${id}`, {
    method: 'DELETE',
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
}