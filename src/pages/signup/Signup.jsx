import React, { useState, useEffect } from "react";
import "./Signin.css";
import { useRef } from "react";
import images from "../../assets/images/images";
import { ThreeCircles } from "react-loader-spinner";
import ValidationCodePage from "../validation_code_sent/ValidationCodePage";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";

function Signup() {
  const [value, setValue] = useState();
  const paswd = useRef();
  const cpaswd = useRef();
  const nom = useRef();
  const prenom = useRef();
  const email = useRef();
  const statut = useRef();
  const [pasErrorVisible, setPasErrorVisible] = useState(false);
  const [seeValidationCodePage, setSeeValidationCodePage] = useState(false);
  const [existingMail, setExistingMail] = useState(false);
  const [seeSpiner, setSeeSpiner] = useState(false);
  const [code, setCode] = useState("");
  const [emails, setEmail] = useState("");
  const [token, setToken] = useState(null);
  const [validePhoneNumber, setValidePhoneNumber] = useState(true);
  const [connexionError, setConnexionError] = useState(false);
  const [role, setRole] = useState("");
  const checkPaswdSame = (e) => {
    if (cpaswd.current.value != paswd.current.value) {
      setPasErrorVisible(true);
    } else {
      setPasErrorVisible(false);
    }
  };
  const getFormData = (e) => {
    e.preventDefault();
    const data = {
      nom: nom.current.value,
      prenom: prenom.current.value,
      email: email.current.value,
      telephone: value,
      paswd: paswd.current.value,
      statut: statut.current.value,
    };
    setEmail(email.current.value);
    if (!pasErrorVisible) {
      if (validePhoneNumber) {
        handlePostData(data).then((result) => {
          if (result === false) {
            setExistingMail(true);
            setSeeValidationCodePage(false);
            setSeeSpiner(false);
          } else if (result === true) {
            setSeeSpiner(false);
            setExistingMail(false);
            setSeeValidationCodePage(true);
          }
        });
      } else {
        // Vous pouvez ajouter du code ici si nécessaire
      }
    } else {
      setSeeValidationCodePage(false);
    }
  };

  const handleSpinnerDelay = () => {
    setTimeout(() => {
      setSeeSpiner(false);
      setConnexionError(true);
    }, 65000); // 60 000 millisecondes équivalent à 1 minute
  };

  const handlePostData = async (postData) => {
    setSeeSpiner(true);
    handleSpinnerDelay();
    try {
      const response = await fetch("http://192.168.1.10:5000/api/post-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("La requête POST a échoué.");
      }
      const responseData = await response.json();
      if (responseData.response === false) {
        return false;
      } else {
        setToken(responseData.token);
        sessionStorage.setItem("email", email.current.value);
        setCode(responseData.response);
        setTimeout(() => {
          setCode(null);
        }, 3600000);
        return true;
      }
    } catch (error) {
      console.error("Erreur lors de la requête POST:", error.message);
    }
  };
  useEffect(() => {
    if (value) {
      if (isValidPhoneNumber("+" + value)) {
        setValidePhoneNumber(true);
      } else {
        setValidePhoneNumber(false);
      }
    }
  }, [value]);

  return (
    <div>
      {!seeValidationCodePage ? (
        <div>
          <div className="_titleblock_signin">
            <h1>ROCOLIS</h1>
            <h3 style={{ marginTop: "30px" }}>Ouvrir un compte</h3>
          </div>
          <div
            className="_signinblock"
            style={{ marginTop: "50px", marginBottom: "50px" }}
          >
            <p>utiliser</p>
            <br />
            <div className="_signinsocialblock">
              <img src={images.tiktokImage} />
              <img src={images.facebookImage} />
              <img src={images.googleImage} />
            </div>
            <br />

            <p>ou</p>
            <br />

            <form onSubmit={getFormData}>
              <div className="_subsignininputblock1">
                <div className="_subsignininputblock2">
                  <label
                    style={{
                      borderRadius: "5px",
                      color: "#747474",
                      fontSize: "14px",
                    }}
                  >
                    Vous êtes
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div></div>
                    <select
                      ref={statut}
                      className="input-choice"
                      onChange={(e) => setRole(e.target.value)}
                      value={role}
                      required
                    >
                      <option value="demarcheur">Démarcheur</option>
                      <option value="voyageur">Voyageur</option>
                    </select>
                  </div>

                  <input
                    type="text"
                    ref={nom}
                    name="nom"
                    placeholder="nom"
                    pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                    title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
                    required
                  />
                  <input
                    type="text"
                    ref={prenom}
                    name="prenom"
                    placeholder="prenom"
                    required
                    pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                    title="Uniquement des lettres de l'alphabet français, les accents ne sont pas acceptés, 2 caractères minimum "
                  />
                  <PhoneInput
                    country={"sn"}
                    value={value}
                    onChange={setValue}
                    enableSearch={true}
                    containerStyle={{ padding: "0px" }}
                    inputStyle={{
                      paddingTop: "18px",
                      paddingBottom: "18px",
                      height: "35px",
                      width: "250px",
                      backgroundColor: "#D9D9D9",
                      border: "none",
                      borderRadius: "10px",
                    }}
                  />
                  <input
                    type="email"
                    ref={email}
                    name="email"
                    placeholder="email"
                    required
                  />
                  <input
                    ref={paswd}
                    type="password"
                    name="mot_de_passe"
                    id="paswd"
                    placeholder="mot de passe"
                    pattern=".{4,}"
                    title="Le mot de passe doit contenir au moins 4 caractères"
                    required
                  />
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

                  <input
                    ref={cpaswd}
                    onInput={(e) => {
                      checkPaswdSame(e);
                    }}
                    type="password"
                    id="confirmpaswd"
                    name="confirmer_mot_de_passe"
                    placeholder="confirmer mot de passe"
                    pattern=".{4,}"
                    title="Le mot de passe doit contenir au moins 4 caractères"
                    required
                  />
                  <span
                    id={
                      !validePhoneNumber
                        ? "error_password"
                        : "error_password_invisible"
                    }
                  >
                    numéro invalide
                  </span>
                  <span
                    id={
                      existingMail
                        ? "error_password"
                        : "error_password_invisible"
                    }
                  >
                    Ce mail est déjà associé à un autre compte
                  </span>
                  <span
                    id={
                      pasErrorVisible
                        ? "error_password"
                        : "error_password_invisible"
                    }
                  >
                    Mot de passe différents
                  </span>
                  <span
                    id={
                      connexionError
                        ? "error_password"
                        : "error_password_invisible"
                    }
                  >
                    Une érreur est survenue,veuillez essayer de creer un compte
                    avec les autres modes
                  </span>

                  <button type="submit">Valider</button>
                </div>
              </div>
            </form>
            <div>
              <p>
                <a href="signin" id="login_text">
                  Vous avez un compte ? Se connecter
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ValidationCodePage code={code} />
      )}
    </div>
  );
}

export default Signup;
