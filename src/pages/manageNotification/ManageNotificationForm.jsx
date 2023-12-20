import React from "react";
import "./ManageNotification.css";

import { useState, useEffect } from "react";
import Selector from "../publishAd/Selector";
import { Country, State, City } from "country-state-city";

const ManageNotificationForm = ({ addNotifications }) => {
  const [villeDepartValue, setVilleDepartValue] = useState("");
  const [villeArriveValue, setVilleArriveValue] = useState("");
  const [dateDepartValue, setDateDepartValue] = useState("");
  const [dateArriveeValue, setDateArriveeValue] = useState("");
  const [indexOfDepartCountryValue, setIndexOfDepartCountryValue] = useState(0);
  const [indexOfArriveCountryValue, setIndexOfArriveCountryValue] = useState(0);
  const [indexOfDepartStateValue, setIndexOfDepartStateValue] = useState(0);
  const [indexOfArriveStateValue, setIndexOfArriveStateValue] = useState(0);
  const [indexOfDepartCityValue, setIndexOfDepartCityValue] = useState(0);
  const [indexOfArriveCityValue, setIndexOfArriveCityValue] = useState(0);
  const [countryDepartNameValue, setCountryDepartNameValue] = useState("");
  const [countryArriveNameValue, setCountryArriveNameValue] = useState("");
 

  const [succes, setSucces] = useState(false);

  let countryData = Country.getAllCountries();
  let countryData2 = Country.getAllCountries();
  const [stateData, setStateData] = useState();
  const [cityData, setCityData] = useState();

  const [stateData2, setStateData2] = useState();
  const [cityData2, setCityData2] = useState();

  const [country, setCountry] = useState(countryData[0]);
  const [state, setState] = useState();
  const [city, setCity] = useState();

  const [country2, setCountry2] = useState(countryData2[0]);
  const [state2, setState2] = useState();
  const [city2, setCity2] = useState();

  useEffect(() => {
    setCountryDepartNameValue(country?.name);
    setStateData(State.getStatesOfCountry(country?.isoCode));
    setIndexOfDepartCountryValue(countryData.indexOf(country));
  }, [country]);

  useEffect(() => {
    setCountryArriveNameValue(country2?.name);
    setStateData2(State.getStatesOfCountry(country2?.isoCode));
    setIndexOfArriveCountryValue(countryData2.indexOf(country2));
  }, [country2]);

  useEffect(() => {
    setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
    if (stateData) {
      setIndexOfDepartStateValue(stateData.indexOf(state));
    }
  }, [state]);

  useEffect(() => {
    setCityData2(City.getCitiesOfState(country2?.isoCode, state2?.isoCode));
    if (stateData2) {
      setIndexOfArriveStateValue(stateData2.indexOf(state2));
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
      setIndexOfDepartCityValue(cityData.indexOf(city));
    }
  }, [city]);
  useEffect(() => {
    if (cityData2) {
      setIndexOfArriveCityValue(cityData2.indexOf(city2));
    }
  }, [city2]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addNotifications(
      removeAccents(villeDepartValue),
      removeAccents(villeArriveValue),
      dateDepartValue,
      dateArriveeValue,
      indexOfDepartCountryValue,
      indexOfArriveCountryValue,
      countryDepartNameValue,
      countryArriveNameValue,
      indexOfDepartStateValue,
      indexOfArriveStateValue,
      indexOfDepartCityValue,
      indexOfArriveCityValue
    );
    setDateDepartValue("");
    setDateArriveeValue("");
  };
  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  useEffect(() => {
    if (cityData && cityData.length > 0) {
      setVilleDepartValue(city.name);
    } else if (stateData && stateData.length > 0) {
      setVilleDepartValue(state.name);
    } else {
      setVilleDepartValue(country.name);
    }
  }, [city, state, country]);
  useEffect(() => {
    if (cityData2 && cityData2.length > 0) {
      setVilleArriveValue(city2.name);
    } else if (stateData2 && stateData2.length > 0) {
      setVilleArriveValue(state2.name);
    } else {
      setVilleArriveValue(country2.name);
    }
  }, [city2, state2, country2]);
  return (
    <div>
      <form
        className="flex flex-wrap mx-20 justify-center gap-5"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div
          className="w-96 mx-auto flex flex-col gap-5 pb-10 items-center rounded-xl pt-10 px-10 shadow-md"
          style={{
            backgroundColor: "#f8f9fa",
          }}
        >
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
              <Selector data={cityData} selected={city} setSelected={setCity} />
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-500 dark:text-gray-500"
            >
              Date départ (facultative)
            </label>
            <input
              className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none "
              type="date"
              value={dateDepartValue}
              onChange={(e) => {
                setDateDepartValue(e.target.value);
              }}
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
                data={countryData}
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
                Date d'arrivée (facultative)
              </p>
              <input
                className="shadow-md w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                type="date"
                value={dateArriveeValue}
                onChange={(e) => setDateArriveeValue(e.target.value)}
              />
            </div>
            <button
              type="submit"
              style={{ backgroundColor: "#6C63FF" }}
              className="text-white mb-5 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
            >
              {"Ajouter"}
            </button>
          </div>
        </div>
      </form>
      ;
    </div>
  );
};

export default ManageNotificationForm;
