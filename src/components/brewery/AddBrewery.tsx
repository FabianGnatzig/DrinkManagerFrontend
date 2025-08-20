import React, { useState } from "react";
import "../../App.css";
import { InputBrewery } from "../../classes/BreweryClasses";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddBrewery = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const [inputName, setInputName] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [inputCountry, setInputCountry] = useState("");

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCity(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputCountry(event.target.value);
  };

  const handlePostRequest = async () => {
    try {
      // Data to send in the POST request
      const data: InputBrewery = {
        name: inputName,
        city: inputCity,
        country: inputCountry,
      };

      const response = await fetch(`${BACKENDURL}/brewery/add`, {
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

  return (
    <div className="std-div">
      <h2>Add Brewery</h2>
      <div className="nowrap-div">
        <label className="input-label" htmlFor="name">
          Name
        </label>
        <input
          className="add-input"
          id="name"
          type="text"
          value={inputName}
          onChange={handleNameChange}
        />
      </div>
      <div className="nowrap-div">
        <label className="input-label" htmlFor="city">
          City
        </label>
        <input
          className="add-input"
          id="city"
          type="text"
          value={inputCity}
          onChange={handleCityChange}
        />
      </div>
      <div className="nowrap-div">
        <label className="input-label" htmlFor="country">
          Country
        </label>
        <input
          className="add-input"
          id="country"
          type="text"
          value={inputCountry}
          onChange={handleCountryChange}
        />
      </div>
      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddBrewery;
