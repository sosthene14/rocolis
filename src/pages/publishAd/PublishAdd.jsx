import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navBar/NavBar";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import "./PublishAdd.css";
import SearchForm from "../../components/searchForm/SearchForm";
import Cookies from "universal-cookie";
import { useJwt, decodeToken, isExpired } from "react-jwt";

function PublishAdd({ datas }) {
  const [data, setData] = useState([]);
  const cookies = new Cookies(null, { path: "/" });
  const discutable = useRef();
  const [error, setError] = useState(false);
  const [succes, setSucces] = useState(false);

  function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const hanldeDatas = (name, e) => {
    setData({
      ...data,
      [name]: e.target.value,
      view: 0,
      discutable: discutable.current.value ? discutable.current.value : false,
    });
  };
  useEffect(() => {
    if (cookies.get("jwt") != undefined) {
      const decodedToken = decodeToken(cookies.get("jwt"));
      setData({ ...data, publishedBy: decodedToken.email });
    }
  }, []);
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/api/ads-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête");
      }
      const responseData = await response.json();
      setSucces(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Une erreur s'est produite :", error.message);
    }
  };

  return (
    <div>
      <NavBar />
      <div>
        <h1 className="detailed-ads-text" style={{ marginTop: "40px" }}>
          Ajouter une annonce
        </h1>

      </div>
      <SearchForm datas={datas} />
      <div>
        <div>
          <form
            onSubmit={(e) => {
              handleAdd(e);
            }}
          >
            <div style={{ marginTop: "40px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div className="detailed-ads-you">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    <span style={{ textAlign: "left" }}>
                      Nom du Voyageur:
                      <input
                        required
                        autoomplete="disabled"
                        className="input-modification"
                        type="text"
                        value={data.nom || ""}
                        onChange={(e) => hanldeDatas("nom", e)}
                        pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                        title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
                      />
                    </span>
                    <span>
                      Ville de départ:
                      <input
                        className="input-modification"
                        type="text"
                        value={data.depart || ""}
                        onChange={(e) => hanldeDatas("depart", e)}
                        required
                        title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
                      />
                    </span>
                    <span>
                      Date de départ:
                      <input
                        className="input-modification"
                        type="date"
                        value={data.dateVoyage || ""}
                        onChange={(e) => hanldeDatas("dateVoyage", e)}
                        required
                      />
                    </span>
                    <span>
                      Ville d'arrivée:
                      <input
                        className="input-modification"
                        type="text"
                        value={data.destination || ""}
                        onChange={(e) => hanldeDatas("destination", e)}
                        required
                        title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
                      />
                    </span>
                    <span style={{ textAlign: "left" }}>
                      Date d'arrivée:
                      <input
                        className="input-modification"
                        type="date"
                        value={data.dateArrive || ""}
                        onChange={(e) => hanldeDatas("dateArrive", e)}
                        required
                      />
                    </span>

                    <span>
                      Kilos dispo:
                      <input
                        className="input-modification"
                        type="number"
                        value={data.kilosDispo || ""}
                        onChange={(e) => hanldeDatas("kilosDispo", e)}
                        required
                      />
                    </span>

                    <span>
                      Prix du kg:
                      <input
                        className="input-modification"
                        type="number"
                        value={data.prixKilo || ""}
                        onChange={(e) => hanldeDatas("prixKilo", e)}
                        required
                      />
                    </span>

                    <span>
                      Discutable:
                      <select
                        className="input-modification"
                        required
                        ref={discutable}
                        value={data.discutable || ""}
                        onChange={(e) => hanldeDatas("discutable", e)}
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </span>

                    <span>
                      Description:
                      <textarea
                        value={data.description || ""}
                        onChange={(e) => hanldeDatas("description", e)}
                        required
                        className="input-modification"
                        type="text"
                      />
                    </span>
                    <span>
                      Contraintes:
                      <textarea
                        className="input-modification"
                        value={data.contraintes || ""}
                        onChange={(e) => hanldeDatas("contraintes", e)}
                        type="text"
                        required
                      />
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <button type="submit" className="pagination-btn">
                        Ajouter
                      </button>
                      <button
                        className="pagination-btn"
                        type="reset"
                        onClick={() => {
                          window.location.reload();
                        }}
                      >
                        Annuler
                      </button>
                    </div>

                    {succes ? (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          backgroundColor: "white",
                          padding: "20px",
                          borderRadius: "10px",
                          right: "47%",
                        }}
                      >
                        <p style={{ color: "green" }}>Succes</p>{" "}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div style={{}}>
        <FakeFooter />
      </div>
    </div>
  );
}

export default PublishAdd;
