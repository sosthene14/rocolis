import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navBar/NavBar";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import "./PublishAdd.css";
import SearchForm from "../../components/searchForm/SearchForm";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";
import Select from "react-select";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import remplacerEspacesParTirets from "../../components/removeSpace/removeSpace";

function PublishAdd({ datas, email }) {
  const [data, setData] = useState([]);
  const cookies = new Cookies(null, { path: "/" });
  const discutable = useRef();
  const [error, setError] = useState(false);
  const [succes, setSucces] = useState(false);
  const [id, setId] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [paysDepartId, setPaysDepartId] = useState();
  const [paysArriveId, setPaysArriveId] = useState();
  const [etatDepartId, setEtatDepartId] = useState();
  const [etatArriveId, setEtatArriveId] = useState();
  const [villeDepartId, setVilleDepartId] = useState();
  const [villeArriveId, setVilleArriveId] = useState();
  const [paysDepartNom, setPaysDepartNom] = useState();
  const [paysArriveNom, setPaysArriveNom] = useState();
  const [etatDepartNom, setEtatDepartNom] = useState();
  const [etatArriveNom, setEtatArriveNom] = useState();
  const [villeDepartNom, setVilleDepartNom] = useState();
  const [villeArriveNom, setVilleArriveNom] = useState();
  const [saveCountryDepart, setSaveCountryDepart] = useState([]);
  const [saveStateDepart, setSaveStateDepart] = useState([]);
  const [saveCityDepart, setSaveCityDepart] = useState([]);
  const [saveCountryArrive, setSaveCountryArrive] = useState([]);
  const [saveStateArrive, setSaveStateArrive] = useState([]);
  const [saveCityArrive, setSaveCityArrive] = useState([]);

  useEffect(() => {
    console.log(saveCountryDepart);
  }, [saveCountryDepart]);

  useEffect(() => {
    const selectedOption = { value: "XAF", label: "XAF (CFA)" };
    const selectedOptionString = JSON.stringify(selectedOption);
    localStorage.setItem("selectedOption", selectedOptionString);
  }, [selectedOption]);

  const handleDatas = (name, value) => {
    setData({
      ...data,
      [name]: value,
      view: 0,
      paysDepartId: paysDepartId,
      paysArriveId: paysArriveId,
      etatDepartId: etatDepartId ? etatDepartId : 0,
      etatArriveId: etatArriveId ? etatArriveId : 0,
      villeDepartId: villeDepartId ? villeDepartId : 0,
      villeArriveId: villeArriveId ? villeArriveId : 0,
      etatDepart: remplacerEspacesParTirets(etatDepartNom)
        ? remplacerEspacesParTirets(etatDepartNom)
        : remplacerEspacesParTirets(paysDepartNom)
        ? remplacerEspacesParTirets(paysDepartNom)
        : "fr",
      villeDepart: remplacerEspacesParTirets(villeDepartNom)
        ? remplacerEspacesParTirets(villeDepartNom)
        : remplacerEspacesParTirets(etatDepartNom)
        ? remplacerEspacesParTirets(etatDepartNom)
        : remplacerEspacesParTirets(paysDepartNom)
        ? remplacerEspacesParTirets(paysDepartNom)
        : "fr",
      villeArrive: remplacerEspacesParTirets(villeArriveNom)
        ? remplacerEspacesParTirets(villeArriveNom)
        : remplacerEspacesParTirets(etatArriveNom)
        ? remplacerEspacesParTirets(etatArriveNom)
        : remplacerEspacesParTirets(paysArriveNom)
        ? remplacerEspacesParTirets(paysArriveNom)
        : "fr",
      etatArrive: remplacerEspacesParTirets(etatArriveNom)
        ? remplacerEspacesParTirets(etatArriveNom)
        : remplacerEspacesParTirets(paysArriveNom)
        ? remplacerEspacesParTirets(paysArriveNom)
        : "fr",
      saveCountryDepart: saveCountryDepart,
      saveStateDepart: saveStateDepart,
      saveCityDepart: saveCityDepart,
      saveCountryArrive: saveCountryArrive,
      saveStateArrive: saveStateArrive,
      saveCityArrive: saveCityArrive,
      currency: selectedOption?.value,
      labelCurrency: selectedOption?.label,
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
    fetch("http://192.168.1.10:5000/api/send-confirmation-ads-received", {
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
    if (data.villeDepart === "fr" || data.villeArrive === "fr") {
      setError(true);
      return;
    } else {
      try {
      const response = await fetch("http://192.168.1.10:5000/api/ads-ad", {
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
            <div>
              <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Pays (départ)
              </p>
              <CountrySelect
                showFlag={true}
                countryid={paysDepartId}
                onChange={(e) => {
                  const functionsToCall = [
                    () => console.log(e),
                    () => handleDatas("paysDepart", e.name),
                    () => setPaysDepartNom(e.name),
                    () => setPaysDepartId(e.id),
                    () => setSaveCountryDepart(...saveCountryDepart, e),
                  ];

                  functionsToCall.forEach((func) => func());
                }}
                placeHolder="Pays"
              />
            </div>

            <div>
              <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Etat ou departement (départ)
              </p>
              <StateSelect
                countryid={paysDepartId}
                onChange={(e) => {
                  console.log(e);
                  setEtatDepartNom(e.name);
                  setEtatDepartId(e.id);
                  setSaveStateDepart(...saveStateDepart, e);
                }}
                placeHolder="Etat ou departement"
              />
            </div>
            {error ? (
              <div
                style={{ backgroundColor: "#f8f9fa" }}
                className="text-red-500 absolute shadow-md rounded-xl p-10 top-1/2 mt-72 text-center z-50 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
              >
                <p>Veuillez remplir au moins les noms des pays</p>
              </div>
            ) : null}
            <div>
              <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                Ville (départ)
              </p>
              <CitySelect
                countryid={paysDepartId}
                style={{ width: "100%", height: "40px" }}
                stateid={etatDepartId}
                onChange={(e) => {
                  setVilleDepartId(e.id);
                  setVilleDepartNom(e.name);
                  setSaveCityDepart(...saveCityDepart, e);
                }}
                placeHolder="ville"
              />
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
                onChange={(e) => handleDatas("dateDepart", e.target.value)}
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
                  Pays (Arrivée)
                </p>
                <CountrySelect
                  showFlag={true}
                  required
                  countryid={paysArriveId}
                  onChange={(e) => {
                    setPaysArriveId(e.id);
                    handleDatas("paysArrive", e.name);
                    setPaysArriveNom(e.name);
                    setSaveCountryArrive(...saveCountryArrive, e);
                  }}
                  placeHolder="Pays"
                />
              </div>

              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Etat ou departement (Arrivée)
                </p>
                <StateSelect
                  required
                  countryid={paysArriveId}
                  onChange={(e) => {
                    setEtatArriveId(e.id);
                    handleDatas("etatArrive", e.name);
                    setEtatArriveNom(e.name);
                    setSaveStateArrive(...saveStateArrive, e);
                  }}
                  placeHolder="Etat ou departement"
                />
              </div>

              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Ville (Arrivée)
                </p>
                <CitySelect
                  countryid={paysArriveId}
                  style={{ width: "100%", height: "40px" }}
                  stateid={etatArriveId}
                  onChange={(e) => {
                    setVilleArriveId(e.id);
                    handleDatas("villeArrive", e.name);
                    setVilleArriveNom(e.name);
                    setSaveCityArrive(...saveCityArrive, e);
                  }}
                  placeHolder="ville"
                />
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
