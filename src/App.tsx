import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const TAX_API_KEY = import.meta.env.VITE_TAX_API_KEY;

/* // Get Coordinates ////////////////////////////////////////////////////////////////////// */

function useUserLocation() {
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

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

/* // Get Zip Code////////////////////////////////////////////////////////////////////// */

function ReverseGeocode(props: any) {
  const [zipcode, setZipcode] = useState<any>();
  const [taxData, setTaxData] = useState<any>([]);

  useEffect(() => {
    const { latitude, longitude } = props;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const result = data.results.find(
          (result: { types: string | string[] }) =>
            result.types.includes("postal_code")
        );
        setZipcode(result ? result.address_components[0].short_name : null);
      })
      .catch((error) => console.error(error));
  }, [props.latitude, props.longitude]);

  useEffect(() => {
    if (zipcode) {
      const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${zipcode}`;

      // TaxAPI headers
      const taxAPIOptions = {
        headers: {
          "X-RapidAPI-Key": `${TAX_API_KEY}`,
          "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
        },
      };

      // Fetch taxData
      axios
        .get(taxAPIUrl, taxAPIOptions)
        .then((response) => {
          setTaxData(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [zipcode]);

  console.log(taxData);

  return (
    <div>
      {zipcode ? <p>Your zipcode: {zipcode}</p> : <p></p>}{" "}
      <p>Your State: {taxData.state}</p>
      <p>Your State rate: {taxData.state_rate}</p>
      <p>Your estimated city rate: {taxData.estimated_city_rate}</p>
      <p>Your estimated county rate: {taxData.estimated_county_rate}</p>
      <p>Your estimated combined rate: {taxData.estimated_combined_rate}</p>
    </div>
  );
}

// const ZipCodeInput = () => {
//   const [inputValue, setInputValue] = useState<string>("");
//   const [isValid, setIsValid] = useState<boolean>(true);
//   const [taxData, setTaxData] = useState<any>([]);

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newValue = event.target.value;
//     setInputValue(newValue);
//     // Check if the new value is a valid zip code
//     const isValidZip = isValidZipCode(newValue);
//     setIsValid(isValidZip);
//   };

//   const handleClick = () => {
//     if (isValid) {
//       useEffect(() => {
//         const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${inputValue}`;

//         // TaxAPI headers
//         const taxAPIOptions = {
//           headers: {
//             "X-RapidAPI-Key":
//               "ccdfef5bcfmsh039706eb6485b4dp119607jsnaf780f8fff24",
//             "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
//           },
//         };

//         // Fetch taxData
//         axios
//           .get(taxAPIUrl, taxAPIOptions)
//           .then((response) => {
//             setTaxData(response.data);
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       }, []);

//       return <p>hello</p>;
//     } else {
//       alert("is not valid");
//     }
//   };

//   return (
//     <div>
//       <input
//         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-[50%]"
//         placeholder="Enter zipcode here"
//         type="text"
//         value={inputValue}
//         onChange={handleChange}
//       />
//       <button onClick={handleClick}>Get tax data</button>
//       {!isValid && <div>Please enter a valid zip code.</div>}

//     </div>
//   );
// };

{
  /* // Display ////////////////////////////////////////////////////////////////////// */
}

function App() {
  const [latitude, longitude] = useUserLocation();

  return (
    <div className="">
      <div className="flex justify-between">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>

        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>ReactJS Tax Data</h1>
      {latitude && longitude && (
        <ReverseGeocode latitude={latitude} longitude={longitude} />
      )}
      Your coordiantates: {useUserLocation()}
      <div>{/* <ZipCodeInput /> */}</div>
    </div>
  );
}

export default App;
