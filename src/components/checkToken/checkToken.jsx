import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";

  const cookies = new Cookies(null, { path: "/" });

  const getJTW = () =>{
    try {
      if (cookies.get("jwt")) {
        const getCockie = cookies.get("jwt");
        const decodedToken = decodeToken(getCockie);
        console.log(decodedToken);
      }
    } catch (error) {
      cookies.remove("jwt");
      console.error(
        "Une erreur s'est produite lors de la gestion des cookies:",
        error
      );
    }
  }

const checkTokenValidity = (token) => {
    fetch("http://192.168.1.11:5000/api/check-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),

    })
}

export default checkTokenValidity