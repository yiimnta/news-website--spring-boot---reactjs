import AxiosService from "./AxiosService"

const login = (email: string, password: string) => {
    const data = JSON.stringify({ email, password})
    return AxiosService.post("/auth/login", data , {
        headers: { "Content-Type": "application/json"}
    })

}

const AuthService = {
    login
}

export default AuthService