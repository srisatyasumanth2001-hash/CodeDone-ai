import axios from 'axios'
const api = axios.create({
  baseURL :'http://localhost:8000/api/v1',
})

api.interceptors.request.use((config)=>{
  const token =localStorage.getItem('access_token')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error)=>{
    const original = error.config 
    if(error.response?.status === 401 && !original._retry ){
      original._retry = true
      const refreshtoken = localStorage.getItem('refresh_token')
      if (refreshtoken){
        try{
          const response = await axios.post(
            'http://localhost:8000/api/v1/auth/refresh',
            {refresh_token : refreshtoken}
          )
          const newAccesstoken = response.data.access_token
          localStorage.setItem('access_token',newAccesstoken)
          original.headers.Authorization = `Bearer ${newAccesstoken}`
          return api(original)
        } catch{
          localStorage.clear()
          window.location.href ='/login'
        }
      }
    }
    return Promise.reject(error)
  }
)
export default api