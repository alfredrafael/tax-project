import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const TAX_API_KEY = import.meta.env.VITE_TAX_API_KEY;
const TAX_API_PROVIDER = import.meta.env.VITE_TAX_API_PROVIDER;

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
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
    setIsLoading(false);
  }, [props.latitude, props.longitude]);

  useEffect(() => {
    if (zipcode) {
      const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${zipcode}`;

      // TaxAPI headers
      const taxAPIOptions = {
        headers: {
          "X-RapidAPI-Key": `${TAX_API_KEY}`,
          "X-RapidAPI-Host": `${TAX_API_PROVIDER}`,
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

  // console.log(taxData);

  return (
    <div className="text-left">
      {zipcode && !isLoading ? (
        <span>
          <p>Your zipcode: {zipcode}</p>
          <p>Your State: {taxData.state}</p>
          <p>Your State rate: {taxData.state_rate}</p>
          <p>Your estimated city rate: {taxData.estimated_city_rate}</p>
          <p>Your estimated county rate: {taxData.estimated_county_rate}</p>
          <p>
            Your estimated combined rate: {taxData.estimated_combined_rate}
          </p>{" "}
        </span>
      ) : (
        "... loading"
      )}
    </div>
  );
}

interface TaxData {
  state: string;
  state_rate: string;
  estimated_city_rate: number;
  estimated_county_rate: number;
  estimated_combined_rate: number;
}

const TaxDataRequest = () => {
  const [zipcode, setZipcode] = useState("");
  const [persistentZipcode, setPersistentZipcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [taxData, setTaxData] = useState<TaxData | undefined>();

  const isValidZipCode = (zipCode: string): boolean => {
    // Regular expression for validating US zip codes
    const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;
    return zipCodeRegex.test(zipCode);
  };

  const handleClick = async () => {
    !isValidZipCode(zipcode) && alert("Please enter a valid zipcode");

    setIsLoading(true);

    const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${zipcode}`;
    // TaxAPI headers
    const taxAPIOptions = {
      headers: {
        "X-RapidAPI-Key": `${TAX_API_KEY}`,
        "X-RapidAPI-Host": `${TAX_API_PROVIDER}`,
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
    setIsLoading(false);
    setPersistentZipcode(zipcode);
    setZipcode("");
  };

  return (
    <div className="justify-left">
      <button className="mb-4" onClick={handleClick}>
        Get city tax rates per zipcode
      </button>

      <input
        type="text"
        id="zipcode"
        placeholder="Enter zipcode here"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline max-w-[80%] md:max-w-[40%] md:m-4"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
      />
      {isLoading && <p>loading...</p>}
      {taxData && (
        <div className="text-left mt-4">
          <p>Zipcode: {persistentZipcode}</p>
          <p>State: {taxData.state}</p>
          <p>State rate: {taxData.state_rate}</p>
          <p>Estimated city rate: {taxData.estimated_city_rate}</p>
          <p>Estimated county rate: {taxData.estimated_county_rate}</p>
          <p>Estimated combined rate: {taxData.estimated_combined_rate}</p>
        </div>
      )}
    </div>
  );
};

{
  /* // Display ////////////////////////////////////////////////////////////////////// */
}

function App() {
  const [latitude, longitude] = useUserLocation();
  const [displayCurrent, setDisplayCurrent] = useState(false);

  const handleDisplayClick = () => {
    setDisplayCurrent(!displayCurrent);
  };

  function DisplayCurrentLocationTaxRates() {
    return (
      <div className="flex justify-center">
        <button className="right" onClick={handleDisplayClick}>
          {displayCurrent ? "Hide" : "Get"} tax data as per your current
          location
        </button>
      </div>
    );
  }

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
      {displayCurrent && (
        <div>
          {latitude && longitude && (
            <ReverseGeocode latitude={latitude} longitude={longitude} />
          )}
        </div>
      )}
      <div>
        <DisplayCurrentLocationTaxRates />
        <br />
        <TaxDataRequest />
      </div>
    </div>
  );
}

export default App;
