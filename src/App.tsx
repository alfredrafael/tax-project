import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  //state to store zipcodes
  const [zipcode, setZipcode] = useState("02115");
  //state to store taxData response
  const [taxData, setTaxData] = useState([] as any);
  // state to store lat and long

  const [coordinates, setCoordinates] = useState({ lat: null, long: null });
  const [error, setError] = useState(null);

  //useEffect to get datum
  useEffect(() => {
    const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${zipcode}`;
    const geoLocationURL = `https://api.opencagedata.com/geocode/v1/json?q=${coordinates.lat},${coordinates.long}&key=0fac6e3a1d15404b80b87bcb830520c7`;

    const taxAPIOptions = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ccdfef5bcfmsh039706eb6485b4dp119607jsnaf780f8fff24",
        "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
      },
    };

    // fetch taxData
    fetch(taxAPIUrl, taxAPIOptions)
      .then((response) => response.json())
      .then((response) => [response])
      .then((response) => setTaxData(response))
      .catch((err) => console.error(err));
    // get coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCoordinates({ lat: latitude, long: longitude });
        },
        (error: any) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
    // fetch zipCode
    fetch(geoLocationURL)
      .then((response) => response.json())
      .then((response) => setZipcode(response.results[0].components.postcode))
      .then((response) => console.log(response.results[0].components.postcode))
      .catch((err) => console.error("ERRORRRR", err));
  }, []);

  // console.log(zipcode);

  return (
    <div className="App">
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Install & Setup Vite + React + Typescript + Tailwind CSS 3!
        </h1>
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button>Your zipcode is {!zipcode ? "loading" : zipcode}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
