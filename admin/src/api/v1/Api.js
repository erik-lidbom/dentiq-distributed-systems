import axios from 'axios'
// import * as config from '@/api/v1/apiConfig'


export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3001/api/v1'
})
