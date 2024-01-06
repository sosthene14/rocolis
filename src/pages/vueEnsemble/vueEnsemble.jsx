import React from "react";
import NavBar from "../../components/navBar/NavBar";
import images from "../../assets/images/images";
import "./vueEnsemble.css";
import { useState, useEffect, useRef } from "react";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import _ from "lodash";
import { ThreeCircles } from "react-loader-spinner";
import CodeVerificationMessage from "../../components/simpleCodeVerification/SimpleCode";
import { isValidPhoneNumber } from "react-phone-number-input";
import handleJWT from "../../components/handleJWT/JWT";
import bcrypt from "bcryptjs-react";
const VueEnsemble = ({ datas, email }) => {
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [viewNumber, setViewNumber] = useState(0);
  const [canModify, setCanModify] = useState(false);
  const [seeModifyOption, setSeeModifyOption] = useState(false);
  const modify = useRef();
  const [validePhoneNumber, setValidePhoneNumber] = useState(true);
  const [seeSpiner, setSeeSpiner] = useState(false);
  let sum = 0;

  useEffect(() => {
    if (email !== "") {
      setError(false);
      if (email != "") {
        go(email);
        getPersonnalData(email);
      }
    } else {
      setError(true);
    }
  }, [email, data2]);

  useEffect(() => {
    setData2(datas);
  }, [datas]);

  useEffect(() => {
    setSeeModifyOption(false);
  }, [canModify]);

  useEffect(() => {
    if (data["telephone"]) {
      if (isValidPhoneNumber("+" + data["telephone"])) {
        setValidePhoneNumber(true);
      } else {
        setValidePhoneNumber(false);
      }
    }
  }, [data["telephone"]]);
  function go(email) {
    let results = _.filter(data2, { publishedBy: email });
    if (results.length === 0) {
      localStorage.setItem("total", 0);
    } else {
      calculateSum(results);
      localStorage.setItem("total", results.length);
    }
  }

  function calculateSum(data) {
    data.map((item) => {
      sum = sum + item.view;
    });
    setViewNumber(sum);
  }
  const [password, setPassword] = useState("");
  const handleChildData = (data) => {
    setCanModify(data);
    if (canModify) {
      setSeeModifyOption(false);
    }
  };
  const [userEmail, jwtToken] = handleJWT();
  const getPersonnalData = async (email) => {
    try {
      const response = await fetch("http://192.168.1.11:5000/api/get-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          email: userEmail,
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
  useEffect(() => {
    setPassword(data["mot_de_passe"]);
  }, [datas]);
  function getCrypto() {
    try {
      return window.crypto;
    } catch {
      return crypto;
    }
  }
  const handleModifications = () => {
    if (modify.current.innerText === "Modifier") {
      setSeeModifyOption(!seeModifyOption);
    }
  };

  useEffect(() => {
    handlePassword();
  }, [password]);
  const handlePassword = () => {
    if (password != undefined) {
      console.log(password);
      setData({ ...data, mot_de_passe: bcrypt.hashSync(password, 10) });
    }
  };
  const handleChange = (e, element) => {
    setData({ ...data, [element]: e.target.value });
  };

  const updatePersonnalData = async () => {
    setSeeSpiner(true);
    try {
      const response = await fetch(
        `http://192.168.1.11:5000/api/update-personnal-data/${userEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
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
      window.location.reload();
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
        <div className=" shadow-xl mx-auto rounded-xl w-96">
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.nom} className="w-10" />
            </div>
            <div className="ml-5">
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
                className="w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.nom} className="w-10" />
            </div>
            <div className="ml-5">
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
                className="w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.Email} className="w-10" />
            </div>
            <div className="ml-5">
              <label className="vue-ensemble-p">Email</label>
              <input
                type="text"
                value={data.email || ""}
                disabled
                onChange={(e) => {}}
                className="w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.Password} className="w-10" />
            </div>
            <div className="ml-5">
              <label className="vue-ensemble-p">Password</label>
              <input
                type="text"
                value={password || ""}
                pattern=".{4,}"
                required
                title="Le mot de passe doit contenir au moins 4 caractères"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                disabled={canModify ? false : true}
                className="w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.OrderCompleted} className="w-10" />
            </div>
            <div className="ml-5">
              <label className="vue-ensemble-p">Nombre de publication</label>

              <input
                type="text"
                value={localStorage.getItem("total") || 0}
                disabled
                onChange={(e) => {}}
                className="w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              />
            </div>
          </div>
          <div className="vue-ensemble-div-input">
            <div>
              <img src={images.Phone} className="w-10" />
            </div>
            <div className="ml-5">
              <label className="vue-ensemble-p">Téléphone</label>

              <input
                className={
                  validePhoneNumber
                    ? "w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                    : "w-60 sm:w-72 text-sm rounded-lg bg-rose-100 text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                }
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
              <img src={images.Eye} className="w-10" />
            </div>
            <div className="ml-5">
              <label className="vue-ensemble-p">Nombre total de vues</label>

              <input
                type="text"
                disabled
                value={viewNumber}
                onChange={(e) => {}}
                className="w-60 sm:w-72 text-sm rounded-lg text-gray-500 focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
              />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }} ref={modify}>
          <button
            className="vue-ensemble-btn"
            style={{ backgroundColor: "#6C63FF" }}
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
