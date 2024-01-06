import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navBar/NavBar";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import "./PublishAdd.css";
import SearchForm from "../../components/searchForm/SearchForm";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";
import Select from "react-select";
import handleJWT from "../../components/handleJWT/JWT";
import CityDepart from "./CityDepart";
import CityArrive from "./CityArrive";

function PublishAdd({ datas, email }) {
  const [data, setData] = useState([]);
  const cookies = new Cookies(null, { path: "/" });
  const discutable = useRef();
  const [error, setError] = useState(false);
  const [erroText, setErroText] = useState("");
  const [succes, setSucces] = useState(false);
  const [id, setId] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [userEmail, jwtToken] = handleJWT();
  const [valideDepartCity, setValideDepartCity] = useState(false);
  const [valideArriveCity, setValideArriveCity] = useState(false);
  const [valideDate, setValideDate] = useState(false);
  const [cityDepart, setCityDepart] = useState("");
  const [cityArrive, setCityArrive] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const selectedOption = { value: "XAF", label: "XAF (CFA)" };
    const selectedOptionString = JSON.stringify(selectedOption);
    localStorage.setItem("selectedOption", selectedOptionString);
  }, [selectedOption]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  // Formatage de la date et de l'heure
  const formattedDateTime = currentDateTime.toLocaleString();

  const handleDatas = (name, value) => {
    setData({
      ...data,
      [name]: value,
      view: 0,
      villeDepart: cityDepart.name,
      villeArrive: cityArrive.name,
      villeDepartDoc: cityDepart,
      villeArriveDoc: cityArrive,
      date: formattedDateTime,
      paysDepart: cityDepart.country,
      paysArrive: cityArrive.country,
      currency: selectedOption?.value,
      dateExpiration: data.dateDepart ? addTwoDays(data.dateDepart) : undefined,      labelCurrency: selectedOption?.label,
      isValided: false,
      discutable: discutable.current.value ? discutable.current.value : "non",
    });
  };
  useEffect(() => {
    if (cookies.get("jwt") != undefined) {
      const decodedToken = decodeToken(cookies.get("jwt"));
      setData({ ...data, publishedBy: decodedToken.email });
    }
  }, []);

  useEffect(() => {
    if (id != "") {
      handleConfirmationReceived();
    }
  }, [id]);

  const handleError = () => {
    setTimeout(() => {
      setError(false);
    }, 2000);
  };
  useEffect(() => {
    if (error) {
      handleError();
    }
  }, [error]);
  const handleConfirmationReceived = () => {
    fetch("http://192.168.1.11:5000/api/send-confirmation-ads-received", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        email: email,
        data: data,
        id: id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(
            "Votre annonce a été enregistré mais une erreur est survenu lors de l'envoi de l'e-mail"
          );
        }
      })
      .then((data) => {
        setSucces(false);
        alert(
          "Votre annonce a bien été envoyée aux administrateurs. Vous recevrez un e-mail pour plus de détails."
        );
        window.location.reload();
      })
      .catch((error) => {
        alert(
          "Votre annonce a été enregistré mais une erreur est survenu lors de l'envoi de l'e-mail"
        );
        console.error("Erreur lors de l'envoi de l'e-mail", error);
      });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const dateDepart = new Date(data.dateDepart);
    const dateArrive = new Date(data.dateArrive);

    if (dateDepart >= dateArrive) {
      setError(true);
      setErroText(
        "La date de départ ne peux pas être superieure ou égale à la date d'arrivée"
      );
      return;
    }
    if (data.villeDepart == "") {
      setError(true);
      setErroText("Veuillez renseigner la ville de depart");
      return;
    }
    if (data.villeArrive == "") {
      setError(true);
      setErroText("Veuillez renseigner la ville d'arrivée");
      return;
    }
    try {
      setSucces(true);
      const response = await fetch(
        `http://192.168.1.11:5000/api/ads-ad/${userEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            data: data,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la requête");
      }
      const responseData = await response.json();
      
      setId(responseData.reponse);
    } catch (error) {
      alert("Une erreur s'est produite");
      window.location.reload();
      console.error("Une erreur s'est produite :", error.message);
    }
  };

  const currencyOptions = [
    { value: "XAF", label: "XAF (CFA)" },
    { value: "XOF", label: "XOF (CFA)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
  ];
  const preferedCurrency = localStorage.getItem("selectedOption");
  const [existingCurrency, setExistingCurrency] = useState(false);
  function handleExistingCurrency() {
    try {
      setSelectedOption(JSON.parse(preferedCurrency));
      setExistingCurrency(true);
    } catch (error) {
      setExistingCurrency(false);
    }
  }
  useEffect(() => {
    handleExistingCurrency();
  }, []);

  useEffect(() => {
    if (selectedOption !== null) {
      localStorage.setItem("selectedOption", JSON.stringify(selectedOption));
    }
  }, [selectedOption]);

  const handleCityArrive = (value) => {
    if (value != undefined) {
      setData({
        ...data,
        villeArrive: value.name,
        villeArriveDoc: value,
        paysArrive: value.country,
      });
      setCityArrive(value);
    }
  };

  const handleCityDepart = (value) => {
    if (value != undefined) {
      setData({
        ...data,
        villeDepart: value.name,
        villeDepartDoc: value,
        paysDepart: value.country,
      });
      setCityDepart(value);
    }
  };
  function addTwoDays(originalDate) {
    var currentDate = new Date(originalDate);
    currentDate.setDate(currentDate.getDate() + 3);
    var newDateValue = currentDate.toISOString().split("T")[0];
    return newDateValue;
  }
  return (
    <div>
      <NavBar />
      <div>
        <h1 className="detailed-ads-text" style={{ marginTop: "40px" }}>
          Ajouter une annonce
        </h1>
      </div>
      <SearchForm datas={datas} />
      <div>
        <form
          onSubmit={(e) => handleAdd(e)}
          className="flex flex-wrap mx-20 justify-center gap-5"
        >
          <div
            className="w-96 mx-auto flex flex-col gap-5 pb-10 items-center rounded-xl pt-10 px-10 shadow-md"
            style={{
              backgroundColor: "#f8f9fa",
            }}
          >
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500 "
              >
                Nom du voyageur
              </label>
              <input
                type="text"
                id="name"
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg  text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none "
                required
                value={data.nom || ""}
                onChange={(e) => handleDatas("nom", e.target.value)}
                pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
              />
            </div>

            {error ? (
              <div
                style={{ backgroundColor: "#f8f9fa" }}
                className="text-red-500 absolute shadow-md rounded-xl p-10 top-1/2 mt-72 text-center z-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
              >
                <p>{erroText}</p>
              </div>
            ) : null}
            <div>
              <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Ville (départ)
              </p>
              <CityDepart citieValue={handleCityDepart} />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500"
              >
                Date (départ)
              </label>
              <input
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none "
                type="date"
                value={data.dateDepart || ""}
                onChange={(e) => {
                  handleDatas("dateDepart", e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500"
              >
                Kilos disponibles
              </label>
              <input
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                type="text"
                value={data.kilosDispo || ""}
                onChange={(e) => handleDatas("kilosDispo", e.target.value)}
                required
                pattern="\d*"
                min={1}
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500"
              >
                Prix du kilo{" "}
              </label>

              <input
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                type="text"
                value={data.prixKilo || ""}
                onChange={(e) => handleDatas("prixKilo", e.target.value)}
                min={1}
                pattern="\d*"
                required
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500"
              >
                Devise
              </label>
              <Select
                required
                className="shadow-md w-60 sm:w-72 "
                defaultValue={
                  !existingCurrency
                    ? JSON.parse(preferedCurrency)
                    : selectedOption
                }
                onChange={setSelectedOption}
                options={currencyOptions}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Discutable
              </label>
              <select
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                required
                ref={discutable}
                value={data.discutable || ""}
                onChange={(e) => handleDatas("discutable", e.target.value)}
              >
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Description (facultative)
              </label>
              <textarea
                value={data.description || ""}
                onChange={(e) => handleDatas("description", e.target.value)}
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                type="text"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Contraintes (facultative)
              </label>
              <textarea
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                value={data.contraintes || ""}
                onChange={(e) => handleDatas("contraintes", e.target.value)}
                type="text"
              />
            </div>
          </div>
          {succes ? (
            <div className="absolute top-120 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-300 p-5 rounded-md text-green-600">
              <p>Veuillez patienter ...</p>
            </div>
          ) : null}
          <div
            className="max-w-sm mx-auto flex flex-col w-96 h-1/2 px-10 items-center rounded-xl pt-6 shadow-md"
            style={{
              backgroundColor: "#f8f9fa",
            }}
          >
            <div className="flex flex-col items-center gap-5 rounded-lg mb-10 ">
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Ville (Arrivée)
                </p>
                <CityArrive citieValue={handleCityArrive} />
              </div>
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Date (arrivé)
                </p>
                <input
                  className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                  type="date"
                  value={data.dateArrive || ""}
                  onChange={(e) => handleDatas("dateArrive", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex gap-8">
              <button
                type="submit"
                style={{ backgroundColor: "#6C63FF" }}
                className="text-white mb-5 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
              >
                Ajouter
              </button>
              <button
                type="reset"
                style={{ backgroundColor: "#6C63FF" }}
                className="text-white mb-5 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      </div>
      <div style={{}}>
        <FakeFooter />
      </div>
    </div>
  );
}

export default PublishAdd;
