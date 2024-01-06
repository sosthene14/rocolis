import React from "react";
import images from "../../assets/images/images";

const SectionDepartDest = () => {
  return (
    <div className="flex justify-center mt-20 flex-wrap items-center gap-20">
      <div
        className="rounded-xl w-[300px] h-[430px] md:w-[530px] md:h-[500px] m-auto"
        style={{
          cursor: "pointer",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(0deg, rgba(11,11,11,1) 0%, rgba(25,23,23,0.4234943977591037) 51%), url(${images.brazza_})`,
        }}
      >
        <div className="mt-[190px]">
          <div>
            <div className="w-[389px] text-center text-white text-[40px] font-normal font-['Archivo Black']">
              <p>Départ</p>
            </div>
            <div className="w-[300px] mx-auto text-center text-white text-base font-normal font-['Montserrat']">
              <p className="text-center">
                Rechercher des personnes et des lieux de départ vers nos
                destinations les plus populaires
              </p>
            </div>
          </div>
          <div className="flex-col justify-start items-start gap-2.5 flex"></div>
        </div>
      </div>
      <div
        className="rounded-xl w-[300px] h-[430px] md:w-[530px] md:h-[500px] m-auto"
        style={{
          cursor: "pointer",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `linear-gradient(0deg, rgba(11,11,11,1) 0%, rgba(25,23,23,0.4234943977591037) 51%), url(${images.brazza_})`,
        }}
      >
        <div className="mt-[190px]">
          <div>
          <div className="w-[389px] text-center text-white text-[40px] font-normal font-['Archivo Black']">
              <p>Départ</p>
            </div>
            <div className="w-[300px] mx-auto text-center text-white text-base font-normal font-['Montserrat']">
              <p className="text-center">
                Rechercher des personnes et des lieux de départ vers nos
                destinations les plus populaires
              </p>
            </div>
          </div>
          <div className="flex-col justify-start items-start gap-2.5 flex"></div>
        </div>
      </div>
    </div>
  );
};

export default SectionDepartDest;
