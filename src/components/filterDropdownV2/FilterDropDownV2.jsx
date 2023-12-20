import React, { useState, useEffect } from "react";
import "./FilterDropDown.css";
import AnnonceMadeByYou from "../../pages/annonceMadeByYou/AnnonceMadeByYou";
import NavBar from "../navBar/NavBar";
import _ from "lodash";
import { ThreeCircles } from "react-loader-spinner";

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
              id="filterDropdown"
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
          <AnnonceMadeByYou data={sortedData} />
        </>
      )}
    </>
  );
};

export default FilterDropdownV2;
