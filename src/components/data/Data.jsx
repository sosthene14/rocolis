const getAllAds = async () => {
  try {
    const response = await fetch("http://192.168.1.10:5000/api/get-all-ads", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("La requête GET a échoué.");
    }
    console.log("test");
    const responseData = await response.json();
    return responseData.ads;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error to propagate it further if needed
  }
};

export default getAllAds;
