"use client";
import { ErrorBoundary } from "react-error-boundary";
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
import Admin from "./pages/admin/Admin";
import "./components/searchForm/myAdd/countryHandler.css";
import checkTokenValidity from "./components/checkToken/checkToken";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "flowbite";

function App() {
  const cookies = new Cookies(null, { path: "/" });
  const [seeRoute, setSeeRoute] = useState(true);
  const [data, setData] = useState([]);
  const [email, setEmail] = useState("");
  const home = <Home datas={data} />;
  const signIN = <Signin />;
  const signUP = <Signup />;
  const annoncesSearched = <AnnonceSearched datas={data} />;
  const detailedAnnonce = <DetailedAnnonce datas={data} email={email} />;
  const filterDropdownV2 = <FilterDropdownV2 datas={data} email={email} />;
  const vueEnsemble = <VueEnsemble datas={data} email={email} />;
  const contacterNous = <ContactUs />;
  const publishAdd = <PublishAdd datas={data} email={email} />;
  const manageNotification = <ManageNotification email={email} />;
  const notFound = <Page404 />;
  const admin = <Admin verifiedAds={data} email={email} />;
  const [trueToken, setTrueToken] = useState("");

  useEffect(() => {
    try {
      if (cookies.get("jwt")) {
        const getCockie = cookies.get("jwt");
        const decodedToken = decodeToken(getCockie);
        setEmail(decodedToken.email);
        if (decodedToken.logged === true) {
          chekIkToken(decodedToken.email, decodedToken._ik);
          setTrueToken(cookies.get("jwt"));
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
      window.location.href = "/signin";
    }
  }, []);

  const chekIkToken = async (email, ik) => {
    try {
      const response = await fetch("http://192.168.1.11:5000/api/check-ik", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          ik: ik,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.response) {
          cookies.remove("jwt");
          window.location.href = "/signin";
        }
      } else {
        console.error("Erreur lors de la requête HTTP :", response.status);
      }
    } catch (error) {
      console.error("Erreur inattendue :", error);
    }
  };

  useEffect(() => {
    if (email != "" && trueToken != "") {
      getAllAds(email, trueToken);
    }
  }, [email, trueToken]);

  const getAllAds = async () => {
    try {
      const token = trueToken;

      const response = await fetch(
        `http://192.168.1.11:5000/api/get-all-ads/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("La requête GET a échoué.");
      }

      const responseData = await response.json();
      setData(responseData.ads);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  function fallbackRender({ error, resetErrorBoundary }) {
    return (
      <div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div class="relative">
            <div class="absolute">
              <div class="">
                <h1 class="my-2 text-gray-800 font-bold text-2xl">
                  Oops, il semble qu'une erreur se soit produite sur cette
                  section
                </h1>
                <p class="my-2 text-gray-800">
                  Désolé pour le désagrement, veuillez recharger la page et
                  reesayer si cela persiste veuillez contacter l'assistance sur
                  whatsapp
                </p>
                <div className="flex flex-wrap justify-center gap-2 items-center">
                     <button
                  class=" my-2 border bg-sky-600 rounded-lg  md py-4 px-8 text-center  text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  onClick={resetErrorBoundary}
                >
                  Retour
                </button>
                <a href="https://wa.me/+221773101160">
                  <button class=" my-2 border md py-4 px-8 text-center bg-sky-600 rounded-lg  text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">
                    Assistance
                  </button>
                </a>

                </div>
             
                {console.log(error.message)}
              </div>
            </div>
            <div>
              <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
            </div>
          </div>
        </div>
        <div>
          <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <div>
        <Routes>
          <Route path="/signin" element={seeRoute == true ? home : signIN} />
          <Route path="/signup" element={seeRoute == true ? home : signUP} />
          <Route path="/" element={seeRoute == true ? home : home} />
          <Route
            path="/searched/:villeDepart/:villeArrive/:departureDate"
            element={seeRoute == true ? annoncesSearched : signIN}
          />
          <Route
            path="/searched/:villeDepart/:villeArrive"
            element={seeRoute == true ? annoncesSearched : signIN}
          />
          <Route
            path="/detailed-ads/:_id"
            element={seeRoute == true ? detailedAnnonce : detailedAnnonce}
          />
          <Route
            path="/your-ads"
            element={seeRoute == true ? filterDropdownV2 : signIN}
          />
          <Route
            path="/vue-d-ensemble"
            element={seeRoute == true ? vueEnsemble : signIN}
          />
          <Route path="/contacter-nous" element={contacterNous} />
          <Route
            path="/publier"
            element={seeRoute == true ? publishAdd : signIN}
          />
          <Route path="/*" element={notFound} />
          <Route
            path="/manage-notifications"
            element={seeRoute == true ? manageNotification : signIN}
          />
          <Route
            path="/ca23b8f97dab6e8c5a4f33e97f3cf5a30a0a17174e6a6e6b6f3cd8aa42cf0b5813c36e7f1d88b4b16461cfb1742813988f2f5d29c92d0a2e2c5b57f8e617b42878a7812d8b1a23e04ce13b3a940ee88fe2fcd3f1ef78f37ea7"
            element={admin}
          />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
