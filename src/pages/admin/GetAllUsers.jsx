import React from "react";
function GetAllUsers({ user }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        gap: "20px",
        textAlign: "left",
        flexDirection: "column",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        padding: "20px",
      }}
    >
      <p>Id: {user._id["$oid"]}</p>
      <p>Nom: {user.nom}</p>
      <p>Prénom: {user.prenom}</p>
      <p>Email: {user.email}</p>
      <p>Téléphone: {user.telephone}</p>
      <p>Is Banned: {String(user.isbanned)}</p>
      <p>Is Verified: {String(user.isverified)}</p>
      <p>Statut: {user.statut}</p>
    </div>
  );
}

export default GetAllUsers;
