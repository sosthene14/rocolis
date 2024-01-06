import React from "react";
import images from "../../assets/images/images";

const SectionPlanification = () => {
  const datas = [
    {
      countryName: "Sénégal",
      cityName: "Dakar",
      nickname: "La Terranga",
      img: images.senegal,
    },
    {
      countryName: "Cote d'Ivoire",
      cityName: "Abidjan",
      nickname: "Babi",
      img: images.coteIvoire,
    },
    {
      countryName: "Gabon",
      cityName: "Libreville",
      nickname: "Libreville",
      img: images.gabon,
    },
    {
      countryName: "Congo B/Z",
      cityName: "Brazzaville",
      nickname: "Brazza la verte",
      img: images.congoBz,
    },
    {
      countryName: "Cameroun",
      cityName: "Yaoundé",
      nickname: "la ville aux sept collines",
      img: images.cameroun,
    },
    {
      countryName: "RDC",
      cityName: "Kinshasa",
      nickname: "Kin",
      img: images.rdc,
    },
    {
      countryName: "Mali",
      cityName: "Bamako",
      nickname: "La coquette",
      img: images.mali,
    },
    {
      countryName: "Nigeria",
      cityName: "Lagos",
      nickname: "Lagos",
      img: images.nigeria,
    },
    {
      countryName: "Afrique du Sud",
      cityName: "Cape Town",
      nickname: "la ville mère",
      img: images.afriqueSud,
    },
  ];
  return (
    <div className="flex-col mx-52  ">
      <div className="flex justify-center items-center gap-10  mt-20 flex-wrap w-96 md:w-full ">
        <div className="flex flex-col md:gap-0 mx-8 md:mx-0 ">
          <div className="h-9 text-black text-[22px] md:text-[32px] font-semibold font-['Montserrat']">
            <p className="text-center">Planifiez votre envoi parfait</p>
          </div>
          <div className="opacity-75  text-black text-md md:text-xl mt-5 font-medium font-['Montserrat']">
            <p className="text-center">Toutes les destinations possible</p>
          </div>
        </div>

      </div>
      {/*  */}
      <div className="flex flex-wrap justify-center items-start gap-0 md:gap-10 mt-20">
        {datas.map((data,index) => (
          <div
            key={index}
            className="p-3 bg-white rounded-2xl w-[300px] shadow justify-center items-center gap-4 flex mt-10 cursor-pointer"
          >
            <div className="w-[90px] h-[90px] flex-col justify-start items-center inline-flex">
              <img
                className="self-stretch grow shrink basis-0 rounded-lg"
                src={data.img}
                alt="Placeholder"
              />
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
              <div className="self-stretch opacity-70 text-neutral-900 text-base font-semibold font-['Montserrat']">
                <p className="">{data.countryName}, {data.cityName}</p>
                
              </div>
              <div className="self-stretch justify-start items-start gap-2 inline-flex">
                <div className="text-neutral-900 text-sm font-medium font-['Montserrat']">
                  
                  <p>{data.nickname}</p>
                </div>
                <div className="text-neutral-900 text-sm font-medium font-['Montserrat']">
                  •
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2.5 mt-10 w-[250px] m-auto align-center cursor-pointer hover:transition-all hover:bg-sky-600 hover:text-white hover:transition-duration: 75ms">
          <div className="h-10 px-4 py-2 rounded hover:text-white border border-neutral-900 justify-center items-center transition-all transition-duration: 75ms hover:rounded  gap-1 inline-flex">
            <div className="text-neutral-900 text-sm font-medium font-['Montserrat']">
              Voir plus de destinations
            </div>
          </div>
        </div>
    </div>
  );
};

export default SectionPlanification;
