import React, { useState } from "react";
import "./Admin.css";
import AdminHandling from "./AdminHandling";
import bcrypt from "bcryptjs";

// Fonction pour hasher un mot de passe côté client

const Admin = ({ verifiedAds, email }) => {
  const [code, setCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  const checkPwd = () => {
    const hashedPwd = bcrypt.hashSync(code, 10);

    fetch(`http://192.168.1.11:5000/api/check-admin-pwd`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pwd: hashedPwd }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("La requête POST a échoué.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.result === true) {
          setIsCodeCorrect(true);
        }
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  };

  const handleAccess = () => {
    checkPwd();
  };

  return (
    <div className="admin-container">
      {isCodeCorrect ? (
        <div className="admin-content">
          <AdminHandling verifiedAds={verifiedAds} />
        </div>
      ) : (
        <div className="admin-form">
          <h2>Entrez le code pour accéder à la page admin :</h2>
          <input
            type="password"
            value={code}
            onChange={handleCodeChange}
            placeholder="Code d'accès"
          />
          <button
            onClick={handleAccess}
            style={{ backgroundColor: "#6C63FF" }}
            className="text-white mb-5 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
          >
            Accéder
          </button>
          {code !== "" && !isCodeCorrect && (
            <p className="error-message">Code incorrect. Veuillez réessayer.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
