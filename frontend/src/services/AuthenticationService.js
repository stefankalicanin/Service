import SprintsAxiosClient from "./clients/SprintsAxiosClient";
import { TokenService } from "./TokenService";

export const AuthenticationService = {
  login,
  logout,
  getRole
};

async function login(userCredentials) {
  try {
    const response = await SprintsAxiosClient.post(
      "http://localhost:8000/core/token/",
      userCredentials
    );
    const decoded_token = TokenService.decodeToken(response.data.access);
    if (decoded_token) {
      TokenService.setToken(response.data.access);
      const role = getRole();
      if (userCredentials.password === '123' && (role === 'REPAIR_DIAGNOSTIC' || role === 'REPAIR_TROUBLESHOOTING')) {
        window.location.assign("/repairer/password")
      }
      else {
      if(role === 'ADMIN') {
        window.location.assign("/admin/home");
      }
      else if (role === 'REPAIR_DIAGNOSTIC') {
        window.location.assign("/repairerd/home");
      }
      else if (role === 'REPAIR_TROUBLESHOOTING') {
        window.location.assign("/repairert/home");
    } 
    else if (role === 'USER') {
      window.location.assign("/user/home")
    }
    else {
      console.error("Invalid token");
    }
  }
}
  }
catch (error) {
    return error;
  }
}



function logout() {
  TokenService.removeToken();
  window.location.assign("/");
}

function getRole() {
  const token = TokenService.getToken();
  const decoded_token = token ? TokenService.decodeToken(token) : null;
  if (decoded_token) {
    return decoded_token.role;
  } else {
    return null;
  }
}