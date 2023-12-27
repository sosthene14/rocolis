import React, { useEffect } from "react";
import GetAllUsers from "./GetAllUsers";
import { useState } from "react";
import GetAllNonVerifiedAd from "./GetAllNonVerifiedAd";
import GetAllVerifiedAd from "./GetAllVerifiedAd";

function AdminHandling({ verifiedAds,email }) {
  const [seeWhat, setSeeWhat] = useState("");
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [unverifiedAds, setUnverifiedAds] = useState([]);

  useEffect(() => {
    getAllDatas("http://192.168.1.10:5000/api/get-all-user");
  }, [setUsers]);
  useEffect(() => {
    setAds(verifiedAds);
  });
  useEffect(() => {
    getAllUnverifiedAds("http://192.168.1.10:5000/api/get-invalided-ads");
  },[setUnverifiedAds])

  function getAllUnverifiedAds(api) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(api, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUnverifiedAds(data["invalided-ads"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function getAllDatas(api) {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(api, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data["users"]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <button
            className="btn-validate"
            style={{ height: "50px" }}
            onClick={() => setSeeWhat("users")}
          >
            Utilisateurs
          </button>
        </div>
        <div>
          <button
            className="btn-validate"
            style={{ height: "50px" }}
            onClick={() => setSeeWhat("verified-ads")}
          >
            Annonces vérifiés
          </button>
        </div>
        <div>
          <button className="btn-validate" style={{ height: "50px" }} onClick={() => setSeeWhat("unverified-ads")}> 
            Annonces non-verifiées
          </button>
        </div>
      </div>
      {seeWhat === "users" ? (
        <div style={{ marginTop: "20px" }}>
          total users: {users.length}
          {users.map((user) => (
            <GetAllUsers key={user._id["$oid"]} user={user} />
          ))}
        </div>
      ) : null}
      {seeWhat === "verified-ads" ? (
        <div>
          <GetAllVerifiedAd ads={ads} />
        </div>
      ) : null}
      {
        seeWhat === "unverified-ads" && <GetAllNonVerifiedAd ads={unverifiedAds} email={email} />
      }
    </div>
  );
}

export default AdminHandling;
