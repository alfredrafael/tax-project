import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const OPENCAGE_API_KEY = import.meta.env.OPENCAGE_API_KEY;
const TAX_API_KEY = import.meta.env.TAX_API_KEY;

function App() {
  // experiment
  const [openCageData, setOpenCageData] = useState([] as any);
  //state to store zipcodes
  const [zipcode, setZipcode] = useState([] as any);
  //state to store taxData response
  const [taxData, setTaxData] = useState([] as any);
  // state to store lat and long
  const [coordinates, setCoordinates] = useState({ lat: "", long: "" });
  const [error, setError] = useState("");

  //useEffect to get datum
  useEffect(() => {
    // const geoLocationURL = `https://api.opencagedata.com/geocode/v1/json?q=${coordinates.lat},${coordinates.long}&key=0fac6e3a1d15404b80b87bcb830520c7`;
    const geoLocationURL = `https://api.opencagedata.com/geocode/v1/json?q=${coordinates.lat},${coordinates.long}&key=a0061d66ca1547e28991343c9f2db9dc`;

    // fetch openCageData
    fetch(geoLocationURL)
      .then((response) => response.json())
      .then((response) => setOpenCageData(response))
      .catch((err) => console.error("ERRORRRR", err));

    const taxAPIOptions = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ccdfef5bcfmsh039706eb6485b4dp119607jsnaf780f8fff24",
        "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
      },
    };

    // get coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCoordinates({ lat: latitude, long: longitude });
        },
        (error: any) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }

    const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${
      !openCageData ? "02115" : openCageData.results[0].components.postcode
    }`;

    // fetch taxData
    fetch(taxAPIUrl, taxAPIOptions)
      .then((response) => response.json())
      .then((response) => [response])
      .then((response) => setTaxData(response))
      .catch((err) => console.error(err));
  }, [zipcode]);

  console.log("Tax Data", taxData);
  console.log("Coordinates", coordinates);
  console.log("OpenCage Data", openCageData);
  console.log("Entered ZipCode", zipcode);

  const handleZipChange = (e: any) => {
    setZipcode(e.target.value);
  };

  return (
    <div className="App">
      <div className="flex justify-between">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>
      <div className="read-the-docs">
        <p> Your zipcode is {openCageData.results[0].components.postcode}</p>
        <p>State: {openCageData.results[0].components.state} </p>
        <p>Estimated city rate: {taxData[0].estimated_city_rate}</p>
        <p>
          Estimated combined rate:{" "}
          {taxData[0].estimated_combined_rate &&
            taxData[0].estimated_combined_rate}
        </p>
        <p>
          {openCageData.results[0].components.county === null
            ? ""
            : openCageData.results[0].components.county}
          's estimated county rate is: &nbsp;
          {taxData[0].estimated_county_rate && taxData[0].estimated_county_rate}
        </p>

        <p>
          Estimated special rate:{" "}
          {taxData[0].estimated_special_rate &&
            taxData[0].estimated_special_rate}
        </p>
        <p>State Rate: {taxData[0].state_rate}</p>
      </div>
      <br />
      <input
        type="text"
        placeholder="Enter ZipCode"
        onChange={handleZipChange}
      />
    </div>
  );
}

export default App;
