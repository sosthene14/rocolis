import React from "react";
import images from "../../assets/images/images";
import { FaPhoneAlt } from "react-icons/fa";
import UserIcon from "../../components/userIcon/UserIcon";
import { Navbar } from "flowbite-react";
import Hamburger from "hamburger-react";
import { useState, useRef, useEffect } from "react";
import { FaBed } from "react-icons/fa";
import { FaPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import handleJWT from "../../components/handleJWT/JWT";

function Header() {
  const [isOpen, setOpen] = useState(false);
  let optionDiv = useRef();
  let hamburgerDiv = useRef();
  console.log(handleJWT() <= 0);
  const menuItems = [
    {
      icon: <FaBed />,
      text: "Acceuil",
      link: "/",
    },
    {
      icon: <FaPlane />,
      text: "Destination",
      link: "/destinations",
    },
    {
      icon: <FaPhoneAlt />,
      text: "Nous contacter",
      link: "/contacter-nous",
    },
  ];
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target !== undefined) {
        if (
          optionDiv.current &&
          !optionDiv.current.contains(e.target) &&
          e.target.nodeName !== "HTML" &&
          !hamburgerDiv.current.contains(e.target)
        ) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <nav>
      <div className="flex justify-between items-center px-1 lg:px-10 pt-5 pb-5">
        <div className=" hidden gap-8 xl:flex lg:flex md:hidden">
          {menuItems.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              {item.icon}
              <p className="text-neutral-900 text-sm font-semibold cursor-pointer">
                <a
                  href={item.link}
                  className="text-neutral-900 text-sm font-semibold cursor-pointer hover:text-violet-hover transition-all duration-150"
                >
                  {item.text}
                </a>
              </p>
            </div>
          ))}
        </div>
        <div>
          <p
            className="text-sky-600 text-[22px] lg:text-[32px] font-semibold cursor-pointer drop-shadow-lg"
            onClick={() => (window.location.href = "/")}
          >
            ROCOLIS
          </p>
        </div>
        <div className="flex gap-5 items-center">
          <div>
            <UserIcon />
          </div>

          <div className="">
            <a href="/publier">
              <button className="w-[80px] md:w-[100px] h-12 bg-sky-600 rounded-lg flex-col justify-center items-center gap-2 inline-flex text-center text-sm font-semibold relative px-5 py-3 text-white drop-shadow transition-all transition-duration: 75ms hover:bg-sky-700 transition-duration: 75ms">
                Publier
              </button>
            </a>
          </div>
          <div className="lg:hidden">
            <div
              ref={hamburgerDiv}
              className="hover:bg-slate-100 rounded-2xl p-3"
              id="humbergerId"
            >
              <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>

            <div>
              {isOpen ? (
                <motion.div
                  animate={{ x: 0 }}
                  transition={{ ease: "easeOut", duration: 2 }}
                  style={{ position: "relative" }}
                >
                  <div ref={optionDiv}>
                    <div className="flex gap-5 flex-col absolute z-10 bg-slate-100 p-5 rounded-lg right-0 top-[25px] w-[200px]">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex gap-2 items-center"
                        >
                          {item.icon}
                          <p className="text-neutral-900 text-sm font-semibold cursor-pointer">
                            <a
                              href={item.link}
                              className="text-neutral-900 text-sm font-semibold cursor-pointer hover:text-violet-hover transition-all duration-150"
                            >
                              {item.text}
                            </a>
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {handleJWT().length <= 0 ? (
        <div className="flex gap-5 absolute  right-5 top-[80px] md:hidden">
          <a
            href="/signin"
            className=" font-medium hover:bg-slate-300 p-1 rounded-md"
          >
            <button style={{ fontSize: "14px", color: "steelblue" }}>
              Se connecter
            </button>
          </a>
          <a
            href="/signup"
            className=" font-medium hover:bg-slate-300 p-1 rounded-md"
          >
            <button style={{ fontSize: "14px", color: "steelblue" }}>
              S'inscrire
            </button>
          </a>
        </div>
      ) : null}
    </nav>
  );
}

export default Header;
