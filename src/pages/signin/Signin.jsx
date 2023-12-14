import React from 'react'
import "./Signin.css"
import images from '../../assets/images/images'
import { MutatingDots, ThreeCircles } from 'react-loader-spinner'
import { useState, useRef, useEffect } from 'react'
import ValidationCodePage from '../validation_code_sent/ValidationCodePage'
import Cookies from 'universal-cookie';
import { useJwt, decodeToken, isExpired } from "react-jwt";

function Signin() {
    const email = useRef()
    const password = useRef()
    const [seeSpiner, setSeeSpiner] = useState(false)
    const [errorUnknowUser, setErrorUnknowUser] = useState(false)
    const [userVerified, setUserVerified] = useState(true)
    const [verificationPage, setVerificationPage] = useState(false)
    const [codeValidation, setCodeValidation] = useState("")
    const cookies = new Cookies(null, { path: '/' });
    const [token, setToken] = useState();
    const [expDay, setExpDay] = useState("")

    const canGoHomePage = () => {
        getToken()
    }
    useEffect(() => {
        if (cookies.get("jwt") != undefined) {
          window.location.href = "/"
        }
        
      },[cookies])
    const getToken = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/send-jwt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "email": sessionStorage.getItem("email") }),
          });
    
          if (!response.ok) {
            throw new Error('La requête POST a échoué.');
          }
          const responseData = await response.json();
          setToken(responseData["token"])
    
        } catch (error) {
          console.error('Erreur lors de la requête POST:', error.message);
        }
      }

      useEffect(() => {
        if (token != null) {
          const decodedToken = decodeToken(token)
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 10); // Ajouter 10 ans
    
          cookies.set('jwt', token, {
            expires: expirationDate,
          });
          if (decodedToken != null) {
            setExpDay(expirationDate)
            sessionStorage.setItem("token", token)
          }
    
        }
    
    
      }, [token]);
    const checkDataValidity = async (e) => {
        e.preventDefault();
        setSeeSpiner(true);
        const body_ = {
            email: email.current.value,
            password: password.current.value,
        };
        sessionStorage.setItem("email",email.current.value)
        try {
            const response = await fetch('http://127.0.0.1:5000/api/check-signed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body_),
            });

            if (!response.ok) {
                throw new Error('La requête POST a échoué.');
            }

            const responseData = await response.json();
            if (responseData.response === true) {
                checkVerification();
            } else {
                setErrorUnknowUser(true);
                setSeeSpiner(false);
            }
        } catch (error) {
            console.error('Erreur lors de la requête POST:', error.message);
        }
    };
    const checkVerification = async () => {
        setSeeSpiner(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/check-is-verified', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.current.value }),
            });

            if (!response.ok) {
                throw new Error('La requête POST a échoué.');
            }

            const responseData = await response.json();
            if (responseData.response === true) {
                setErrorUnknowUser(false);
                setSeeSpiner(false);
                canGoHomePage();
            } else {
                setUserVerified(false);
                setSeeSpiner(false);
            }
        } catch (error) {
            console.error('Erreur lors de la requête POST:', error.message);
        }
    };

    async function getVerificationCode() {
        setSeeSpiner(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/confirmation_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.current.value }),
            });

            if (!response.ok) {
                throw new Error('La requête POST a échoué.');
            }
            const responseData = await response.json();
            if (responseData.response === true) {
                setSeeSpiner(false);
                setCodeValidation(responseData.code)
            } else {
                setSeeSpiner(false);
            }
        } catch (error) {
            console.error('Erreur lors de la requête POST:', error.message);
        }
    }

    return (
        <div>{
            !verificationPage ? (
                <div>
                    <div className="_titleblock_signin">
                        <h1>ROCOLIS</h1>
                        <h3 style={{ marginTop: "30px" }}>Connexion</h3>
                    </div>
                    <div className="_signinblock" style={{ marginTop: "100px" }}>
                        <p>
                            utiliser
                        </p>
                        <div className="_signinsocialblock">
                            <img src={images.tiktokImage} />
                            <img src={images.facebookImage} />
                            <img src={images.googleImage} />
                        </div>

                        <p>
                            ou
                        </p>
                        <form method="post" onSubmit={checkDataValidity}>
                            <div className="_signininputblock">
                                <div className="_subsignininputblock1">
                                    <div className="_subsignininputblock2">
                                        <input type="email" placeholder="email" required name="email" ref={email} />
                                        {
                                            seeSpiner ? (<div className='loader-div'>
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
                                            </div>) : null
                                        }
                                        <div>
                                            <input type="password" name="password" placeholder="mot de passe" ref={password} required />
                                            <p style={{ marginTop: "10px" }}><a href="">Mot de passe oublié ?</a></p>
                                            <span id={errorUnknowUser ? 'error_password' : "error_password_invisible"}>Utilisateur inconnu</span>

                                            <span id={!userVerified ? 'error_password' : "error_password_invisible"} onClick={() => {

                                            }}><a id='verification-text' onClick={() => {
                                                getVerificationCode()
                                                setVerificationPage(true)
                                            }}>Votre compte n'est pas vérifié,<br />
                                                    proceder à la vérification ?</a></span>
                                        </div>
                                        <button type="submit">Valider</button>
                                    </div>
                                </div>

                                <div>
                                    <p><a href="/signup" id='login_text' >Vous n’avez pas de comptes ? Creer</a></p>
                                </div>
                            </div>
                        </form>


                    </div>
                </div>
            ) : (<div>
                <ValidationCodePage code={codeValidation} email={sessionStorage.getItem("email")} />
            </div>)

        }

        </div>
    )
}

export default Signin