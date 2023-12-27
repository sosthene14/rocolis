import React, { useState, useEffect } from "react";
import "./FilterDropDown.css";
import AnnonceMadeByYou from "../../pages/annonceMadeByYou/AnnonceMadeByYou";
import MyAdd from "../searchForm/myAdd/MyAdd";
import NavBar from "../navBar/NavBar";
import _ from "lodash";
import { ThreeCircles } from "react-loader-spinner";
import SearchForm from "../searchForm/SearchForm";
import { FakeFooter } from "../fakeFooter/FakeFooter";

const FilterDropdownV2 = ({ datas, email }) => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [emailExist, setEmailExist] = useState(true);
  const [dataUser, setDataUser] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
  };

  const sortByPriceHighToLow = (a, b) => b.prixKilo - a.prixKilo;
  const sortByPriceLowToHigh = (a, b) => a.prixKilo - b.prixKilo;
  const sortByDateRecentToOld = (a, b) =>
    new Date(b.dateDepart) - new Date(a.dateDepart);
  const sortByDateOldToRecent = (a, b) =>
    new Date(a.dateDepart) - new Date(b.dateDepart);
  const sortByKilosAvailable = (a, b) => b.kilosDispo - a.kilosDispo;

  useEffect(() => {
    if (email !== "") {
      setEmailExist(true);
    } else {
      setEmailExist(false);
    }
  }, [email]);

  useEffect(() => {
    if (emailExist) {
      go();
    }
  }, [email, data]);

  function go() {
    let results = _.filter(data, { publishedBy: email });
    if (results.length === 0) {
      setDataUser([]);
    } else {
      setDataUser(results);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (datas.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    setLoading(false);
    setData(datas);
  }, [datas]);

  const sortData = (filter) => {
    switch (filter) {
      case "priceHighToLow":
        return dataUser.sort(sortByPriceHighToLow);
      case "priceLowToHigh":
        return dataUser.sort(sortByPriceLowToHigh);
      case "dateRecentToOld":
        return dataUser.sort(sortByDateRecentToOld);
      case "dateOldToRecent":
        return dataUser.sort(sortByDateOldToRecent);
      case "kilosAvailable":
        return dataUser.sort(sortByKilosAvailable);
      default:
        return dataUser;
    }
  };

  const sortedData = sortData(selectedFilter);

  return (
    <>
      <NavBar />
      <h1 className="detailed-ads-text" style={{ marginTop: "40px" }}>
        Mes annonces
      </h1>
      <SearchForm datas={datas} />
      {loading ? (
        <div className="loader-div">
          <ThreeCircles
            height="70"
            width="70"
            color="#6C63FF"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
        </div>
      ) : (
        <>
          <div className="filter-div">
            <label htmlFor="filterDropdown"></label>
            <select
              className="shadow-md w-96 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              value={selectedFilter}
              onChange={handleFilterChange}
            >
              <option value="priceHighToLow">
                Prix (du plus haut au plus bas)
              </option>
              <option value="priceLowToHigh">
                Prix (du plus bas au plus haut)
              </option>
              <option value="dateRecentToOld">
                Date (plus récente à plus ancienne)
              </option>
              <option value="dateOldToRecent">
                Date (plus ancienne à plus récente )
              </option>
              <option value="kilosAvailable">
                Nombre de kilos disponibles
              </option>
            </select>
          </div>
          <br />
          <br />
          <div  className="flex flex-wrap justify-center gap-10">
            {sortedData.map((data, index) => (
              <div key={index}>
                <MyAdd
                  key={index}
                  datas={sortedData}
                  email={email}
                  description={data.description}
                  contraintes={data.contraintes}
                  kilosDispo={data.kilosDispo}
                  prixKilo={data.prixKilo}
                  dateDepart={data.dateDepart}
                  dateArrive={data.dateArrive}
                  saveCountryDepart={data.saveCountryDepart}
                  nom={data.nom}
                  saveStateDepart={data.saveStateDepart}
                  paysDepartId={data.paysDepartId}
                  paysArriveId={data.paysArriveId}
                  villeDepartId={data.villeDepartId}
                  villeArriveId={data.villeArriveId}
                  etatDepartId={data.etatDepartId}
                  etatArriveId={data.etatArriveId}
                  villeDepartNom={data.villeDepart}
                  villeArriveNom={data.villeArrive}
                  paysDepartNom={data.paysDepart}
                  paysArriveNom={data.paysArrive}
                  etatDepartNom={data.etatDepart}
                  etatArriveNom={data.etatArrive}
                  saveCityDepart={data.saveCityDepart}
                  saveCountryArrive={data.saveCountryArrive}
                  saveStateArrive={data.saveStateArrive}
                  saveCityArrive={data.saveCityArrive}
                  discutable={data.discutable}
                  onloadCurrency_={{
                    value: data.currency,
                    label: data.labelCurrency,
                  }}
                  _id={data._id}
                />
              </div>
            ))}
          </div>
          <div style={{}}>
            <FakeFooter />
          </div>
        </>
      )}
    </>
  );
};

export default FilterDropdownV2;
