import axios from "axios";

const BASE_URL = "http://localhost:8080"

export const PublicAxios = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'}
})

export const PrivateAxios = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json'}
})
