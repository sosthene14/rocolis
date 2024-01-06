import React, { useState, useRef, useEffect } from "react";
import "pure-react-carousel/dist/react-carousel.es.css";
import LikesStars from "./LikesStars";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import images from "../../assets/images/images";
import { FaArrowRight } from "react-icons/fa";
import { FaShare, FaAddressBook } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
} from "react-share";
import "./Home.css";
import { Carousel } from "flowbite-react";
import { format } from "date-fns";
import { da, fr } from "date-fns/locale";
import handleJWT from "../../components/handleJWT/JWT";

export default function SliderComponant() {
  const [copyLink, setCopyLink] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [publishedBy, setPublishedBy] = useState([]);
  let shareMenu = useRef();
  let shareButton = useRef();
  let contactMenu = useRef();
  let contactButton = useRef();
  const [userMail, jwtToken] = handleJWT();
  const [data, setData] = useState([]);
  const [handleShare, setHandleShare] = useState(
    Array.from({ length: data.length }, () => false)
  );
  const [handleContact, setHandleContact] = useState(
    Array.from({ length: data.length }, () => false)
  );

  useEffect(() => {
    getRecentsAds();
  }, []);

  const toggleHandleShare = (index) => {
    const updatedHandleShare = [...handleShare];
    updatedHandleShare[index] = !updatedHandleShare[index];
    setHandleShare(updatedHandleShare);
  };

  const toggleHandleContact = (index) => {
    const updatedHandleContact = [...handleContact];
    updatedHandleContact[index] = !updatedHandleContact[index];
    setHandleContact(updatedHandleContact);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id !== "partager" && e.target.id !== "contact") {
        if (handleShare.includes(true)) {
          setHandleShare(Array.from({ length: data.length }, () => false));
          setHandleContact(Array.from({ length: data.length }, () => false));
          return;
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleShare]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id !== "partager" && e.target.id !== "contact") {
        if (handleContact.includes(true)) {
          setHandleShare(Array.from({ length: data.length }, () => false));
          setHandleContact(Array.from({ length: data.length }, () => false));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleContact]);

  const getRecentsAds = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.11:5000/api/get-recents-ads`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("La requête GET a échoué.");
      }
      const responseData = await response.json();
      setData(responseData.data);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  function getSellerPhone(index) {
    fetch("http://192.168.1.11:5000/api/get-phone-number", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ email: data[index]["publishedBy"] }),
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setPhoneNumber("+" + data["telephone"]);
        });
      }
    });
  }

  function handleCopyLink() {
    setCopyLink(true);
    setTimeout(() => {
      setCopyLink(false);
    }, 1000);
  }

  const dataPackage = [images.package1, images.package2, images.package3];
  function getRandomImage(imagesArray) {
    if (imagesArray.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * imagesArray.length);
    const randomImage = imagesArray[randomIndex];
    return randomImage;
  }
  const randomImage = getRandomImage(dataPackage);
  const formatDate = (dateToFormat) => {
    const formattedDate = format(new Date(dateToFormat), "d MMMM yyyy", {
      locale: fr,
    });
    return formattedDate;
  };

  return (
    <div>
      <div className="flex justify-center items-center gap-10  mt-20 flex-wrap w-96 md:w-full ">
        <div className="flex flex-col md:gap-0 mx-8 md:mx-0 ">
          <div className="h-9 text-black text-[22px] md:text-[32px] font-semibold font-['Montserrat']">
            <p className="text-center">Départs imminents</p>
          </div>
          <div className="opacity-75  text-black text-md md:text-xl mt-5 font-medium font-['Montserrat']">
            <p className="text-center">
              Personnes qui voyagent dans l'intervalle de 1 à 5 jours
            </p>
          </div>
        </div>
      </div>

      {data.length > 0 ? (
        <div>
          <div className="h-[100vh] w-[40vw]  mx-auto flex flex-col gap-5 justify-center items-center ">
            <Carousel
              style={{ width: "500px" }}
              pauseOnHover
              slideInterval={8000}
            >
              {data.map((data, index) => (
                <div
                  style={{
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    height: "550px",
                    WebkitBoxShadow:
                      "26px 20px 0px -4px rgba(25, 118, 210, 0.39)",
                    MozBoxShadow: "26px 20px 0px -4px rgba(25, 118, 210, 0.39)",
                    boxShadow: "26px 20px 0px -4px rgba(25, 118, 210, 0.39)",
                  }}
                  key={index}
                  className="w-[310px] md:w-[400px] rounded-2xl p-8 flex-col gap-5 bg-white shadow justify-center items-center cursor-pointer"
                >
                  <div className="text-neutral-900 text-[20px] font-normal font-['Angkor'] mb-5">
                    <p>
                      “{"Bonjour, je voyage le " + formatDate(data.dateDepart)}”
                    </p>
                    <br />
                  </div>
                  <div className="opacity-50 text-neutral-900 text-sm font-medium font-['Angkor'] flex items-center gap-2">
                    <p>{data.villeDepart}</p>
                    <FaArrowRight />
                    <p>{data.villeArrive}</p>
                  </div>
                  <div className="text-right text-neutral-900 text-sm font-normal font-['Angkor'] mt-5 mb-5">
                    <p>Plus de détails</p>
                  </div>
                  <div>{/*<LikesStars />*/}</div>
                  <div className="w-[168px] text-neutral-900 text-sm font-normal font-['Angkor']">
                    <p>{data.nom}</p>
                  </div>
                  <div className="w-[268px] opacity-50 text-neutral-900 text-xs font-medium font-['Montserrat']">
                    <p>Nom du voyageur</p>
                  </div>

                  <div className="flex justify-between my-1 mt-5 items-center">
                    <div className=" h-6 pt-[7px] justify-center flex items-center gap-2">
                      <FaAddressBook color="#1DA1F2" />
                      <div
                        ref={contactButton}
                        className="grow shrink cursor-pointer basis-0 opacity-40 text-neutral-900 text-xs font-normal font-['Angkor']"
                        onClick={() => {
                          getSellerPhone(index);
                          toggleHandleContact(index);
                        }}
                      >
                        <a id="contacter">Contacter</a>
                      </div>
                      <div
                        ref={contactMenu}
                        className={
                          handleContact[index] && phoneNumber !== ""
                            ? "z-10 bg-white shadow-sm p-3 rounded-xl ml-[-20px] mt-[80px] absolute flex gap-3"
                            : "hidden"
                        }
                      >
                        <a href={`tel:${phoneNumber}`}>
                          <FaPhone className="w-5 h-5" color="#1DA1F2" />
                        </a>
                        <a
                          href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                            `Bonjour ${data.nom}, je suis intéressé par votre annonce sur rocolis: http://localhost:5173/searched/${data.villeDepart}/${data.villeArrive}/${data.dateDepart}`
                          )}`}
                          target="_blank"
                        >
                          <FaWhatsapp color="#25D366" className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div
                        className=" h-6 pt-[7px] justify-center flex items-center gap-2"
                        ref={shareButton}
                      >
                        <FaShare color="#1DA1F2" />
                        <div
                          onClick={() => {
                            toggleHandleShare(index);
                          }}
                          id="partager"
                          className="grow cursor-pointer shrink basis-0 opacity-40 text-neutral-900 text-xs font-normal font-['Angkor']"
                        >
                          Partager
                        </div>
                      </div>
                      <div
                        ref={shareMenu}
                        className={
                          handleShare[index]
                            ? "z-10 bg-white shadow-sm p-3 rounded-xl ml-[-20px] mt-[35px] absolute"
                            : "hidden"
                        }
                      >
                        <div className="flex gap-2">
                          <FacebookShareButton
                            url={`http://localhost:5173/searched/${data.villeDepart}/${data.villeArrive}/${data.dateDepart}`}
                          >
                            <FacebookIcon round={true} size={25} />
                          </FacebookShareButton>
                          <WhatsappShareButton
                            url={`http://localhost:5173/searched/${data.villeDepart}/${data.villeArrive}/${data.dateDepart}`}
                          >
                            <WhatsappIcon round={true} size={25}></WhatsappIcon>
                          </WhatsappShareButton>
                          <TelegramShareButton
                            url={`http://localhost:5173/searched/${data.villeDepart}/${data.villeArrive}/${data.dateDepart}`}
                          >
                            <TelegramIcon round={true} size={25}></TelegramIcon>
                          </TelegramShareButton>
                        </div>

                        <div className="mt-2">
                          <CopyToClipboard
                            text={`http://localhost:5173/searched/${data.villeDepart}/${data.villeArrive}/${data.dateDepart}`}
                          >
                            <button
                              className="btn-copy text-center mt-2 text-xs font-medium font-['Montserrat']"
                              onClick={() => {
                                handleCopyLink();
                              }}
                            >
                              {copyLink ? "Effectuée" : "Copier le lien"}
                            </button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <img
                      src={dataPackage[index]}
                      className="rounded-2xl mt-5 h-[200px] w-full"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
            <div className="flex flex-col mt-5 w-[250px]  align-center cursor-pointer hover:transition-all hover:bg-sky-600 hover:text-white hover:transition-duration: 75ms">
              <div className="h-10 px-4 py-2 rounded hover:text-white border border-neutral-900 justify-center items-center transition-all transition-duration: 75ms hover:rounded  gap-1 inline-flex">
                <div className="text-neutral-900 text-sm font-medium font-['Montserrat']">
                  Plus de départs imminents
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-5 mt-5 text-center mx-10">
            Oh là là 😥 Il n'y a pas encore d'annonces de départs imminents.
            Vous pouvez voir les autres annonces.
          </p>
          <img src={images.Empty} />
          <div className="flex flex-col gap-2.5 mt-10 w-[250px] m-auto align-center cursor-pointer hover:transition-all hover:bg-sky-600 hover:text-white hover:transition-duration: 75ms">
            <div className="h-10 px-4 py-2 rounded hover:text-white border border-neutral-900 justify-center items-center transition-all transition-duration: 75ms hover:rounded  gap-1 inline-flex">
              <div className="text-neutral-900 text-sm font-medium font-['Montserrat']">
                Voir les autres annonces
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
