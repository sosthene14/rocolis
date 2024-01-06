import React, { useState, useRef, useEffect } from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import LikesStars from "./LikesStars";
import { FaWhatsapp } from "react-icons/fa";
import images from "../../assets/images/images";
import { FaArrowRight } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
} from "react-share";
function Slider2() {
  const [copyLink, setCopyLink] = useState(false);
  const [handleShare, setHandleShare] = useState(false);
  let shareMenu = useRef();
  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (
        shareMenu.current &&
        !shareMenu.current.contains(e.target) &&
        e.target.nodeName !== "HTML" &&
        e.target.id !== "partager"
      ) {
        setHandleShare(false);
      }
    });
  });
  function handleCopyLink() {
    setCopyLink(true);
    setTimeout(() => {
      setCopyLink(false);
    }, 1000);
  }
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-center w-full h-full py-24 sm:py-8 px-4">
        {/* Carousel for desktop and large size devices */}
        <CarouselProvider
          className="lg:block hidden"
          naturalSlideWidth={100}
          isIntrinsicHeight={true}
          totalSlides={12}
          visibleSlides={4}
          step={1}
          infinite={true}
        >
          <div className="w-full relative flex items-center justify-center">
            <ButtonBack
              role="button"
              aria-label="slide backward"
              className="absolute z-30 left-0 ml-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
              id="prev"
            >
              <svg
                width={8}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7L7 13"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonBack>
            <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className="h-[600px] flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700"
                >
                  <Slide
                    index={0}
                    className="rounded-2xl p-8 flex-col gap-5 bg-white shadow justify-center items-center cursor-pointer"
                    style={{
                      width: "60vh",
             
                      paddingTop: "20px",
                      paddingBottom: "20px",
                      WebkitBoxShadow:
                        "26px 20px 0px -4px rgba(25, 118, 210, 0.39)",
                      MozBoxShadow:
                        "26px 20px 0px -4px rgba(25, 118, 210, 0.39)",
                      boxShadow: "26px 20px 0px -4px rgba(25, 118, 210, 0.39)",
                    }}
                  >
                    <div className="flex flex-col relative w-full sm:w-auto">
                      <div className=" text-neutral-900 text-[23px] font-normal font-['Angkor'] mb-5">
                        "“data.description”"
                        <br />
                      </div>
                      <div className="opacity-50 text-neutral-900 text-sm font-medium font-['Angkor'] flex items-center gap-2">
                        <p>{"data.locations[0]"}</p>
                        <FaArrowRight />
                        <p>{"data.locations[1]"}</p>
                      </div>
                      <div className="text-right text-neutral-900 text-sm font-normal font-['Angkor']">
                        <p>Voir plus</p>
                      </div>
                      <div>
                        <LikesStars />
                      </div>
                      <div className="w-[168px] text-neutral-900 text-sm font-normal font-['Angkor']">
                        <p>{"data.name"}</p>
                      </div>
                      <div className="w-[268px] opacity-50 text-neutral-900 text-xs font-medium font-['Montserrat']">
                        <p>With ROCOLIS It’s never been seen before</p>
                      </div>
                      <div className="flex justify-between my-1 mt-5">
                        <div className=" h-6 pt-[7px] justify-center flex items-center gap-2">
                          <FaWhatsapp />
                          <div className="grow shrink cursor-pointer basis-0 opacity-40 text-neutral-900 text-xs font-normal font-['Angkor']">
                            Contacter-Moi
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-5">
                          <div className=" h-6 pt-[7px] justify-center flex items-center gap-2">
                            <FaShare />
                            <div
                              onClick={() => setHandleShare(!handleShare)}
                              id="partager"
                              className="grow cursor-pointer shrink basis-0 opacity-40 text-neutral-900 text-xs font-normal font-['Angkor']"
                            >
                              Partager
                            </div>
                          </div>
                          <div
                            ref={shareMenu}
                            className={
                              handleShare
                                ? "z-10 bg-white shadow-sm p-3 rounded-xl ml-[-40px] mt-[35px] absolute"
                                : "hidden"
                            }
                          >
                            <div className="flex gap-2">
                              <FacebookShareButton
                                url={`https://unidocs-sn.netlify.app/code_shared/`}
                              >
                                <FacebookIcon round={true} size={30} />
                              </FacebookShareButton>
                              <WhatsappShareButton
                                url={`https://unidocs-sn.netlify.app/code_shared/`}
                              >
                                <WhatsappIcon
                                  round={true}
                                  size={30}
                                ></WhatsappIcon>
                              </WhatsappShareButton>
                              <TelegramShareButton
                                url={`https://unidocs-sn.netlify.app/code_shared/`}
                              >
                                <TelegramIcon
                                  round={true}
                                  size={30}
                                ></TelegramIcon>
                              </TelegramShareButton>
                            </div>

                            <div>
                              <CopyToClipboard
                                text={`https://unidocs-sn.netlify.app/code_shared/`}
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
                          src={images.package1}
                          className="rounded-2xl mt-5"
                        />
                      </div>
                    </div>
                  </Slide>
                  <Slide index={1}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={2}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={3}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={4}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={5}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={6}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={7}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={8}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="texlg:t-xl le leading-4 text-basealg:ding-tight text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={9}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={10}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={11}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                </div>
              </Slider>
            </div>
            <ButtonNext
              role="button"
              aria-label="slide forward"
              className="absolute z-30 right-0 mr-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              id="next"
            >
              <svg
                width={8}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L1 13"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>

        {/* Carousel for tablet and medium size devices */}
        <CarouselProvider
          className="lg:hidden md:block hidden"
          naturalSlideWidth={100}
          isIntrinsicHeight={true}
          totalSlides={12}
          visibleSlides={2}
          step={1}
          infinite={true}
        >
          <div className="w-full relative flex items-center justify-center">
            <ButtonBack
              role="button"
              aria-label="slide backward"
              className="absolute z-30 left-0 ml-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
              id="prev"
            >
              <svg
                width={8}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7L7 13"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonBack>
            <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className="h-full flex lg:gap-8 md:gap-6 gap-14 items-center justify-start transition ease-out duration-700"
                >
                  <Slide index={0}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 1
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={1}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={2}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={3}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={4}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={5}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={6}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={7}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={8}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="texlg:t-xl le leading-4 text-basealg:ding-tight text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={9}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={10}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={11}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                </div>
              </Slider>
            </div>
            <ButtonNext
              role="button"
              aria-label="slide forward"
              className="absolute z-30 right-0 mr-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              id="next"
            >
              <svg
                width={8}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L1 13"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>

        {/* Carousel for mobile and Small size Devices */}
        <CarouselProvider
          className="block md:hidden "
          naturalSlideWidth={100}
          isIntrinsicHeight={true}
          totalSlides={12}
          visibleSlides={1}
          step={1}
          infinite={true}
        >
          <div className="w-full relative flex items-center justify-center">
            <ButtonBack
              role="button"
              aria-label="slide backward"
              className="absolute z-30 left-0 ml-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 cursor-pointer"
              id="prev"
            >
              <svg
                width={8}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 1L1 7L7 13"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonBack>
            <div className="w-full h-full mx-auto overflow-x-hidden overflow-y-hidden">
              <Slider>
                <div
                  id="slider"
                  className="h-full w-full flex lg:gap-8 md:gap-6 items-center justify-start transition ease-out duration-700"
                >
                  <Slide index={0}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 1
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={1}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={2}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={3}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={4}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={5}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={6}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={7}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={8}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/fDngH9G/carosel-1.png"
                        alt="black chair and white table"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="texlg:t-xl le leading-4 text-basealg:ding-tight text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={9}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/DWrGxX6/carosel-2.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={10}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/tCfVky2/carosel-3.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                  <Slide index={11}>
                    <div className="flex flex-shrink-0 relative w-full sm:w-auto">
                      <img
                        src="https://i.ibb.co/rFsGfr5/carosel-4.png"
                        alt="sitting area"
                        className="object-cover object-center w-full"
                      />
                      <div className="bg-gray-800 bg-opacity-30 absolute w-full h-full p-6">
                        <h2 className="lg:text-xl leading-4 text-base lg:leading-5 text-white">
                          Catalog 2
                        </h2>
                        <div className="flex h-full items-end pb-6">
                          <h3 className="text-xl lg:text-2xl font-semibold leading-5 lg:leading-6 text-white">
                            Minimal Interior
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Slide>
                </div>
              </Slider>
            </div>
            <ButtonNext
              role="button"
              aria-label="slide forward"
              className="absolute z-30 right-0 mr-8 focus:outline-none focus:bg-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              id="next"
            >
              <svg
                width={8}
                height={14}
                viewBox="0 0 8 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L1 13"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </ButtonNext>
          </div>
        </CarouselProvider>
      </div>
    </div>
  );
}

export default Slider2;
