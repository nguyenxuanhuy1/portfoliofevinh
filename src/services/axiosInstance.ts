import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

axiosInstance.interceptors.request.use((config) => {
  // Nếu là FormData thì để axios tự set multipart
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else {
    // Request thường => JSON
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

export default axiosInstance