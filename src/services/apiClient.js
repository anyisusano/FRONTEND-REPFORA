import { apiClient } from '../plugins/pluginAxios.js'

export { apiClient }

async function handleApiCall(apiMethod, url, data = null) {
  try {
    const response = data 
      ? await apiMethod(url, data)
      : await apiMethod(url)
    return response.data
  } catch (error) {    throw error
  }
}

export async function getData(url) {
  return handleApiCall(apiClient.get, url)
}

export async function postData(url, data) {
  return handleApiCall(apiClient.post, url, data)
}

export async function putData(url, data) {
  return handleApiCall(apiClient.put, url, data)
}

export async function deleteData(url) {
  return handleApiCall(apiClient.delete, url)
}
