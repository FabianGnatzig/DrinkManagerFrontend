import React, { useEffect, useState } from "react";
import { InputBeer } from "../../classes/BeerClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { Brewery } from "../../classes/BreweryClasses";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddBeer = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const [inputId, setInputID] = useState(1);
  const [inputName, setInputName] = useState("");
  const [inputBeerCode, setInputBeerCode] = useState(0);
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
      const response = await authFetch(`${BACKENDURL}/beer/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Beer added!");
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

  useEffect(() => {
    authFetch(`${BACKENDURL}/brewery/all`)
      .then((response) => response.json())
      .then((data) => {
        setBrewerys(data);
        if (data.length > 0) setInputID(data[0].id);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Add Beer</span></div>
        <div className="loading-state"><div className="spinner" />Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Add Beer</span></div>
        <div className="error-state">Failed to load breweries</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Add Beer</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="brewerySelect">Brewery</label>
          <select className="form-select" id="brewerySelect" value={inputId} onChange={handleIDChange}>
            {brewerys.map((brewery) => (
              <option key={brewery.id} value={brewery.id}>{brewery.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="beerName">Name</label>
          <input className="form-input" id="beerName" type="text" value={inputName} onChange={handleNameChange} placeholder="Beer name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="beerCode">Code</label>
          <input className="form-input" id="beerCode" type="number" value={inputBeerCode} onChange={handleCodeChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="beerAlc">Alcohol %</label>
          <input className="form-input" id="beerAlc" type="number" step="0.1" value={inputAlcohol} onChange={handleAlcoholChange} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="beerVol">Volume (L)</label>
          <input className="form-input" id="beerVol" type="number" step="0.1" value={inputVolume} onChange={handleVolumeChange} />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>Add Beer</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddBeer;
