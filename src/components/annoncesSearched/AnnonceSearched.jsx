import React from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";
import FilterDropdown from "../filterDropdown/FilterDropDown";
import images from "../../assets/images/images";
import NavBar from "../navBar/NavBar";
import { FakeFooter } from "../fakeFooter/FakeFooter";
import SearchForm from "../searchForm/SearchForm";

const AnnonceSearched = ({ datas }) => {
  const [avaibleRealDatas, setAvaibleRealDatas] = useState(false);
  const [avaibleSimilarDatas, setAvaibleSimilarDatas] = useState(false);
  const [seeSpiner, setSeeSpiner] = useState(true);
  const [bestResultsDatas, setBestresultsData] = useState([]);
  const [similarResultsDatas, setSimilarResultsData] = useState([]);
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false); // Added loading state

  const { depart, destination, departureDate } = useParams();

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    setSeeSpiner(true);
    if (datas.length === 0) {
        setSeeSpiner(true);
    } else {
      setSeeSpiner(false);
    }
    setSeeSpiner(false);
    setData(datas);
  }, [datas]);


  useEffect(() => {
    go();
  }, [destination, data]);

  function go() {
    let results = _.filter(data, {
      destination: destination,
      dateVoyage: departureDate,
      depart: depart,
    });
    setSeeSpiner(true);
    if (results.length === 0) {
      setAvaibleRealDatas(false);
      setSeeSpiner(false);
    } else {
      setAvaibleRealDatas(true);
      setSeeSpiner(false);
      setBestresultsData(results);
    }

    // Filtrer les résultats avec la même destination mais une date différente
    let low_results = _.filter(data, (voyage) => {
      return (
        voyage.destination.toLowerCase() === destination.toLowerCase() &&
        voyage.dateVoyage !== departureDate &&
        voyage.depart.toLowerCase() === depart.toLocaleLowerCase()
      );
    });
    if (low_results.length > 0) {
      setAvaibleSimilarDatas(true);
      setSeeSpiner(false);
      setSimilarResultsData(low_results);
    } else {
      setAvaibleSimilarDatas(false);
      setSeeSpiner(false);
    }
  }
  return (
    <div>
        
      <div style={{}}>
        <NavBar />
        <div>
             <SearchForm datas={datas} /> 
        </div>
      
      </div>
      
      <h1
        style={{ textAlign: "center", marginBottom: "50px", marginTop: "50px" }}
      >
        Meilleurs résultas
      </h1>
      {bestResultsDatas.length > 0 ? (
        <div>
          <FilterDropdown data={bestResultsDatas} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "80px",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>
            Aucune donnée n'a pu être trouvé pour les résultats identiques
          </h3>
          <img src={images.noData} style={{ width: "220px" }} />
        </div>
      )}

      {seeSpiner ? (
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
      ) : null}
      {isError && (
        <p style={{ color: "red", textAlign: "center" }}>
          Une erreur est survenue. Veuillez recharger la page.
        </p>
      )}
      <h1
        style={{ textAlign: "center", marginBottom: "50px", marginTop: "50px" }}
      >
        Résultats similaires
      </h1>
      {similarResultsDatas.length > 0 ? (
        <div>
          <FilterDropdown data={similarResultsDatas} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "80px",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>
            Aucune donnée n'a pu être trouvé pour les résultats simmilaires
          </h3>
          <img src={images.noData} style={{ width: "220px" }} />
        </div>
      )}
      <FakeFooter />
    </div>
  );
};

export default AnnonceSearched;
