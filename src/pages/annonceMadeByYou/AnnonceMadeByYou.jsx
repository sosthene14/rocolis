import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import _, { set } from "lodash";

import "./AnnonceMadeByYou.css";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import Succes from "../../components/succes/succes";
import Error from "../../components/error/Error";
import Select from "react-select";

const AnnonceMadeByYou = ({ data }) => {
  const [datas, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const [isOpenArray, setIsOpenArray] = useState(
    new Array(datas.length).fill(false)
  );
  const [seeAllDetails, setSeeAllDetails] = useState(
    new Array(datas.length).fill(false)
  );
  const [disabledModification, setDisabledModification] = useState(
    new Array(datas.length).fill(false)
  );
  const [isSuccess, setIsSuccess] = useState(
    new Array(datas.length).fill(false)
  );
  const [isError, setIsError] = useState(new Array(datas.length).fill(false));
  useEffect(() => {
    setData(data);
  }, [data]);
  const [provisoirData, setProvisoirData] = useState([]);
  const [provisoirData2, setProvisoirData2] = useState([]);
  function handleDelete(index, e) {
    const newArray = [...isOpenArray];
    newArray[index] = !newArray[index];
    setIsOpenArray(newArray);
  }
  function handleSuccess(index) {
    const newArray = [...isSuccess];
    newArray[index] = !newArray[index];
    setIsSuccess(newArray);
  }
  function handleError(index) {
    const newArray = [...isError];
    newArray[index] = !newArray[index];
    setIsError(newArray);
  }

  function handleSeeAllDetails(index) {
    const newArray = [...seeAllDetails];
    newArray[index] = !newArray[index];
    setSeeAllDetails(newArray);
  }
  function handleDisabledModification(index) {
    const newArray = [...seeAllDetails];
    newArray[index] = !newArray[index];
    setDisabledModification(newArray);
  }
  const handleInputChange = (e, fieldName, index) => {
    const newValue = e.target.value;
    const updatedVoyageurs = [...datas];
    updatedVoyageurs[index][fieldName] = newValue;
    setData(updatedVoyageurs);
  };

  const deleteMenu = useRef();

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (
        deleteMenu.current &&
        !deleteMenu.current.contains(e.target) &&
        e.target.nodeName !== "HTML" &&
        e.target.className !== "pagination-btn"
      ) {
        for (let i = 0; i < isOpenArray.length; i++) {
          setIsOpenArray(new Array(datas.length).fill(false));
        }
      }
    });
  });

  const convertDate = (inputDate) => {
    const [day, month, year] = inputDate.split("/");
    const dateObject = new Date(`${year}-${month}-${day}`);
    const outputYear = dateObject.getFullYear();
    const outputMonth = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const outputDay = dateObject.getDate().toString().padStart(2, "0");
    const outputDate = `${outputYear}-${outputMonth}-${outputDay}`;
    return outputDate;
  };

  function go(_id, index) {
    setData((prevDatas) => prevDatas.filter((item) => item._id !== _id));
    setIsOpenArray((prevIsOpenArray) => {
      const newArray = [...prevIsOpenArray];
      newArray[index] = false; // Assuming you want to close the delete menu
      return newArray;
    });
  }

  useEffect(() => {}, [datas]);
  function updateData(e, index) {
    if (e.target.innerText === "mettre à jour") {
      setProvisoirData2(datas[index]);
      editAds(index);
    } else if (e.target.innerText === "modifier") {
      setProvisoirData(datas[index]);
    }
  }

  const editAds = (index) => {
    fetch(`http://127.0.0.1:5000/api/update-doc-datas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datas[index]),
    }).then((response) => {
      if (response.ok) {
        handleSuccess(index);
        setTimeout(() => {
          setIsSuccess((prevIsSuccess) => {
            const newArray = [...prevIsSuccess];
            newArray[index] = false;
            return newArray;
          });
        }, 1000);
      } else {
        handleError(index);
        setTimeout(() => {
          setIsError((prevIsError) => {
            const newArray = [...prevIsError];
            newArray[index] = false;
            return newArray;
          });
        }, 1000);
      }
    });
  };

  const removeAds = (index) => {
    fetch(`http://127.0.0.1:5000/api/delete-ads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: datas[index]._id }),
    }).then((response) => {
      if (response.ok) {
        console.log("Data deleted successfully");
      } else {
        console.log("Failed to delete datas");
      }
    });
  };

  const deleteAds = (id, index, e) => {
    removeAds(index);
    go(id, index);
  };
  const currencyOptions = [
    { value: "XAF", label: "XAF (CFA)" },
    { value: "XOF", label: "XOF (CFA)" },
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
  ];
  useEffect(() => {
    if (selectedOption !== null) {
      localStorage.setItem("selectedOption", JSON.stringify(selectedOption));
    }
  }, [selectedOption]);
  return (
    <div>
      <div>
        <div style={{ marginTop: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {datas.map((voyageur, index) => {
              return (
                <div key={index} className="detailed-ads-you">
                  <div
                    className={
                      seeAllDetails[index]
                        ? "travel-detail-true"
                        : "travel-detail"
                    }
                  >
                    <span style={{ textAlign: "left" }}>
                      Nom du Voyageur:
                      <input
                        required
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="text"
                        value={voyageur.nom}
                        onChange={(e) => handleInputChange(e, "nom", index)}
                      />
                    </span>

                    {isSuccess[index] ? <Succes /> : null}

                    {isError[index] ? (
                      <div>
                        <Error />
                      </div>
                    ) : null}

                    <span>
                      Ville de départ:{" "}
                      <input
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="text"
                        value={voyageur.villeDepart}
                        onChange={(e) => handleInputChange(e, "villeDepart", index)}
                      />
                    </span>
                    <span>
                      Date de départ:{" "}
                      <input
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="date"
                        value={convertDate(voyageur.dateDepart)}
                        onChange={(e) =>
                          handleInputChange(e, "dateDepart", index)
                        }
                      />
                    </span>
                    <span>
                      Ville d'arrivée:{" "}
                      <input
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="text"
                        value={voyageur.villeArrive}
                        onChange={(e) =>
                          handleInputChange(e, "villeArrive", index)
                        }
                      />
                    </span>
                    <span style={{ textAlign: "left" }}>
                      Date d'arrivée:{" "}
                      <input
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="date"
                        value={convertDate(voyageur.dateArrive)}
                        onChange={(e) => {
                          handleInputChange(e, "dateArrive", index);
                        }}
                      />
                    </span>

                    <span>
                      Kilos dispo:{" "}
                      <input
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="number"
                        value={voyageur.kilosDispo}
                        onChange={(e) =>
                          handleInputChange(e, "kilosDispo", index)
                        }
                      />
                    </span>

                    <span>
                      Prix du kg:{" "}
                      <input
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="number"
                        style={{ width: "100px" }}
                        value={voyageur.prixKilo}
                        onChange={(e) =>
                          handleInputChange(e, "prixKilo", index)
                        }
                      />
                      <Select
                        required
                        className="input-modification--"
                        defaultValue={JSON.parse(
                          localStorage.getItem("selectedOption")
                        )}
                        onChange={setSelectedOption}
                        options={currencyOptions}
                      />
                    </span>

                    <span>
                      Discutable:{" "}
                      <select
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        value={voyageur.discutable}
                        onChange={(e) =>
                          handleInputChange(e, "discutable", index)
                        }
                      >
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </span>

                    <span>
                      Description:{" "}
                      <textarea
                        className="input-modification"
                        disabled={!disabledModification[index]}
                        type="text"
                        value={voyageur.description}
                        onChange={(e) =>
                          handleInputChange(e, "description", index)
                        }
                      />
                    </span>
                    <span>
                      Contraintes:{" "}
                      <textarea
                        className="input-modification"
                        type="text"
                        value={voyageur.contraintes}
                        disabled={!disabledModification[index]}
                        onChange={(e) => {
                          handleInputChange(e, "contraintes", index);
                        }}
                      />
                    </span>
                  </div>
                  <div>
                    <div
                      ref={deleteMenu}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "20px",
                      }}
                    >
                      <button
                        type="submit"
                        className="pagination-btn"
                        onClick={(e) => [
                          handleSeeAllDetails(index),
                          handleDisabledModification(index),
                          updateData(e, index),
                        ]}
                      >
                        {seeAllDetails[index] ? "mettre à jour" : "modifier"}
                      </button>
                      <button
                        onClick={(e) => {
                          handleDelete(index, e);
                        }}
                        className="pagination-btn"
                      >
                        supprimer
                      </button>
                    </div>
                    <div
                      className={
                        isOpenArray[index]
                          ? "realy-delete"
                          : "realy-delete-none"
                      }
                    >
                      <p>Voulez vous vraiment supprimer ?</p>
                      <button
                        className="pagination-btn"
                        onClick={(e) => {
                          deleteAds(voyageur._id, index, e);
                        }}
                      >
                        Oui
                      </button>
                      <button
                        className="pagination-btn"
                        onClick={(e) => {
                          setIsOpenArray((prev) => {
                            const newIsOpenArray = [...prev];
                            newIsOpenArray[index] = false;
                            return newIsOpenArray;
                          });
                        }}
                      >
                        Non
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            {datas.length === 0 ? (
              <p style={{ textAlign: "center", color: "red" }}>
                {" "}
                Il n'y a pas encore d'annonces disponibles
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "185px" }}>
        <FakeFooter />
      </div>
    </div>
  );
};

export default AnnonceMadeByYou;
