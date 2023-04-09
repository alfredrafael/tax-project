import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
// const TAX_API_KEY = import.meta.env.TAX_API_KEY;

{
  /* // Get Coordinates ////////////////////////////////////////////////////////////////////// */
}

function useUserLocation() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  return [latitude, longitude];
}
{
  /* // Get Zip Code////////////////////////////////////////////////////////////////////// */
}

function ReverseGeocode(props: any) {
  const [zipcode, setZipcode] = useState(null);

  useEffect(() => {
    const { latitude, longitude } = props;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const result = data.results.find((result) =>
          result.types.includes("postal_code")
        );
        setZipcode(result ? result.address_components[0].short_name : null);
      })
      .catch((error) => console.error(error));
  }, [props.latitude, props.longitude]);

  return <div>{zipcode ? <p>Zipcode: {zipcode}</p> : <p>Loading...</p>}</div>;
}

{
  /* // Build Tax URL////////////////////////////////////////////////////////////////////// */
}
function TaxData() {
  const [taxData, setTaxData] = useState(null);
  useEffect(() => {
    async function fetchTaxData() {
      const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/75082`;

      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "ccdfef5bcfmsh039706eb6485b4dp119607jsnaf780f8fff24",
          "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
        },
      };
      const response = await fetch(
        "https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/75082",
        options
      );
      const jsonResponse = await response.json();
      setTaxData(jsonResponse);
    }
    fetchTaxData();
  }, []);

  return <div>{taxData ? <p>{taxData}</p> : "No tax data"}</div>;
}

{
  /* // Display ////////////////////////////////////////////////////////////////////// */
}

function App() {
  const [latitude, longitude] = useUserLocation();

  return (
    <div>
      <div className="flex justify-between">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      {useUserLocation()}
      {latitude && longitude && (
        <ReverseGeocode latitude={latitude} longitude={longitude} />
      )}
      {/* <TaxData /> */}
    </div>
  );
}

export default App;
