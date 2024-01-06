import React from "react";
import formatDate from "../../components/formatDate/formatDate";
import { useState } from "react";

function GetAllNonVerifiedAd({ ads, email }) {
  const [token, setToken] = useState("");
  function updateValided(_id, index) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ document_id: _id }),
    };
    fetch("http://192.168.1.11:5000/api/verified-ads", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data["response"]) {
          alert("L'annonce a bien été modifié");
          sendPublicationSuccess(index);
        } else {
          alert("L'annonce n'a pas été modifié");
        }
      })
      .catch((error) => {
        alert("Token invalide");
        console.error("Error:", error);
      });
  }
  const sendPublicationSuccess = (index) => {
    fetch("http://192.168.1.11:5000/api/send-confirmation-to-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: ads[index].publishedBy,
        link: `http://localhost:5173/searched/${ads[
          index
        ].villeDepart.toLocaleLowerCase()}/${ads[
          index
        ].villeArrive.toLocaleLowerCase()}/${ads[index].dateDepart}`,
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("L'email a bien été envoyé");
      return response.json();
    });
  };
  const sendPublicationNonSuccess = (index) => {
    fetch("http://192.168.1.11:5000/api/send-invalided-ads-to-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: ads[index].publishedBy,
      }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("L'email a bien été envoyé");
      return response.json();
    });
  };
  return (
    <div>
      Total des annonces non-verifiées: {ads.length}
      <input
        className="input"
        placeholder="Token"
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      {ads.map((annonce, index) => (
        <div key={annonce._id["$oid"]}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              gap: "20px",
              textAlign: "left",
              flexDirection: "column",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              padding: "20px",
            }}
          >
            <p>Id: {annonce._id["$oid"]}</p>
            <p>Nom: {annonce.nom}</p>
            <p>Date de Voyage: {formatDate(annonce.dateDepart)}</p>
            <p>
              Ville de Départ: {annonce.villeDepart} ({annonce.paysDepart})
            </p>
            <p>
              Ville d'Arrivée: {annonce.villeArrive} ({annonce.paysArrive})
            </p>
            <p>Date d'Arrivée: {formatDate(annonce.dateArrive)}</p>
            <p>
              Contraintes:{" "}
              {annonce.contraintes == null || annonce.contraintes == ""
                ? "Aucune"
                : annonce.contraintes}
            </p>
            <p>
              Description:{" "}
              {annonce.description == null || annonce.description == ""
                ? "Aucune"
                : annonce.description}
            </p>
            <p>Discutable: {annonce.discutable}</p>
            <p>Validé: {String(annonce.isValided)}</p>
            <p>Kilos Disponibles: {annonce.kilosDispo}</p>
            <p>
              Prix par Kilogramme: {annonce.prixKilo} {annonce.currency}
            </p>
            <p>Publié par: {annonce.publishedBy}</p>
            <p>Vue: {annonce.view}</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="btn-validate"
              onClick={() => {
                updateValided(annonce._id["$oid"], index);
              }}
            >
              valider
            </button>
            <button
              className="btn-validate w-[100px] h-[40px]"
              onClick={() => sendPublicationNonSuccess(index)}
              style={{ marginLeft: "10px" }}
            >
              Ne peut etre validée
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GetAllNonVerifiedAd;
