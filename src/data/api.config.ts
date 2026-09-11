const Endpoints = {
    login: "http://localhost:3004/auth/login",
    validate: "http://localhost:3004/auth/validate",
    logout: "http://localhost:3004/auth/logout",
    message: "http://localhost:3006/message/",
    room: "http://localhost:3001/room/",
    booking: "http://localhost:3000/booking/"
}

const AuthState = {
    accessToken: '',
    saveToken: (token: string) => { AuthState.accessToken = token }
}

export {
    Endpoints,
    AuthState
}