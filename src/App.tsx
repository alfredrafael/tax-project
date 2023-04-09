import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

{
  /* // Get Coordinates ////////////////////////////////////////////////////////////////////// */
}

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
{
  /* // Get Zip Code////////////////////////////////////////////////////////////////////// */
}

function ReverseGeocode(props: any) {
  const [zipcode, setZipcode] = useState();
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

    //  ------------------------------ //

    const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${zipcode}`;

    // TaxAPI headers
    const taxAPIOptions = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ccdfef5bcfmsh039706eb6485b4dp119607jsnaf780f8fff24",
        "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
      },
    };

    // Fetch taxData
    fetch(taxAPIUrl, taxAPIOptions)
      .then((response) => response.json())
      .then((data: []) => {
        console.log("TaxData: ", data);
        setTaxData([data]);
      })
      .catch((err) => console.error(err));
  }, [props.latitude, props.longitude]);

  return (
    <div>
      {zipcode ? <p>Your Zipcode: {zipcode}</p> : <p>Loading...</p>}{" "}
      {taxData
        ? taxData.map((item: any, i: any) => (
            <>
              <p>
                {item.state !== null ? (
                  <p>Your state: {item.state}</p>
                ) : (
                  "No state"
                )}
              </p>
              <p>
                {item.estimated_city_rate !== null ? (
                  <p>Your Estimated City Rate: {item.estimated_city_rate}</p>
                ) : (
                  "No estimate"
                )}
              </p>
              <p>
                {item.estimated_combined_rate !== null ? (
                  <p>
                    Your Estimated Combined Rate: {item.estimated_combined_rate}
                  </p>
                ) : (
                  "No combined rate available"
                )}
              </p>
              <p>
                {item.estimated_county_rate !== null ? (
                  <p>
                    Your Estimated county rate: {item.estimated_county_rate}
                  </p>
                ) : (
                  "No county rate available"
                )}
              </p>
              <p>
                {item.estimated_special_rate !== null ? (
                  <p>
                    Your Estimated county rate: {item.estimated_special_rate}
                  </p>
                ) : (
                  "No county rate available"
                )}
              </p>
            </>
          ))
        : "No tax data"}{" "}
    </div>
  );
}

{
  /* // Build Tax URL////////////////////////////////////////////////////////////////////// */
}

// function TaxData() {
//   const [taxData, setTaxData] = useState<any>([]);

//   useEffect(() => {
//     const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${"02115"}`;

//     // TaxAPI headers
//     const taxAPIOptions = {
//       method: "GET",
//       headers: {
//         "X-RapidAPI-Key": "ccdfef5bcfmsh039706eb6485b4dp119607jsnaf780f8fff24",
//         "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
//       },
//     };

//     // Fetch taxData
//     fetch(taxAPIUrl, taxAPIOptions)
//       .then((response) => response.json())
//       .then((data: []) => {
//         console.log("TaxData: ", data);
//         setTaxData([data]);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div>
//       {taxData
//         ? taxData.map((item: any, i: any) => <p>{item.state}</p>)
//         : "No tax data"}{" "}
//     </div>
//   );
// }

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
      Your coordiantates: {useUserLocation()}
      {latitude && longitude && (
        <ReverseGeocode latitude={latitude} longitude={longitude} />
      )}
    </div>
  );
}

export default App;
