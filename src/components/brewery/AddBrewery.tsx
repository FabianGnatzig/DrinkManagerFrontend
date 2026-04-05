import React, { useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { InputBrewery } from "../../classes/BreweryClasses";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddBrewery = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [inputCountry, setInputCountry] = useState("");
  const t = useT();

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputCity(event.target.value);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputName(event.target.value);
  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputCountry(event.target.value);

  const handlePostRequest = async () => {
    try {
      const data: InputBrewery = { name: inputName, city: inputCity, country: inputCountry };
      const response = await authFetch(`${BACKENDURL}/brewery/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Brewery added!");
        window.location.reload();
      } else {
        setResponseMessage("Error posting data");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponseMessage("Error: " + error.message);
      } else {
        setResponseMessage("Unknown error occurred");
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t("cardAddBrewery")}</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="brewName">{t("labelName")}</label>
          <input className="form-input" id="brewName" type="text" value={inputName} onChange={handleNameChange} placeholder={t("phBreweryName")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="brewCity">{t("labelCity")}</label>
          <input className="form-input" id="brewCity" type="text" value={inputCity} onChange={handleCityChange} placeholder={t("phCity")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="brewCountry">{t("labelCountry")}</label>
          <input className="form-input" id="brewCountry" type="text" value={inputCountry} onChange={handleCountryChange} placeholder={t("phCountry")} />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>{t("btnAddBrewery")}</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddBrewery;
