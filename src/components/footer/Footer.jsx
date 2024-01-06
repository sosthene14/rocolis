import React from "react";
import "./Footer.css";
import images from "../../assets/images/images";
import { useState } from "react";
import handleJWT from "../handleJWT/JWT";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import { FaInstagramSquare } from "react-icons/fa";

export const Footer = () => {
  const [userMail, jwtToken] = handleJWT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const getUserEmailNewsletter = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://192.168.1.11:5000/api/add-to-newsletter/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ email: email }),
        }
      );

      if (!response.ok) {
        throw new Error("La requête POST a échoué.");
      }
      const data = await response.json();
      if (data.response === true) {
        window.location.reload();
        console.log(data);
      } else {
        setError("Cet email est déja inscrit");
        console.log("erreur");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "Une erreur est survenue. Veuillez vous connecter ou vous s'inscrire."
      );
    }
  };

  return (
    <div className=" flex pt-8 mt-[100px]  bg-neutral-800 flex-col justify-center items-center gap-16 ">
      <div className="w-[340px] md:w-3/4 px-6 bg-sky-600 rounded-[20px] shadow justify-between items-end inline-flex">
        <div className="self-stretch py-6 flex-col justify-between items-start inline-flex">
          <div className="w-auto text-white text-[24px] md:text-[44px] font-normal font-['Angkor'] leading-[54px]">
            Abonnez-vous à la newsletter
          </div>
          <div className="flex-col justify-start items-start gap-4 flex">
            <div className="flex-col justify-start items-start gap-2 flex">
              <div className="opacity-80 text-white text-xl font-normal font-['Angkor']">
                ROCOLIS
              </div>
              <div className="opacity-70 text-white text-xl font-normal font-['Montserrat']">
                Votre destination finale pour la vente des colis
              </div>
            </div>
            {<p className="text-red-500">{error}</p>}
            <form onSubmit={(e) => getUserEmailNewsletter(e)}>
              <div className="3/4 justify-start items-center gap-4 inline-flex">
                <input
                  onChange={(e) => {
                    setEmail(e.target.value), setError("");
                  }}
                  value={email}
                  type="email"
                  autoComplete="on"
                  required
                  className="w-3/4 outline-none grow shrink basis-0 rounded-tl rounded-tr  self-stretch h-14 bg-white rounded flex-col justify-start items-start gap-2.5 flex"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white rounded  text-neutral-900 text-sm font-semibold font-['Montserrat'] self-stretch flex-col justify-center items-start gap-2.5 inline-flex hover:bg-slate-200"
                >
                  S'abonner
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="w-[0px] h-[0px] xl:w-[300px] xl:h-[305px] relative">
          <img src={images.mailBox} />
        </div>
      </div>
      <div className="gap-[90px] pb-[20px] flex items-center  flex-wrap-reverse">
        <div className="gap-10 m-auto justify-center mb-12">
          <div className="text-sky-600 text-[32px] font-semibold font-['Montserrat']">
            ROCOLIS
          </div>
          <div className="flex items-center gap-5">
            <a href="https://www.facebook.com/RostelHighTech">
              {" "}
              <FaFacebook color="white" className="w-7 h-7 cursor-pointer" />
            </a>
            <a href="https://www.instagram.com/rostelhightech/">
              <FaInstagramSquare
                color="white"
                className="w-7 h-7 cursor-pointer"
              />
            </a>
            <a href="https://www.youtube.com/@rostelhigh-tech">
              <FaYoutube color="white" className="w-7 h-7 cursor-pointer" />
            </a>
            <a href="https://twitter.com/RostelHighTech">
              <p className="text-white text-[32px] cursor-pointer font-semibold font-['Montserrat']">
                𝕏
              </p>
            </a>
          </div>
        </div>
        <div className="gap-[50px] flex flex-wrap justify-center mx-auto  ">
          <div className="flex-col  gap-4 ">
            <div className="text-white text-base font-normal font-['Angkor'] mb-5">
              Notre activité
            </div>
            <div className="flex-col  gap-3 flex">
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                Vente de kilos GP
              </div>
            </div>
          </div>
          <div className="flex-col  gap-4 ">
            <div className="text-white text-base font-normal font-['Angkor'] mb-5">
              Nos Partenaires
            </div>
            <div className="flex-col  gap-3 flex">
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                Rostel High-Tech
              </div>
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                MCR Business
              </div>
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                D.E.V Pro Code
              </div>
            </div>
          </div>
          <div className=" flex-col  gap-4 ">
            <div className="text-white text-base font-normal font-['Angkor'] mb-5">
              A propos de Nous
            </div>
            <div className="flex-col  gap-3 flex">
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                Notre histoire
              </div>
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                Travaillez avec nous
              </div>
            </div>
          </div>
          <div className=" flex-col  gap-4  ">
            <div className="text-white text-base font-normal font-['Angkor'] mb-5">
              Contacter-Nous
            </div>
            <div className="flex-col  gap-3 flex">
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                +221 786319559
              </div>
              <div className="w-[175.20px] opacity-70 text-white text-sm font-medium font-['Montserrat']">
                rocolis.info@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
