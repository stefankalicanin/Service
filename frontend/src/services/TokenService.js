import jwtDecode from 'jwt-decode'

export const TokenService = {
    getToken,
    setToken,
    removeToken,
    decodeToken,
    didTokenExpire
}

function getToken () {
    return localStorage.getItem("token");
}

function setToken (value) {
    return localStorage.setItem("token", value);
}

function removeToken () {
    return localStorage.removeItem("token");
}

function decodeToken(token) {
    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
}

function didTokenExpire () {
    const token = getToken();
    const decodedToken = token ? decodeToken(token) : null;
    return decodedToken ? decodeToken.exp_date < Date.now() : null 
}