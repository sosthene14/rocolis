import React from "react";
import NavBar from "../navBar/NavBar";
import { FakeFooter } from "../fakeFooter/FakeFooter";
import "./DetailedAnnonce.css";
import images from "../../assets/images/images";
import { Button, DatePicker, Switch } from "antd";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { ThreeCircles } from "react-loader-spinner";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import SearchForm from "../searchForm/SearchForm";

const DetailedAnnonce = ({ datas }) => {
  const [toogleNotifications, setToogleNotification] = useState(true);
  const [seeSpiner, setSeeSpiner] = useState(true);
  const [result, setResult] = useState([]);
  const [data, setData] = useState([]);
  const { _id } = useParams();
  const cookies = new Cookies(null, { path: "/" });
  const [documentId, setDocumentId] = useState("");
  const [userId, setUserId] = useState("");
  const [isError, setIsError] = useState(false); // Added loading state

  const handleToggle = () => {
    setToogleNotification(!toogleNotifications);
  };

  useEffect(() => {
    if (cookies.get("jwt")) {
      const getCockie = cookies.get("jwt");
      const decodedToken = decodeToken(getCockie);
      if (decodedToken.email) {
        getUserId(decodedToken.email);
      }
    }
  }, []);
  useEffect(() => {

    if (documentId != "") {
      
      updateView();
    }
  }, [documentId,userId]);
  function getUserId(email) {
    fetch("http://127.0.0.1:5000/api/get-user-id", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
          setUserId(data._id);
        });
      }
    });
  }
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
    if (_id != "" && data.length > 0) {
      go();
    }
  }, [_id, data]);

  function go() {
    let results = _.filter(data, { _id: _id });
    setSeeSpiner(true);
    if (results.length === 0) {
    } else {
      setDocumentId(results[0]["_id"]);
      setResult(results);
      console.log(results);
    }
    setSeeSpiner(false);
  }

  function getPublishedBy(email) {
    fetch("http://127.0.0.1:5000/api/get-user-name", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
        });
      }
    });
  }

  function updateView() {
    fetch("http://127.0.0.1:5000/api/add-who-seen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: userId, document_id: documentId }),
    }).then((response) => {
      if (response.ok) {
      } else {
      }
    });
  }
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <NavBar />
      <SearchForm datas={datas} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          gap: "50px",
          marginTop: "40px",
        }}
      >
        <div>
          <h1 className="detailed-ads-text">Détails de l'annonce</h1>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img src={images.detail} className="detail-image-annonce" />
        </div>
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
        ) : (
          <div
            style={{
              width: "400px",
              margin: "auto",
              backgroundColor: "#E5E5E5",
              padding: "30px",
              borderRadius: "17px",
            }}
          >
            {result.map((voyageur) => (
              <div className="travel-detail-2" key={voyageur._id}>
                <span style={{ textAlign: "left" }}>
                  Nom du Voyageur : <span>{voyageur.nom}</span>
                </span>
                <span>
                  Ville de départ : <span>{voyageur.depart} </span>
                </span>
                <span>
                  Date de départ : <span>{formatDate(voyageur.dateVoyage)} </span>
                </span>
                <span style={{ textAlign: "left" }}>
                  Date d'arrivée : <span>{formatDate(voyageur.dateArrive)}</span>
                </span>
                <span>
                  Ville d'arrivée : <span> {voyageur.destination}</span>
                </span>
                <span>
                  Kilos dispo : <span> {voyageur.kilosDispo}</span>
                </span>
                <span>
                  Prix du kg : <span> {voyageur.prixKilo}</span>
                </span>
                <span>
                  Contraintes : <span> {voyageur.contraintes}</span>
                </span>
                <span>
                  Discutable : <span> {voyageur.discutable}</span>
                </span>
                <span>
                  Description : <span> {voyageur.description}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <h4 className="contacter-vendeur">Contacter le vendeur</h4>
          <div style={{ display: "flex", gap: "15px" }}>
            <img src={images.OutgoingCall} className="contact-img" />
            <img src={images.whatsapImage} className="contact-img" />
          </div>
        </div>
      </div>
      <FakeFooter />
    </div>
  );
};

export default DetailedAnnonce;
