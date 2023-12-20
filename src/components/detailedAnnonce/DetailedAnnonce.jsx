import React from "react";
import NavBar from "../navBar/NavBar";
import { FakeFooter } from "../fakeFooter/FakeFooter";
import "./DetailedAnnonce.css";
import images from "../../assets/images/images";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { ThreeCircles } from "react-loader-spinner";
import Cookies from "universal-cookie";
import SearchForm from "../searchForm/SearchForm";
import formatDate from "../formatDate/formatDate";
import { ObjectId } from "bson";
const DetailedAnnonce = ({ datas, email }) => {
  const [toogleNotifications, setToogleNotification] = useState(true);
  const [seeSpiner, setSeeSpiner] = useState(true);
  const [result, setResult] = useState([]);
  const [data, setData] = useState([]);
  const { _id } = useParams();
  const cookies = new Cookies(null, { path: "/" });
  const [documentId, setDocumentId] = useState("");
  const [userId, setUserId] = useState("");
  const [isError, setIsError] = useState(false); // Added loading state
  const objectId = new ObjectId(_id);
  const stringId = objectId.toString();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailPublishedBy, setEmailPublishedBy] = useState("");
  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (email != "") {
      getUserId(email);
      getUserName(email);
    }
  }, [email]);
  useEffect(() => {
    if (emailPublishedBy != "") {
      getSellerPhone(emailPublishedBy);
    }
  }, [emailPublishedBy]);
  useEffect(() => {
    if (documentId["$oid"] != "" && userId != "") {
      updateView(userId, documentId["$oid"]);
    }
  }, [documentId, userId]);
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
          setUserId(data["_id"]);
        });
      }
    });
  }
  function getSellerPhone(email) {
    fetch("http://127.0.0.1:5000/api/get-stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setPhoneNumber("+" + data["telephone"]);
        });
      }
    });
  }
  function getUserName(email) {
    fetch("http://127.0.0.1:5000/api/get-stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setUserName(data["prenom"]);
        });
      }
    });
  }
  const adsLinks = `http://localhost:5173${window.location.pathname}`;

  const message = `Bonjour je suis ${userName} et je suis intéressé par votre annonce: ${adsLinks}`;
  const encodedMessage = encodeURIComponent(message);
  function contactWhatsapp() {
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`);
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
    const results = data.filter((item) => item._id.$oid.toString() === _id);

    setSeeSpiner(true);
    if (results.length === 0) {
    } else {
      setDocumentId(results[0]["_id"]);
      setResult(results);
      setEmailPublishedBy(results[0]["publishedBy"]);
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

  function updateView(userId, documentId) {
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
              backgroundColor: "#f8f9fa",
              padding: "30px",
              borderRadius: "17px",
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
            }}
          >
            {result.map((voyageur) => (
              <div className="travel-detail-2" key={voyageur._id}>
                <span style={{ textAlign: "left" }}>
                  Nom du Voyageur : <span>{voyageur.nom}</span>
                </span>
                <span>
                  Ville de départ :{" "}
                  <span>
                    {voyageur.villeDepart.toLocaleLowerCase()} (
                    {voyageur.paysDepart})
                  </span>
                </span>
                <span>
                  Date de départ :{" "}
                  <span>{formatDate(voyageur.dateDepart)} </span>
                </span>
                <span style={{ textAlign: "left" }}>
                  Date d'arrivée :{" "}
                  <span>{formatDate(voyageur.dateArrive)}</span>
                </span>
                <span>
                  Ville d'arrivée :{" "}
                  <span>
                    {" "}
                    {voyageur.villeArrive.toLocaleLowerCase()} (
                    {voyageur.paysArrive})
                  </span>
                </span>
                <span>
                  Kilos dispo : <span> {voyageur.kilosDispo}</span>
                </span>
                <span>
                  Prix du kg :{" "}
                  <span>
                    {" "}
                    {voyageur.prixKilo} {voyageur.currency}
                  </span>
                </span>
                <span>
                  Discutable : <span> {voyageur.discutable}</span>
                </span>
                <span>
                  Contraintes :{" "}
                  <span>
                    {" "}
                    {voyageur.contraintes == null || voyageur.contraintes == ""
                      ? "Aucune"
                      : voyageur.contraintes}
                  </span>
                </span>

                <span>
                  Description :{" "}
                  <span>
                    {" "}
                    {voyageur.description == null || voyageur.description == ""
                      ? "Aucune"
                      : voyageur.description}
                  </span>
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
            <img src={images.OutgoingCall} className="contact-img w-14" />
            <img
              src={images.whatsapImage}
              className="contact-img w-14"
              onClick={() => contactWhatsapp()}
            />
          </div>
        </div>
      </div>
      <FakeFooter />
    </div>
  );
};

export default DetailedAnnonce;
