const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth';

export async function login(username: string, password: string): Promise<any> {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function register(username: string, password: string): Promise<any> {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}
