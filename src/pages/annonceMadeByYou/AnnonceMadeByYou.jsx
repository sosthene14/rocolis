import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import _, { set } from "lodash";

import "./AnnonceMadeByYou.css";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";
import Succes from "../../components/succes/succes";
import Error from "../../components/error/Error";
import Select from "react-select";
import Selector from "../publishAd/Selector";
import { Country, State, City } from "country-state-city";
import NavBar from "../../components/navBar/NavBar";
import MyAdd from "../../components/searchForm/myAdd/MyAdd";

const AnnonceMadeByYou = ({ data }) => {
  return (
    <div>
      <NavBar />
      <MyAdd data={data} />
      <FakeFooter />
    </div>
  );
};

export default AnnonceMadeByYou;
