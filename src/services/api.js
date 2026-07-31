import axios from 'axios'
import { useLoadingStore } from '@/stores/loading'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

axiosClient.interceptors.request.use(
  (config) => {
    const loadingStore = useLoadingStore()
    loadingStore.show()

    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Token ${token}`
    }

    return config
  },
  (error) => {
    const loadingStore = useLoadingStore()
    loadingStore.hide()
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    const loadingStore = useLoadingStore()
    loadingStore.hide()
    return response.data
  },
  (error) => {
    const loadingStore = useLoadingStore()
    loadingStore.hide()

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (error.response && error.response.status === 403) {
      alert(error.response.data?.message || 'Bạn không có quyền thực hiện thao tác này!')
    }

    return Promise.reject(error)
  }
)

const getRequest = (url, config = {}) => axiosClient.get(url, config)

const postRequest = (url, payload = {}, config = {}) => axiosClient.post(url, payload, config)

const putRequest = (url, payload = {}, config = {}) => axiosClient.put(url, payload, config)

const patchRequest = (url, payload = {}, config = {}) => axiosClient.patch(url, payload, config)

const deleteRequest = (url, config = {}) => axiosClient.delete(url, config)

export const useApi = () => {
  return {
    get: getRequest,
    post: postRequest,
    put: putRequest,
    patch: patchRequest,
    delete: deleteRequest
  }
}
