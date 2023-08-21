import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}`

export const PublicAxios = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true
})

export const PrivateAxios = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'},
    withCredentials: true
})
