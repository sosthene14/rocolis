import React from "react";
import "./ManageNotification.css";
import NavBar from "../../components/navBar/NavBar";
import { useState } from "react";

const ManageNotificationForm = ({ addNotifications }) => {
  const [villeDepart, setVilleDepart] = useState("");
  const [villeArrive, setVilleArrive] = useState("");
  const [dateDepartValue, setDateDepartValue] = useState("");
  const [dateArriveeValue, setDateArriveeValue] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    addNotifications(
      removeAccents(villeDepart),
      removeAccents(villeArrive),
      dateDepartValue,
      dateArriveeValue
    );
    setVilleDepart("");
    setVilleArrive("");
    setDateDepartValue("");
    setDateArriveeValue("");
  };
  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  return (
    <div>
      <NavBar />
      <h1 className="detailed-ads-text" style={{ marginTop: "40px" }}>
        Centre de notifications
      </h1>
      <p className="p-notifications">
        Ici, vous pouvez personnaliser les notifications que vous souhaitez
        recevoir. Des mails vous seront envoyés lorsque des annonces
        correspondant à vos notifications seront disponibles.
      </p>
      <br />
      <br />
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="flex justify-center gap-5">
          <div>
            <input
              className="shadow-md w-40  text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              type="text"
              required
              placeholder="Ville de départ"
              value={villeDepart}
              onChange={(e) => setVilleDepart(e.target.value)}
            />
          </div>

          <div>
            <input
              className="shadow-md w-40  text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              type="text"
              required
              placeholder="Ville d'arrivée"
              value={villeArrive}
              onChange={(e) => setVilleArrive(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "-40px" }}>
            <label className="label-search">
              <span
                style={{
                  fontSize: "14px",
                  color: "#969696",
                  marginTop: "15px",
                }}
              >
                Date Départ (Facultatif)
              </span>
              <input
                type="date"
                className="shadow-md w-40  text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                value={dateDepartValue}
                style={{ marginTop: "-15px" }}
                onChange={(e) => setDateDepartValue(e.target.value)}
              />
            </label>
          </div>
          <div style={{ marginTop: "-40px" }}>
            <label className="label-search">
              <span
                style={{
                  fontSize: "14px",
                  color: "#969696",
                  marginTop: "15px",
                }}
              >
                Date Arrivée (Facultatif)
              </span>
              <input
                type="date"
                className="shadow-md w-40  text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                value={dateArriveeValue}
                style={{ marginTop: "-15px" }}
                onChange={(e) => setDateArriveeValue(e.target.value)}
              />
            </label>
          </div>
          <div >
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
