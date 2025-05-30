import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

// ------------------------
// Autenticación
// ------------------------
export const registerUser = async (user: { username: string; password: string; }) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/register`, user);
  return response.data;
};

export const loginUser = async (credentials: { username: string; password: string; }) => {
  const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);
  return response.data;
};

// ------------------------
// Juegos
// ------------------------
export const getGameByType = async (type: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/games/${type}`);
  return response.data;
};

export const getGameDetail = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/games/detail/${id}`);
  return response.data;
};

export const addMove = async (gameId: string, move: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/games/${gameId}/move`, move, {
    headers: { "Content-Type": "text/plain" }
  });
  return response.data;
};

export const undoMove = async (gameId: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/games/${gameId}/undo`);
  return response.data;
};

export const getMoveHistory = async (gameId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/games/${gameId}/history`);
  return response.data;
};

export const submitScore = async (gameId: string, score: number) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/games/${gameId}/score`,
    score,
    { headers: { "Content-Type": "text/plain" } }
  );
  return response.data;
};

export const getGames = async () => {
  const url = `${API_BASE_URL}/api/games`;
  console.log("Llamando a:", url);
  const response = await axios.get(url);
  return response.data;
};


// ------------------------
// Usuarios
// ------------------------
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/users`);
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/users/${userId}`);
  return response.data;
};

export const updateUser = async (userId: string, data: { score: number; trainingRoute: string; }) => {
  const response = await axios.patch(`${API_BASE_URL}/api/users/${userId}`, data);
  return response.data;
};

// ------------------------
// Progreso del Usuario
// ------------------------
export const getUserProgress = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/progress/${userId}`);
  return response.data;
};
