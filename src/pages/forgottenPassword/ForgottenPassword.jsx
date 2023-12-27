import React, { useState } from "react";

const ForgottenPassword = () => {
  const [email, setEmail] = useState("");
  const [emailExist, setEmailExist] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://192.168.1.10:5000/api/email-exist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la requête.");
      }

      const data = await response.json();
      setEmailExist(data.response);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {emailExist ? (
        <div className="flex flex-col items-center gap-5">
          <div>Un code vous a été envoyé sur votre adresse email</div>
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              autoComplete="on"
              className="w-72 h-10 rounded-lg p-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <br />
            <button
              type="submit"
              className="text-center bg-violet-active text-white p-2 rounded-xl"
            >
              Vérifier
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div>Veuillez saisir l'adresse email avec lequel le compte a été créé</div>
          <form className="flex flex-col items-center" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              autoComplete="on"
              className="w-72 h-10 rounded-lg p-3 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <br />
            <button
              type="submit"
              className="text-center bg-violet-active text-white p-2 rounded-xl"
            >
              Vérifier
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgottenPassword;
