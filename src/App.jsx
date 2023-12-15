import "./App.css";
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/signin/Signin";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import { useState, useEffect } from "react";
import AnnonceSearched from "./components/annoncesSearched/AnnonceSearched";
import DetailedAnnonce from "./components/detailedAnnonce/DetailedAnnonce";
import FilterDropdownV2 from "./components/filterDropdownV2/FilterDropDownV2";
import Page404 from "./pages/404/404";
import VueEnsemble from "./pages/vueEnsemble/vueEnsemble";
import ContactUs from "./pages/contact/ContactUs";
import PublishAdd from "./pages/publishAd/PublishAdd";
import ManageNotification from "./pages/manageNotification/ManageNotification";

function App() {
  const cookies = new Cookies(null, { path: "/" });
  const [seeRoute, setSeeRoute] = useState(true);
  const [data, setData] = useState([]);
  useEffect(() => {
    try {
      if (cookies.get("jwt")) {
        const getCockie = cookies.get("jwt");
        const decodedToken = decodeToken(getCockie);
        if (decodedToken.logged === true) {
          setSeeRoute(true);
        } else {
          setSeeRoute(false);
          cookies.remove("jwt");
        }
      } else {
        setSeeRoute(false);
        cookies.remove("jwt");
      }
    } catch (error) {
      cookies.remove("jwt");
      console.error("Une erreur s'est produite lors de la gestion des cookies:", error);
      // Vous pouvez ajouter une logique de gestion d'erreur supplémentaire si nécessaire
    }
  }, []); // Assurez-vous de définir les dépendances correctement

  useEffect(() => {
    getAllAds()
  }, []);
  const getAllAds = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/get-all-ads", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("La requête GET a échoué.");
      }
      console.log("test");
      const responseData = await response.json();
      setData(responseData.ads);      
    } catch (error) {
      console.error("Error:", error);
      throw error; // Re-throw the error to propagate it further if needed
    }
  };

  return (
    <div>
      <Routes>
        <Route
          path="signin"
          element={seeRoute == true ? <Home datas={data} /> : <Signin />}
        />
        <Route
          path="signup"
          element={seeRoute == true ? <Home datas={data} /> : <Signup />}
        />
        <Route path="/" element={seeRoute == true ? <Home datas={data}/> : <Home datas={data} />} />
        <Route
          path="/searched/:depart/:destination/:departureDate"
          element={seeRoute == true ? <AnnonceSearched datas={data} /> : <Signin />}
        />
         <Route
          path="/searched/:depart/:destination"
          element={seeRoute == true ? <AnnonceSearched datas={data} /> : <Signin />}
        />
        <Route
          path="/detailed-ads/:_id"
          element={seeRoute == true ? <DetailedAnnonce datas={data} /> : <DetailedAnnonce datas={data} />}
        />
        <Route
          path="/your-ads"
          element={seeRoute == true ? <FilterDropdownV2 datas={data} /> : <Signin />}
        />
        <Route
          path="/vue-d-ensemble"
          element={seeRoute == true ? <VueEnsemble datas={data} /> : <Signin />}
        />
        <Route path="/contacter-nous" element={<ContactUs />} />
        <Route path="/publier" element={seeRoute == true ? <PublishAdd datas={data} /> : <Signin />} />
        <Route path="/*" element={<Page404 />} />
        <Route path="/manage-notifications" element={seeRoute == true ? <ManageNotification /> : <Signin />} />
      </Routes>
    </div>
  );
}

export default App;
