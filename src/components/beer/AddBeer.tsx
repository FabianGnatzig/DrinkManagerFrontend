import React, { useEffect, useState } from "react";
import { InputBeer } from "../../classes/BeerClass";
import "../../App.css";
import { Brewery } from "../../classes/BreweryClasses";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddBeer = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const [inputId, setInputID] = useState(1);
  const [inputName, setInputName] = useState("Example beer");
  const [inputBeerCode, setInputBeerCode] = useState(1234567);
  const [inputAlcohol, setInputAlcohol] = useState(5.0);
  const [inputVolume, setInputVolume] = useState(0.5);

  const [brewerys, setBrewerys] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputID(Number(event.target.value));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputBeerCode(Number(event.target.value));
  };

  const handleAlcoholChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAlcohol(Number(event.target.value));
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputVolume(Number(event.target.value));
  };

  const handlePostRequest = async () => {
    try {
      const data: InputBeer = {
        name: inputName,
        beer_code: inputBeerCode,
        brewery_id: inputId,
        alcohol: inputAlcohol,
        volume: inputVolume,
      };

      const response = await fetch(`${BACKENDURL}/beer/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Data posted successfully!");
        window.location.reload();
      } else {
        setResponseMessage("Error posting data");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponseMessage("Error: " + error.message);
      } else {
        setResponseMessage("Unkown error occurred");
      }
    }
  };

  useEffect(() => {
    fetch(`${BACKENDURL}/brewery/all`)
      .then((response) => response.json())
      .then((data) => {
        setBrewerys(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {return <p>Loading...</p>;}
  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }
  if (!brewerys) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>Add Beer</h2>
      <div className="nowrap-div">
        <label className="input-label" htmlFor="BreweryID">
          Brewery
        </label>
        <select
          className="add-input"
          id="brewerySelect"
          value={inputId}
          onChange={handleIDChange}
        >
          {brewerys.map((brewery) => (
            <option key={brewery.id} value={brewery.id}>
              {brewery.name}
            </option>
          ))}
        </select>
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="NameOfBeer">
          Name
        </label>
        <input
          className="add-input"
          id="NameOfBeer"
          type="text"
          value={inputName}
          onChange={handleNameChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="CodeOfBeer">
          Code
        </label>
        <input
          className="add-input"
          id="CodeOfBeer"
          type="number"
          value={inputBeerCode}
          onChange={handleCodeChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="AlkOfBeer">
          Alcohol
        </label>
        <input
          className="add-input"
          id="AlkOfBeer"
          type="number"
          value={inputAlcohol}
          onChange={handleAlcoholChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="VolOfBeer">
          Volume
        </label>
        <input
          className="add-input"
          id="VolOfBeer"
          type="number"
          value={inputVolume}
          onChange={handleVolumeChange}
        />
      </div>
      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddBeer;
