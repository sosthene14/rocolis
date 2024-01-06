import React, { useState } from 'react'
import "./ValidationCodePage.css"
import Cookies from 'universal-cookie';
import images from '../../assets/images/images'
import { useRef, useEffect } from 'react'
import { ThreeCircles } from 'react-loader-spinner'
import { useJwt, decodeToken, isExpired } from "react-jwt";
import bcrypt from "bcryptjs";
import handleJWT from '../../components/handleJWT/JWT';

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
        sessionStorage.setItem("token", token)
      }

    }


  }, [token]);
  const [userEmail, jwtToken] = handleJWT();
  const makeVerified = async () => {

       try {
      const response = await fetch(`http://192.168.1.11:5000/api/make-verified/${userEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ "email": sessionStorage.getItem("email") }),
      });

      if (!response.ok) {
        throw new Error('La requête POST a échoué.');
      }
      const responseData = await response.json();
      console.log(responseData)
      if (responseData["response"]["success"] == true){
        window.location.href = "/"
      }

    } catch (error) {
      console.error('Erreur lors de la requête POST:', error.message);
    }
    
   
  }

  const getToken = async () => {
    try {
      const response = await fetch('http://192.168.1.11:5000/api/send-jwt', {
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
      if (responseData["token"] != "lol"){
        setToken(responseData["token"])
      }
      
      

    } catch (error) {
      console.error('Erreur lors de la requête POST:', error.message);
    }
  }


  function checkCodeValidity() {
    setSeeSpiner(true);
  
    if (bcrypt.compareSync(userEntry.current.value, code.code)) {
      cookies.set('jwt', token, {
        expires: expDay,
      });
      setSeeSpiner(false);
      getToken();
    } else {
      setErrorCode("Code incorrect");
      setSeeSpiner(false);
        // Assurez-vous que cette ligne est correctement positionnée
    }
  }
  

  useEffect(() => {
    if (cookies.get("jwt") != undefined && userEmail != "" && jwtToken != "") {
      makeVerified()
      
    }
    
  },[cookies,userEmail])
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