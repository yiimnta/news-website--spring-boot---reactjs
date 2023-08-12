import { PublicAxios } from "./AxiosService" 

const login = (email: string, password: string) => {
    const data = JSON.stringify({ email, password})
    return PublicAxios.post("/auth/login", data)
}

const AuthService = {
    login
}

export default AuthService