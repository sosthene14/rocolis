import React, { useState } from 'react'
import "./ValidationCodePage.css"
import Cookies from 'universal-cookie';
import images from '../../assets/images/images'
import { useRef, useEffect } from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import { useJwt, decodeToken, isExpired } from "react-jwt";
const ValidationCodePage = (code, email) => {
  const [errorCode, setErrorCode] = useState("")
  const userEntry = useRef()
  const cookies = new Cookies(null, { path: '/' });
  const [token, setToken] = useState();
  const [expDay, setExpDay] = useState("")
  const [seeSpiner, setSeeSpiner] = useState(false)



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
        console.log(decodedToken);
        sessionStorage.setItem("token", token)
      }

    }


  }, [token]);
  const makeVerified = async () => {
    try {
      const response = await fetch('http://192.168.1.10:5000/api/make-verified', {
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

    } catch (error) {
      console.error('Erreur lors de la requête POST:', error.message);
    }
  }

  const getToken = async () => {
    try {
      const response = await fetch('http://192.168.1.10:5000/api/send-jwt', {
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
      console.log(responseData)

    } catch (error) {
      console.error('Erreur lors de la requête POST:', error.message);
    }
  }

  function checkCodeValidity() {
    setSeeSpiner(true)
    if (userEntry.current.value !== code.code) {
      setErrorCode("Code incorrect")
      setSeeSpiner(false)
    }
    else {
      cookies.set('jwt', token, {
        expires: expDay,
      });
      setSeeSpiner(false)
      getToken()
      makeVerified()      
    }
  }
  useEffect(() => {
    if (cookies.get("jwt") != undefined) {
      window.location.href = "/"
    }
    
  },[cookies])
  return (
    <div>
      <div className="_titleblock_signin">
        <h1 style={{marginBottom:"40px"}}>ROCOLIS</h1>
        <h3>Code de validation</h3>
      </div>
      <div>
        <p className='code-sent-p'>
          Un code de validation vous a été envoyé
          vérifiez dans vos spams s’il n’apparait
          dans la boite de reception principale
        </p>
      </div>
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
      <div className='code-input-div'>
        <img src={images.sleepingImage} />
        <div>
          <input className='input-code' ref={userEntry} />
          <p className='incorrect-code'>{errorCode}</p>
        </div>
      </div>
      <div className='check-button-div'>
        <button className='check-button mb-5' onClick={() => {
          checkCodeValidity()
        }}>Vérifier</button>
      </div>
    </div>
  )
}

export default ValidationCodePage