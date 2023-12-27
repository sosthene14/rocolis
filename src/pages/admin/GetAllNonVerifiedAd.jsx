import React from "react";
import formatDate from "../../components/formatDate/formatDate";

function GetAllNonVerifiedAd({ ads,email }) {
    
  function updateValided(_id,index) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document_id: _id }),
    };
    fetch("http://192.168.1.10:5000/api/update-is-valided", requestOptions)
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
        console.error("Error:", error);
      });
  }
  const sendPublicationSuccess = (index) => {
      fetch("http://192.168.1.10:5000/api/send-confirmation-to-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email:ads[index].publishedBy,
            link:`http://localhost:5173/searched/${ads[index].villeDepart.toLocaleLowerCase()}/${ads[index].villeArrive.toLocaleLowerCase()}/${ads[index].dateDepart}`,
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert("L'email a bien été envoyé");
        window.location.reload();
        return response.json();
      })
  }
  return (
    <div>
      Total des annonces non-verifiées: {ads.length}
      {ads.map((annonce, index) => (
        <div  key={annonce._id["$oid"]}>
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
            <p>Ville de Départ: {annonce.villeDepart} ({annonce.paysDepart})</p>
            <p>Ville d'Arrivée: {annonce.villeArrive} ({annonce.paysArrive})</p>
            <p>Date d'Arrivée: {formatDate(annonce.dateArrive)}</p>
            <p>Contraintes: {annonce.contraintes == null || annonce.contraintes == "" ? "Aucune": annonce.contraintes}</p>
            <p>Description: {annonce.description == null || annonce.description == "" ? "Aucune" : annonce.description}</p>
            <p>Discutable: {annonce.discutable}</p>
            <p>Validé: {String(annonce.isValided)}</p>
            <p>Kilos Disponibles: {annonce.kilosDispo}</p>
            <p>Prix par Kilogramme: {annonce.prixKilo} {annonce.currency}</p>
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
          </div>
        </div>
      ))}
    </div>
  );
}

export default GetAllNonVerifiedAd;
