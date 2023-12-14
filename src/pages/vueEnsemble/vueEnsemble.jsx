import React from "react";
import NavBar from "../../components/navBar/NavBar";
import images from "../../assets/images/images";
import "./vueEnsemble.css";
import Cookies from "universal-cookie";
import { decodeToken } from "react-jwt";
import { useState, useEffect, useRef } from "react";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import _ from "lodash";
import { ThreeCircles } from "react-loader-spinner";
import CodeVerificationMessage from "../../components/simpleCodeVerification/SimpleCode";
import { isValidPhoneNumber } from "react-phone-number-input";

const VueEnsemble = ({datas}) => {
  const cookies = new Cookies(null, { path: "/" });
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [viewNumber, setViewNumber] = useState(0);
  const [email, setEmail] = useState("");
  const [canModify, setCanModify] = useState(false);
  const [seeModifyOption, setSeeModifyOption] = useState(false);
  const modify = useRef();
  const [validePhoneNumber, setValidePhoneNumber] = useState(true);
  const [seeSpiner, setSeeSpiner] = useState(false);

  useEffect(() => {
    if (cookies.get("jwt")) {
      const getCockie = cookies.get("jwt");
      const decodedToken = decodeToken(getCockie);
      if (decodedToken.email) {
        setError(false);
        
        setEmail(decodedToken.email);
        
        if (data2.length > 0 && email != ""){
          go(decodedToken.email);
        getPersonnalData(decodedToken.email);
        }
      } else {
        setError(true);
      }
    }
  }, [data2, email]);

  useEffect(() => {
    setData2(datas);
  }, [datas]);
  function go(email) {
    let results = _.filter(data2, { publishedBy: email });
    if (results.length === 0) {
    } else {
      calculateSum(results);
      localStorage.setItem("total", results.length);
    }
  }
  let sum = 0;
  function calculateSum(data) {
    data.map((item) => {
      sum = sum + item.view;
    });
    setViewNumber(sum);
  }

  const handleChildData = (data) => {
    setCanModify(data);
    if (canModify) {
      setSeeModifyOption(false);
    }
  };
  useEffect(() => {
    setSeeModifyOption(false);
  }, [canModify]);

  const getPersonnalData = async (email) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/get-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("La requête POST a échoué.");
      }

      const responseData = await response.json();
      if (responseData.response !== false) {
        setData(responseData);
      } else {
      }
    } catch (error) {
      console.error("Erreur lors de la requête POST:", error.message);
    }
  };

  const handleModifications = () => {
    if (modify.current.innerText === "Modifier") {
      setSeeModifyOption(!seeModifyOption);
    }
  };
  const handleChange = (e, element) => {
    setData({ ...data, [element]: e.target.value });
  };

  useEffect(() => {
    if (data["telephone"]) {
      if (isValidPhoneNumber("+" + data["telephone"])) {
        setValidePhoneNumber(true);
      } else {
        setValidePhoneNumber(false);
      }
    }
  }, [data["telephone"]]);

  const updatePersonnalData = async () => {
    setSeeSpiner(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/update-personnal-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((response) => {
        if (response.ok) {
          setSeeSpiner(false);
          alert("Informations mises à jour");
          window.location.reload();
        }
      });
    } catch (error) {
      setSeeSpiner(false);
      alert("Une erreur est survenue");
      console.error("Erreur lors de la requête POST:", error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modify.current.innerText === "Mettre à jour" && isValidPhoneNumber) {
      updatePersonnalData();
    }
  };

  return (
    <div>
      <NavBar />
      <div>
        <h1 className="detailed-ads-text" style={{ marginTop: "40px" }}>
          Vue Ensemble
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "80px",
          }}
        >
          <img
            src={images.ensemble}
            style={{ width: "550px", marginBottom: "80px" }}
          />
        </div>
        <div className="vue-ensemble">
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.nom} />
            </div>
            <div>
              <label className="vue-ensemble-p">Nom</label>
              <input
                type="text"
                pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
                value={data.nom || ""}
                onChange={(e) => {
                  handleChange(e, "nom");
                }}
                disabled={canModify ? false : true}
                required
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.nom} />
            </div>
            <div>
              <label className="vue-ensemble-p">Prenom</label>
              <input
                type="text"
                pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
                value={data.prenom || ""}
                onChange={(e) => {
                  handleChange(e, "prenom");
                }}
                disabled={canModify ? false : true}
                required
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.Email} />
            </div>
            <div>
              <label className="vue-ensemble-p">Email</label>
              <input
                type="text"
                value={data.email || ""}
                disabled
                onChange={(e) => {}}
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.Password} />
            </div>
            <div>
              <label className="vue-ensemble-p">Password</label>
              <input
                type="text"
                value={data.mot_de_passe || ""}
                pattern=".{4,}"
                required
                title="Le mot de passe doit contenir au moins 4 caractères"
                onChange={(e) => {
                  handleChange(e, "mot_de_passe");
                }}
                disabled={canModify ? false : true}
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.OrderCompleted} />
            </div>
            <div>
              <label className="vue-ensemble-p">Nombre de publication</label>

              <input
                type="text"
                value={localStorage.getItem("total") || 0}
                disabled
                onChange={(e) => {}}
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.Phone} />
            </div>
            <div>
              <label className="vue-ensemble-p">Téléphone</label>

              <input
                className={validePhoneNumber ? "" : "input-error"}
                type="number"
                value={data.telephone || ""}
                required
                onChange={(e) => {
                  handleChange(e, "telephone");
                }}
                disabled={canModify ? false : true}
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.Eye} />
            </div>
            <div>
              <label className="vue-ensemble-p">Nombre total de vues</label>

              <input
                type="text"
                disabled
                value={viewNumber}
                onChange={(e) => {}}
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }} ref={modify}>
          <button
            className="vue-ensemble-btn"
            onClick={handleModifications}
            type="submit"
          >
            {canModify ? "Mettre à jour" : "Modifier"}
          </button>
        </div>
      </form>
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
      ) : null}
      <div>
        {seeModifyOption ? (
          <CodeVerificationMessage email={email} onSendData={handleChildData} />
        ) : null}
      </div>
      <FakeFooter />
    </div>
  );
};

export default VueEnsemble;
