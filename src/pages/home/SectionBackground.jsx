import React from "react";
import images from "../../assets/images/images";

const SectionBackground = () => {
  const backgroundStyle = {
    backgroundImage: `url(${images.backgroundImage})`,
    backgroundSize: "cover",
    width: "auto",
    height: "500px",
    backgroundPosition: "center center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div>
      <div style={backgroundStyle}>
        <div className="mb-[70px]">
          <div className="flex-col justify-start items-center gap-1 flex">
            <div
              style={{ fontFamily: "Actor" }}
              className="text-center text-white text-[45px] font-normal font-['Actor']"
            >
              BIENVENUE SUR{" "}
            </div>
            <div
              style={{ fontFamily: "Abril Fatface" }}
              className="text-center text-white text-[50px] md:text-[80px] font-normal font-['Abril Fatface'] uppercase"
            >
              ROCOLIS
            </div>
          </div>
          <div className="text-center text-white text-xl font-semibold font-['Montserrat']">
            Votre destination finale pour la vente des colis
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionBackground;
