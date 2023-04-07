import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  //state to store zipcodes
  const [zipcode, setZipcode] = useState("02116");
  //state to store taxData response
  const [taxData, setTaxData] = useState([] as any);

  //useState to get data
  useEffect(() => {
    const taxAPIUrl = `https://u-s-a-sales-taxes-per-zip-code.p.rapidapi.com/${zipcode}`;

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "ccdfef5bcfmsh039706eb6485b4dp119607jsnaf780f8fff24",
        "X-RapidAPI-Host": "u-s-a-sales-taxes-per-zip-code.p.rapidapi.com",
      },
    };

    fetch(taxAPIUrl, options)
      .then((response) => response.json())
      // .then((response) => console.log("Tax response", response))
      .then((response) => [response])
      .then((response) => setTaxData(response))
      .catch((err) => console.error(err));
  }, [zipcode]);

  console.log("Tax Data", taxData);

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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
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
