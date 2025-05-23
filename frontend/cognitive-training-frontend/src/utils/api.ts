// src/utils/api.ts
export async function fetchGamesByType(type: string): Promise<any[]> {
  const res = await fetch(`http://localhost:8080/api/games/${type}`);
  if (!res.ok) {
    throw new Error(`Error fetching games for type ${type}`);
  }
  
  // Obtén la respuesta como texto para comprobar si está vacío
  const text = await res.text();
  if (!text) {
    // Si no hay contenido, retornamos un arreglo vacío
    return [];
  }
  
  return JSON.parse(text);
}
