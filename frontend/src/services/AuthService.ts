import { PublicAxios } from "./AxiosService" 

const login = (email: string, password: string) => {
    const data = JSON.stringify({ email, password})
    return PublicAxios.post("/auth/login", data)
}

const refresh = (token: string) => {
    return PublicAxios.get("/auth/refresh", {
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

const AuthService = {
    login,
    refresh
}

export default AuthService