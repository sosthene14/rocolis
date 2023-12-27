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
  paysDepartId,
  paysArriveId,
  villeDepartId,
  villeArriveId,
  etatDepartId,
  etatArriveId,
  villeDepartNom,
  villeArriveNom,
  paysDepartNom,
  paysArriveNom,
  etatDepartNom,
  etatArriveNom,
  saveCountryDepart,
  saveStateDepart,
  saveCityDepart,
  saveCountryArrive,
  saveStateArrive,
  saveCityArrive,
  discutable,
  onloadCurrency_,
  _id,
}) {
  const [succes, setSucces] = useState(true);
  const [onloadCurrency, setOnloadCurrency] = useState(onloadCurrency_);
  const [id, setId] = useState(_id);
  const [voyageurName, setVoyageurName] = useState(nom);
  const [dateDepartValue, setDateDepartValue] = useState(dateDepart);
  const [dateArriveValue, setDateArriveValue] = useState(dateArrive);
  const [kilosDispoValue, setKilosDispoValue] = useState(kilosDispo);
  const [prixKiloValue, setPrixKiloValue] = useState(prixKilo);
  const [discutablesValue, setDiscutablesValue] = useState(discutable);
  const [descriptionValue, setDescriptionValue] = useState(description);
  const [contraintesValue, setContraintesValue] = useState(contraintes);
  const [paysDepartIdValue, setPaysDepartId] = useState(paysDepartId);
  const [paysArriveIdValue, setPaysArriveId] = useState(paysArriveId);
  const [etatDepartIdValue, setEtatDepartId] = useState(etatDepartId);
  const [etatArriveIdValue, setEtatArriveId] = useState(etatArriveId);
  const [villeDepartIdValue, setVilleDepartId] = useState(villeDepartId);
  const [villeArriveIdValue, setVilleArriveId] = useState(villeArriveId);
  const [paysDepartNomValue, setPaysDepartNom] = useState(paysDepartNom);
  const [paysArriveNomValue, setPaysArriveNom] = useState(paysArriveNom);
  const [etatDepartNomValue, setEtatDepartNom] = useState(etatDepartNom);
  const [etatArriveNomValue, setEtatArriveNom] = useState(etatArriveNom);
  const [villeDepartNomValue, setVilleDepartNom] = useState(villeDepartNom);
  const [villeArriveNomValue, setVilleArriveNom] = useState(villeArriveNom);
  const [saveCountryDepartValue, setSaveCountryDepart] =
    useState(saveCountryDepart);
  const [saveStateDepartValue, setSaveStateDepart] = useState(saveStateDepart);
  const [saveCityDepartValue, setSaveCityDepart] = useState(saveCityDepart);
  const [saveCountryArriveValue, setSaveCountryArrive] =
    useState(saveCountryArrive);
  const [saveStateArriveValue, setSaveStateArrive] = useState(saveStateArrive);
  const [saveCityArriveValue, setSaveCityArrive] = useState(saveCityArrive);
  const [selectedOption, setSelectedOption] = useState(onloadCurrency_);
  const [data, setData] = useState(datas[0]);
  const [canModify, setCanModify] = useState(false);
  const divToRemove = useRef(null);
  const mainDiv = useRef(null);

  const handleDatas = () => {
    setData({
      ...data,
      nom: voyageurName,
      dateDepart: dateDepartValue,
      dateArrive: dateArriveValue,
      kilosDispo: kilosDispoValue,
      prixKilo: prixKiloValue,
      contraintes: contraintesValue,
      description: descriptionValue,
      paysDepart: remplacerEspacesParTirets(paysDepartNomValue),
      paysArrive: remplacerEspacesParTirets(paysArriveNomValue),
      paysDepartId: paysDepartIdValue,
      paysArriveId: paysArriveIdValue,
      etatDepartId: etatDepartIdValue ? etatDepartIdValue : 0,
      etatArriveId: etatArriveIdValue ? etatArriveIdValue : 0,
      villeDepartId: villeDepartIdValue ? villeDepartIdValue : 0,
      villeArriveId: villeArriveIdValue ? villeArriveIdValue : 0,
      etatDepart: remplacerEspacesParTirets(etatDepartNomValue)
        ? remplacerEspacesParTirets(etatDepartNomValue)
        : remplacerEspacesParTirets(paysDepartNomValue)
        ? remplacerEspacesParTirets(paysDepartNomValue)
        : "fr",
      villeDepart: remplacerEspacesParTirets(villeDepartNomValue)
        ? remplacerEspacesParTirets(villeDepartNomValue)
        : remplacerEspacesParTirets(etatDepartNomValue)
        ? remplacerEspacesParTirets(etatDepartNomValue)
        : remplacerEspacesParTirets(paysDepartNomValue)
        ? remplacerEspacesParTirets(paysDepartNomValue)
        : "fr",
      villeArrive: remplacerEspacesParTirets(villeArriveNomValue)
        ? remplacerEspacesParTirets(villeArriveNomValue)
        : remplacerEspacesParTirets(etatArriveNomValue)
        ? remplacerEspacesParTirets(etatArriveNomValue)
        : remplacerEspacesParTirets(paysArriveNomValue)
        ? remplacerEspacesParTirets(paysArriveNomValue)
        : "fr",
      etatArrive: remplacerEspacesParTirets(etatArriveNomValue)
        ? remplacerEspacesParTirets(etatArriveNomValue)
        : remplacerEspacesParTirets(paysArriveNomValue)
        ? remplacerEspacesParTirets(paysArriveNomValue)
        : "fr",
      saveCountryDepart: saveCountryDepartValue,
      saveStateDepart: saveStateDepartValue,
      saveCityDepart: saveCityDepartValue,
      saveCountryArrive: saveCountryArriveValue,
      saveStateArrive: saveStateArriveValue,
      saveCityArrive: saveCityArriveValue,
      currency: selectedOption?.value,
      labelCurrency: selectedOption?.label,
      discutable: discutablesValue,
    });
  };

  useEffect(() => {
    if (id != "") {
      /*handleConfirmationReceived();*/
    }
  }, [id]);

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

  useEffect(() => {
    handleDatas();
  }, [
    paysDepartNomValue,
    etatDepartNomValue,
    villeDepartNomValue,
    paysDepartIdValue,
    etatDepartIdValue,
    villeDepartIdValue,
    villeArriveNomValue,
    villeArriveIdValue,
    etatArriveNomValue,
    etatArriveIdValue,
    paysArriveNomValue,
    paysArriveIdValue,
    voyageurName,
  ]);

  const handleAdd = async (e = null) => {
    if (e) {
      e.preventDefault();
      handleDatas();
      editAds(data);
    }
  };

  const editAds = (data) => {
    fetch(`http://192.168.1.10:5000/api/update-doc-datas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    fetch(`http://192.168.1.10:5000/api/delete-doc-datas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: _id.$oid,
      }),
    }).then((response) => {
      if (response.ok) {
        mainDiv.current.style.display = "none";
      } else {
        setSucces(false);
      }
    });
  }

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
                  className="block text-sm font-medium text-gray-500 dark:text-gray-500 "
                >
                  Nom du voyageur
                </label>
                <input
                  type="text"
                  id="name"
                  className="shadow-md w-60 sm:w-72 text-sm rounded-lg  text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none "
                  required
                  value={voyageurName}
                  onChange={(e) => {
                    setData({ ...data, nom: e.target.value });
                    setVoyageurName(e.target.value);
                  }}
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
                  defaultValue={saveCountryDepartValue}
                  countryid={paysDepartIdValue}
                  onChange={(e) => {
                    const functionsToCall = [
                      () => setPaysDepartNom(e.name),
                      () => setPaysDepartId(e.id),
                      () => setSaveCountryDepart(e),
                      () => handleDatas(),
                      () => console.log(e),
                      () =>
                        setData({
                          ...data,
                          paysDepart: remplacerEspacesParTirets(e.name),
                          paysDepartId: e.id,
                          saveCountryDepart: e,
                        }),
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
                  countryid={paysDepartIdValue}
                  defaultValue={saveStateDepartValue}
                  onChange={(e) => {
                    setEtatDepartNom(e.name);
                    setEtatDepartId(e.id);
                    setSaveStateDepart(e);
                    console.log(e);
                    setData({
                      ...data,
                      etatDepart: remplacerEspacesParTirets(e.name),
                      etatDepartId: e.id,
                      saveStateDepart: e,
                    });
                  }}
                  placeHolder="Etat ou departement"
                />
              </div>

              <div>
                <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                  Ville (départ)
                </p>
                <CitySelect
                  countryid={paysDepartIdValue}
                  stateid={etatDepartIdValue}
                  defaultValue={saveCityDepartValue}
                  onChange={(e) => {
                    setVilleDepartId(e.id);
                    setVilleDepartNom(e.name);
                    setSaveCityDepart(e);
                    setData({
                      ...data,
                      villeDepart: remplacerEspacesParTirets(e.name),
                      villeDepartId: e.id,
                      saveCityDepart: e,
                    });
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
                  className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                  type="date"
                  value={dateDepartValue || ""}
                  onChange={(e) => {
                    setDateDepartValue(e.target.value);
                    setData({ ...data, dateDepart: e.target.value });
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
                  value={kilosDispoValue || ""}
                  onChange={(e) => {
                    setKilosDispoValue(e.target.value);
                    setData({ ...data, kilosDispo: e.target.value });
                  }}
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
                  value={prixKiloValue || ""}
                  onChange={(e) => {
                    setPrixKiloValue(e.target.value);
                    setData({ ...data, prixKilo: e.target.value });
                  }}
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
                  value={discutablesValue || ""}
                  onChange={(e) => {
                    setDiscutablesValue(e.target.value);
                    setData({ ...data, discutables: e.target.value });
                  }}
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
                  value={descriptionValue || ""}
                  onChange={(e) => {
                    setDescriptionValue(e.target.value);
                    setData({ ...data, description: e.target.value });
                  }}
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
                  value={contraintesValue || ""}
                  onChange={(e) => {
                    setContraintesValue(e.target.value);
                    setData({ ...data, contraintes: e.target.value });
                  }}
                  type="text"
                />
              </div>
            </div>

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
                    defaultValue={saveCountryArriveValue}
                    required
                    countryid={paysArriveIdValue}
                    onChange={(e) => {
                      setPaysArriveId(e.id);
                      setPaysArriveNom(e.name);
                      setSaveCountryArrive(e);
                      setData({
                        ...data,
                        paysArriveId: e.id,
                        paysArrive: remplacerEspacesParTirets(e.name),
                        saveCountryArrive: e,
                      });
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
                    defaultValue={saveStateArriveValue}
                    countryid={paysArriveIdValue}
                    onChange={(e) => {
                      setEtatArriveId(e.id);
                      setEtatArriveNom(e.name);
                      setSaveStateArrive(e);
                      setData({
                        ...data,
                        etatArriveId: e.id,
                        etatArrive: remplacerEspacesParTirets(e.name),
                        saveStateArrive: e,
                      });
                    }}
                    placeHolder="Etat ou departement"
                  />
                </div>

                <div>
                  <p className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500">
                    Ville (Arrivée)
                  </p>
                  <CitySelect
                    defaultValue={saveCityArriveValue}
                    countryid={paysArriveIdValue}
                    style={{ width: "100%", height: "40px" }}
                    stateid={etatArriveIdValue}
                    onChange={(e) => {
                      setVilleArriveId(e.id);
                      setVilleArriveNom(e.name);
                      setSaveCityArrive(e);
                      setData({
                        ...data,
                        villeArriveId: e.id,
                        villeArrive: remplacerEspacesParTirets(e.name),
                        saveCityArrive: e,
                      });
                    }}
                    placeHolder="ville"
                  />
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500"
                  >
                    Date (arrivé)
                  </label>
                  <input
                    className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none "
                    type="date"
                    value={dateArriveValue || ""}
                    onChange={(e) => {
                      setDateArriveValue(e.target.value);
                      setData({ ...data, dateArrive: e.target.value });
                    }}
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
                  Mettre à jour
                </button>
                <button
                  onClick={() => setCanModify(false)}
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
          {succes ? null : (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-center">
              Une érreur est survenue veuillez réessayer
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="mb-2 flex justify-between text-sm font-medium text-gray-500 dark:text-gray-500"
            >
              Ville de départ :{" "}
              <strong>
                {villeDepartNomValue} ({paysDepartNomValue})
              </strong>
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
              Ville d'arrivée :{" "}
              <strong>
                {villeArriveNomValue} ({paysArriveNomValue})
              </strong>
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
              Modifier
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
