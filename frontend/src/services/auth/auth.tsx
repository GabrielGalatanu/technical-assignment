import jwtDecode from "jwt-decode";
interface AuthServiceInterface {
  getCurrentUserToken: () => any | null;
  getCurrentUser: () => {
    id?: string;
  };
  isTokenExpired: () => boolean;
  authHeader: () => { "x-access-token": any | null };
  isAuthenticated: () => boolean;
  logout: () => void;
}

class AuthService implements AuthServiceInterface {
  getCurrentUserToken = () => {
    const tokenStr = localStorage.getItem("token");
    if (tokenStr) return tokenStr;

    return null;
  };

  getCurrentUser = () => {
    const userStr = localStorage.getItem("user");

    if (userStr) return JSON.parse(userStr);

    return null;
  };

  isTokenExpired = () => {
    const tokenStr = this.getCurrentUserToken();

    if (!tokenStr) return true;

    const decoded: any = jwtDecode(tokenStr);
    const currentTime = Date.now() / 1000; // current time in seconds

    if (decoded.exp < currentTime) {
      this.logout();
      return true;
    }

    return false;
  };

  authHeader = () => {
    const user = this.getCurrentUser();

    if (user && user.accessToken) {
      return { "x-access-token": user.accessToken };
    } else {
      return { "x-access-token": null };
    }
  };

  isAuthenticated = () => {
    const user = this.getCurrentUser();
    if (!user) return false;

    const tokenExpired = this.isTokenExpired();
    if (tokenExpired) return false;

    return true;
  };

  logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
}

const authService = new AuthService();

export default authService;
