// ContactUs.js
import React from "react";
import "./ContactUs.css"; // Importer le fichier CSS
import NavBar from "../../components/navBar/NavBar";
import images from "../../assets/images/images";
import { FakeFooter } from "../../components/fakeFooter/FakeFooter";

const ContactUs = () => {
  return (
    <>
      <NavBar />
      <div className="contact-us-container" style={{ width: "auto" }}>
        <h2 style={{ textAlign: "center" }}>Contactez-nous</h2>
        <form
          style={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img className="contact-img" src={images.OutgoingCall} />
            <p className="p">+221773101160 / +221784521156</p>
          </div>
        </form>
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          Réseaux sociaux
        </h2>
        <div>
          <div>
            <a
              target="_blank"
              style={{ display: "flex", alignItems: "center", gap: "20px" }}
              href="https://www.facebook.com/RostelHighTech"
            >
              {" "}
              <img className="contact-img" src={images.facebook} />
              <p className="p">Facebook</p>
            </a>
          </div>
          <div>
            <a
              target="_blank"
              style={{ display: "flex", alignItems: "center", gap: "20px" }}
              href="https://www.instagram.com/rostelhightech/"
            >
              <img className="contact-img" src={images.instagram} />
              <p className="p">Instagram</p>
            </a>
          </div>
          <div>
            <a href="https://wa.me/+221786319559" target="_blank"  style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <img className="contact-img" src={images.whatsapImage} />
              <p className="p">Whatsapp</p>
            </a>
          </div>
        </div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15435.710270532607!2d-17.467697649999998!3d14.716687049999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xacb4cc714e94e7db%3A0x746f0e2517e84782!2sRostel%20High-Tech!5e0!3m2!1sfr!2ssn!4v1702436162616!5m2!1sfr!2ssn"
            width="560"
            height="350"
            style={{ border: "0", marginTop: "40px", borderRadius: "17px" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <FakeFooter />
    </>
  );
};

export default ContactUs;
