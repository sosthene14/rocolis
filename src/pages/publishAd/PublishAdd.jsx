import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navBar/NavBar";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import "./PublishAdd.css";
import SearchForm from "../../components/searchForm/SearchForm";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import Selector from "./Selector";

function PublishAdd({ datas, email }) {
  const [data, setData] = useState([]);
  const cookies = new Cookies(null, { path: "/" });
  const discutable = useRef();
  const [error, setError] = useState(false);
  const [succes, setSucces] = useState(false);
  const [id, setId] = useState("");
  const devise = useRef();
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    localStorage.setItem("countryDepartName", 0);
    localStorage.setItem("countryArriveName", 0);
  },[])

  const indexOfDepartCountryValue = localStorage.getItem("countryDepartName");
  const indexOfArriveCountry = localStorage.getItem("countryArriveName");
  const indexOfDepartState = localStorage.getItem("indexOfDepartState");
  const indexOfArriveState = localStorage.getItem("indexOfArriveState");
  const indexOfDepartCity = localStorage.getItem("indexOfDepartCity");
  const indexOfArriveCity = localStorage.getItem("indexOfArriveCity");

  useEffect(() => {
    const selectedOption = { value: "XAF", label: "XAF (CFA)" };
    const selectedOptionString = JSON.stringify(selectedOption);
    localStorage.setItem("selectedOption", selectedOptionString);
  }, [selectedOption]);

  let countryData = Country.getAllCountries();
  let countryData2 = Country.getAllCountries();
  const [stateData, setStateData] = useState();
  const [cityData, setCityData] = useState();

  const [stateData2, setStateData2] = useState();
  const [cityData2, setCityData2] = useState();

  const [country, setCountry] = useState(
    countryData[indexOfDepartCountryValue]
      ? countryData[indexOfDepartCountryValue]
      : countryData[0]
  );
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [country2, setCountry2] = useState(
    countryData2[indexOfArriveCountry]
      ? countryData2[indexOfArriveCountry]
      : countryData2[0]
  );
  const [state2, setState2] = useState();
  const [city2, setCity2] = useState();

  useEffect(() => {
    if (stateData && stateData.length > 0) {
      setState(stateData[indexOfDepartState]);
    }
  }, [stateData, indexOfDepartState]);

  useEffect(() => {
    if (cityData && cityData.length > 0) {
      setCity(cityData[indexOfDepartCity]);
    }
  }, [cityData, indexOfDepartCity]);

  useEffect(() => {
    if (stateData2 && stateData2.length > 0) {
      setState2(stateData2[indexOfArriveState]);
    }
  }, [stateData2, indexOfArriveState]);

  useEffect(() => {
    if (cityData2 && cityData2.length > 0) {
      setCity2(cityData2[indexOfArriveCity]);
    }
  }, [cityData2, indexOfArriveCity]);

  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode));
    localStorage.setItem("countryDepartName", countryData.indexOf(country));
  }, [country]);

  useEffect(() => {
    setStateData2(State.getStatesOfCountry(country2?.isoCode));
    localStorage.setItem("countryArriveName", countryData2.indexOf(country2));
  }, [country2]);

  useEffect(() => {
    setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    if (stateData) {
      localStorage.setItem("indexOfDepartState", stateData.indexOf(state));
    }
  }, [state]);

  useEffect(() => {
    setCityData2(City.getCitiesOfState(country2?.isoCode, state2?.isoCode));
    if (stateData2) {
      localStorage.setItem("indexOfArriveState", stateData2.indexOf(state2));
    }
  }, [state2]);

  useEffect(() => {
    stateData && setState(stateData[0]);
  }, [stateData]);

  useEffect(() => {
    stateData2 && setState2(stateData2[0]);
  }, [stateData2]);

  useEffect(() => {
    cityData && setCity(cityData[0]);
  }, [cityData]);

  useEffect(() => {
    cityData2 && setCity2(cityData2[0]);
  }, [cityData2]);

  useEffect(() => {
    if (cityData) {
      localStorage.setItem("indexOfDepartCity", cityData.indexOf(city));
    }
  }, [city]);
  useEffect(() => {
    if (cityData2) {
      localStorage.setItem("indexOfArriveCity", cityData2.indexOf(city2));
    }
  }, [city2]);

  const hanldeDatas = (name, e) => {
    setData({
      ...data,
      [name]: e.target.value,
      view: 0,
      paysDepart: country.name,
      paysArrive: country2.name,
      etatDepart: stateData.length > 0 ? state.name : country.name,
      etatArrive: stateData2.length > 0 ? state2.name : country2.name,
      villeDepart:
        cityData.length > 0
          ? city.name
          : stateData.length > 0
          ? state.name
          : country.name,
      villeArrive:
        cityData.length > 0
          ? city2.name
          : stateData2.length > 0
          ? state2.name
          : country2.name,
      currency: selectedOption?.value,
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

  useEffect(() => {}, [data]);

  useEffect(() => {
    if (id != "") {
      handleConfirmationReceived();
    }
  }, [id]);

  const handleConfirmationReceived = () => {
    fetch("http://127.0.0.1:5000/api/send-confirmation-ads-received", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    console.log(data);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/ads-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête");
      }
      const responseData = await response.json();
      setSucces(true);
      setId(responseData.reponse);
    } catch (error) {
      alert("Une erreur s'est produite");
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
                className="block text-sm font-medium text-gray-500 dark:text-gray-500 "
              >
                Nom du voyageur
              </label>
              <input
                type="text"
                id="name"
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg  text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none "
                required
                value={data.nom || ""}
                onChange={(e) => hanldeDatas("nom", e)}
                pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
              />
            </div>
            <div>
              <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Pays (départ)
              </p>
              <Selector
                data={countryData}
                selected={country}
                setSelected={setCountry}
              />
            </div>
            {state && (
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Etat ou departement (départ)
                </p>
                <Selector
                  data={stateData}
                  selected={state}
                  setSelected={setState}
                />
              </div>
            )}
            {city && (
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Ville (départ)
                </p>
                <Selector
                  data={cityData}
                  selected={city}
                  setSelected={setCity}
                />
              </div>
            )}
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
                onChange={(e) => hanldeDatas("dateDepart", e)}
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
                onChange={(e) => hanldeDatas("kilosDispo", e)}
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
                onChange={(e) => hanldeDatas("prixKilo", e)}
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
                onChange={(e) => hanldeDatas("discutable", e)}
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
                onChange={(e) => hanldeDatas("description", e)}
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
                onChange={(e) => hanldeDatas("contraintes", e)}
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
                <p className="block mb-2 mt-5 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Pays (arrivé)
                </p>
                <Selector
                  data={countryData2}
                  selected={country2}
                  setSelected={setCountry2}
                />
              </div>
              {state2 && (
                <div>
                  <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                    Etat ou departement (arrivé)
                  </p>
                  <Selector
                    data={stateData2}
                    selected={state2}
                    setSelected={setState2}
                  />
                </div>
              )}
              {city2 && (
                <div>
                  <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                    Ville (arrivé)
                  </p>
                  <Selector
                    data={cityData2}
                    selected={city2}
                    setSelected={setCity2}
                  />
                </div>
              )}
              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Date (arrivé)
                </p>
                <input
                  className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                  type="date"
                  value={data.dateArrive || ""}
                  onChange={(e) => hanldeDatas("dateArrive", e)}
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
