import axios from 'axios';

// Función para obtener el token actual desde localStorage o el store
function getCurrentToken() {
  try {
    // Primero intentar leer desde localStorage (más confiable)
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    if (auth?.token) {
      return auth.token;
    }
    
    // Fallback: si el store está disponible, intentar leer desde ahí
    // Nota: Esto es opcional ya que el store se persiste en localStorage
    return '';
  } catch (error) {
    console.error('Error al leer el token desde localStorage:', error);
    return '';
  }
}

// Obtener el token inicial al cargar el módulo
const initialToken = getCurrentToken();

export const apiClient = axios.create({
    baseURL: 'https://repfora-ep-backend.onrender.com/api',
    headers: {
        "x-token": initialToken
    }
});

// Interceptor para actualizar el token antes de cada petición
apiClient.interceptors.request.use(
  (config) => {
    // Obtener el token más reciente antes de cada petición
    const currentToken = getCurrentToken();
    
    // Actualizar el header con el token actual
    if (currentToken) {
      config.headers['x-token'] = currentToken;
    } else {
      // Si no hay token, eliminar el header para evitar enviar un token vacío
      delete config.headers['x-token'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error (opcional, pero útil)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el error es 401 (no autorizado), podrías limpiar el token aquí
    if (error.response?.status === 401) {
      // Opcional: limpiar el token y redirigir al login
      // localStorage.removeItem('auth');
    }
    return Promise.reject(error);
  }
);