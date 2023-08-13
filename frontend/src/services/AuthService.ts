import { PublicAxios } from "./AxiosService" 

const login = (email: string, password: string, rememberMe: boolean) => {
    const data = JSON.stringify({ email, password, rememberMe})
    return PublicAxios.post("/auth/login", data)
}

const AuthService = {
    login
}

export default AuthService