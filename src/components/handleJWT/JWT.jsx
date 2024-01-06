import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";

const cookies = new Cookies(null, { path: "/" });

const handleJWT = () => {
    try {
      if (cookies.get("jwt")) {
        const getCockie = cookies.get("jwt");
        const decodedToken = decodeToken(getCockie);
          if (decodedToken && decodedToken.email) {
          const email = decodedToken.email;
          return [email, getCockie];
        }
      }
    } catch (error) {
      console.error(error);
    }
  
    // Si les valeurs ne sont pas définies, retournez un tableau vide
    return [];
  };
  
  export default handleJWT;
  