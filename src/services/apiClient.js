import { apiClient } from '../plugins/pluginAxios.js'

export { apiClient }

async function handleApiCall(apiMethod, url, data = null, config = {}) {
  try {
    // Si data es FormData, axios manejará automáticamente el Content-Type
    const requestConfig = {
      timeout: config.timeout || 120000, // 2 minutos por defecto para operaciones largas
      ...config
    }
    
    const response = data 
      ? await apiMethod(url, data, requestConfig)
      : await apiMethod(url, requestConfig)
    return response.data
  } catch (error) {
    throw error
  }
}

export async function getData(url) {
  return handleApiCall(apiClient.get, url)
}

export async function postData(url, data, config = {}) {
  return handleApiCall(apiClient.post, url, data, config)
}

export async function putData(url, data) {
  return handleApiCall(apiClient.put, url, data)
}

export async function deleteData(url) {
  return handleApiCall(apiClient.delete, url)
}
