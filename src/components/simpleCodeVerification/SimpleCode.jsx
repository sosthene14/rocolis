import { method } from "lodash";
import React, { useEffect, useState, useRef } from "react";
import "./SimpleCode.css";
import bcrypt from "bcryptjs";
import handleJWT from "../handleJWT/JWT";

const CodeVerificationMessage = ({ email, onSendData }) => {
  const [code, setCode] = useState("");
  const [canModify, setCanModify] = useState(true);
  const codeInput = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (bcrypt.compareSync(codeInput.current.value,code) && codeInput.current.value.trim() != "") {
      onSendData(true);
      setCanModify(true);
    } else {
      onSendData(false);
      setCanModify(false);
    }
  };
  useEffect(() => {
    if (email != "") {
        getValidationCode();
    }
  }, [email]);
  const [userMail, jwtToken] = handleJWT();
  const getValidationCode = () => {
    fetch(`http://192.168.1.11:5000/api/changing-information/${userMail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        email: email,
      }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setCode(data.response);

        });
      }
    });
  };

  const divStyle = {
    position: "absolute",
    top: "140%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#E5E5E5",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
  };

  return (
    <div style={divStyle}>
      <p className="text-data-mod">
        Pour modifier vos données sensibles, veuillez entrer le code reçu par
        e-mail :
      </p>
      <form onSubmit={handleSubmit}>
        <input
          ref={codeInput}
          type="text"
          style={{
            marginTop: "15px",
            border: "none",
            outline: "none",
            height: "30px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        />
        <br />
        <span style={{ color: "red",textAlign: "center",fontSize: "12px" }}>{canModify ? "" : "Code incorrect"}</span><br/>
        <button
          type="submit"
          style={{ backgroundColor: "#6C63FF" }}
          className="vue-ensemble-btn"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Valider
        </button>
      </form>
      {/* Ajoutez ici le champ d'entrée du code et le bouton de soumission */}
    </div>
  );
};

export default CodeVerificationMessage;
