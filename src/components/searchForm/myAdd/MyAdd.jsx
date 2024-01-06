import React, { useState, useEffect, useRef } from "react";
import { FakeFooter } from "../../fakeFooter/FakeFooter";
import "./PublishAdd.css";
import SearchForm from "../SearchForm";
import Select from "react-select";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import formatDate from "../../formatDate/formatDate";
import remplacerEspacesParTirets from "../../removeSpace/removeSpace";
import handleJWT from "../../handleJWT/JWT";
import CityDepartModify from "./CityDepartModify";
import CityArriveModify from "./CityArriveModify";

function MyAdd({
  datas,
  email,
  description,
  contraintes,
  kilosDispo,
  prixKilo,
  dateDepart,
  dateArrive,
  nom,
  villeDepartDoc,
  villeArriveDoc,
  discutable,
  onloadCurrency_,
  _id,
}) {
  const [succes, setSucces] = useState(false);
  const [id, setId] = useState(_id);
  const [voyageurName, setVoyageurName] = useState(nom);
  const [dateDepartValue, setDateDepartValue] = useState(dateDepart);
  const [dateArriveValue, setDateArriveValue] = useState(dateArrive);
  const [kilosDispoValue, setKilosDispoValue] = useState(kilosDispo);
  const [prixKiloValue, setPrixKiloValue] = useState(prixKilo);
  const [discutablesValue, setDiscutablesValue] = useState(discutable);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [contraintesValue, setContraintesValue] = useState(contraintes);
  const [villeDepartValue, setVilleDepartValue] = useState(villeDepartDoc);
  const [villeArriveValue, setVilleArriveValue] = useState(villeArriveDoc);
  const [selectedOption, setSelectedOption] = useState(onloadCurrency_);
  const [data, setData] = useState(datas[0]);
  const [canModify, setCanModify] = useState(false);
  const divToRemove = useRef(null);
  const mainDiv = useRef(null);
  const [error, setError] = useState(false);
  const [erroText, setErroText] = useState("");

  const handleDatas = (name, value) => {
    setData({
      ...data,
      [name]: value,
      villeDepart: villeDepartValue.name,
      villeArrive: villeArriveValue.name,
      paysDepart: cityDepart.country,
      paysArrive: cityArrive.country,
      villeDepartDoc: cityDepart,
      villeArriveDoc: cityArrive,
      currency: selectedOption?.value,
      labelCurrency: selectedOption?.label,
      discutable: discutablesValue,
    });
  };

  const [userMail, jwtToken] = handleJWT();

  const handleAdd = async (e = null) => {
    if (e) {
      e.preventDefault();
      handleDatas();
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
      editAds(data);
    }
  };

  const editAds = (data) => {
    setSucces(true);
    fetch(`http://192.168.1.11:5000/api/update-doc-datas/${userMail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        _id: _id.$oid,
        data: data,
      }),
    }).then((response) => {
      if (response.ok) {
        alert("Votre annonce a bien été modifiée");
        window.location.reload();
      } else {
        alert("Une erreur s'est produite");
        setSucces(false);
      }
    });
  };

  const currencyOptions = [
    { value: "XAF", label: "XAF (CFA)" },
    { value: "XOF", label: "XOF (CFA)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
  ];

  function deleteMyAdd() {
    setSucces(true);
    fetch(`http://192.168.1.11:5000/api/delete-doc-datas/${userMail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        _id: _id.$oid,
      }),
    }).then((response) => {
      if (response.ok) {
        mainDiv.current.style.display = "none";
        setSucces(false);
      } else {
        setSucces(false);
      }
    });
  }

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
useEffect(() => {
  console.log(villeDepartDoc,villeArriveDoc)
}, [villeDepartDoc, villeArriveDoc])
  return (
    <div ref={mainDiv}>
      {canModify ? (
        <div ref={divToRemove}>
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
                <CityDepartModify
                  citieValue={handleCityDepart}
                  defaultValue={villeDepartValue}
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
                  defaultValue={selectedOption}
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
                  <CityArriveModify
                    citieValue={handleCityArrive}
                    defaultValue={villeArriveValue}
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
                  Valider
                </button>
                <button
                  type="reset"
                  style={{ backgroundColor: "#6C63FF" }}
                  onClick={()=>{
                    setCanModify(!canModify)
                  }}
                  className="text-white mb-5 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                >
                  Annuler
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div
          className="flex flex-col mx-auto w-96 py-7 rounded-2xl shadow-xl px-5"
          style={{
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="text-left">
            <label
              htmlFor="name"
              className="mb-2  flex justify-between text-sm font-medium text-gray-500 dark:text-gray-500"
            >
              Nom du voyageur : <strong>{voyageurName}</strong>
            </label>
          </div>
          {error ? (<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-center">
              Une érreur est survenue veuillez réessayer
            </div>) : (
            null
          )}
          <div>
            <label
              htmlFor="name"
              className="mb-2 flex justify-between text-sm font-medium text-gray-500 dark:text-gray-500"
            >
              Ville de départ : <strong>{villeDepartValue.name}</strong>
            </label>
          </div>
          <div className="text-left">
            <label className="mb-2 flex justify-between text-sm font-medium text-gray-500 dark:text-gray-500">
              Date de départ : <strong>{formatDate(dateDepartValue)}</strong>
            </label>
          </div>
          <div>
            <label
              htmlFor="name"
              className="mb-2 flex justify-between text-sm font-medium text-gray-500 dark:text-gray-500"
            >
              Ville d'arrivée : <strong>{villeArriveValue.name}</strong>
            </label>
          </div>
          <div>
            <label
              htmlFor="name"
              className="mb-2 flex justify-between text-sm font-medium text-gray-500 dark:text-gray-500"
            >
              Date d'arrivé : <strong>{formatDate(dateArriveValue)}</strong>
            </label>
          </div>
          <div className="flex gap-8 mt-5 justify-center">
            <button
              onClick={() => setCanModify(true)}
              type="submit"
              style={{ backgroundColor: "#6C63FF" }}
              className="text-white mb-5 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
            >
              Mettre à jour
            </button>
            <button
              onClick={() => deleteMyAdd(_id)}
              style={{ backgroundColor: "#6C63FF" }}
              className="text-white mb-5 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyAdd;
