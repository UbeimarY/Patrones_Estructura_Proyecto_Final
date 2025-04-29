// src/utils/api.ts
const API_URL = 'http://localhost:8080/api/games';

export async function fetchGamesByType(type: string) {
  const response = await fetch(`${API_URL}/${type}`);
  return response.json();
}
