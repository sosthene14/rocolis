import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/navBar/NavBar";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import "./ManageNotification.css";
import images from "../../assets/images/images";

function ManageNotification() {
  const [inputValues, setInputValues] = useState([
    { depart: "", destination: "" },
  ]);
  const [data, setData] = useState([]);
  const depart = useRef();
  const dest = useRef();
  const [dataArray, setDataArray] = useState([]);
  const handleAddInput = () => {
    const newInput = {
      depart: depart.current.value,
      destination: dest.current.value,
    };
    setDataArray((prevDataArray) => [...prevDataArray, newInput]);
    setInputValues([...inputValues, { depart: "", destination: "" }]);
  };
  useEffect(() => {
    console.log(dataArray);
    setData(dataArray[0]);
    
  }, [dataArray]);
  
  const updateInputValue = (index, field, value) => {
    const newValues = [...inputValues];
    newValues[index][field] = value;
    setInputValues(newValues);
  };

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
      <div
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        {inputValues.map((value, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              marginTop: "17px",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <input
                ref={depart}
                type="text"
                value={value.depart}
                placeholder="Ville de départ"
                style={{
                  width: "150px",
                  height: "30px",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                onChange={(e) =>
                  updateInputValue(index, "depart", e.target.value)
                }
              />
            </div>
            <div>
              <img src={images.Arrow} style={{ width: "30px" }} />
            </div>
            <div>
              {" "}
              <input
                ref={dest}
                type="text"
                value={value.destination}
                placeholder="Ville d'arrivée"
                style={{
                  width: "150px",
                  height: "30px",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
                onChange={(e) =>
                  updateInputValue(index, "destination", e.target.value)
                }
              />
            </div>
            <div>
              <img src={images.Arrow} style={{ width: "30px" }} />
            </div>
            <div style={{ marginLeft: "10px", marginTop: "-40px" }}>
              <label className="label-search">
                <span
                  style={{
                    fontSize: "14px",
                    color: "#969696",
                    marginTop: "15px",
                  }}
                >
                  Facultative
                </span>
                <input
                  type="date"
                  className={"date-input_"}
                  required
                  style={{ marginTop: "-15px" }}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn-add-notification" onClick={handleAddInput}>
          Ajouter
        </button>
      </div>

      <FakeFooter />
    </div>
  );
}

export default ManageNotification;
