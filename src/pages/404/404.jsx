import React from "react";
import "./404.css";
import NavBar from "../../components/navBar/NavBar";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import images from "../../assets/images/images";

const Page404 = () => {
  return (
    <div>
      <NavBar />
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
          <img src={images.page404} style={{width:"550px"}} />
      </div>
    
      <FakeFooter />
    </div>
  );
};

export default Page404;
