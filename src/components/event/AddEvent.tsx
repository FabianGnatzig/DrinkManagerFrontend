import React, { useEffect, useState } from "react";
import "../../App.css";
import { InputEvent } from "../../classes/EventClass";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Season } from "../../classes/SeasonClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddEvent = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputDate, setInputDate] = useState(new Date());
  const [inputSeasonID, setInputSeasonID] = useState(0);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputName(event.target.value);
  const handleSeasonIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputSeasonID(Number(event.target.value));

  const handlePostRequest = async () => {
    try {
      const data: InputEvent = {
        name: inputName,
        season_id: inputSeasonID,
        event_date: moment(inputDate).format("YYYY-MM-DD"),
      };
      const response = await fetch(`${BACKENDURL}/event/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Event added!");
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
    fetch(`${BACKENDURL}/season/all`)
      .then((response) => response.json())
      .then((data) => {
        setSeasons(data);
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
        <div className="card-header"><span className="card-title">Add Event</span></div>
        <div className="loading-state"><div className="spinner" />Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Add Event</span></div>
        <div className="error-state">Failed to load seasons</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Add Event</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="eventName">Name</label>
          <input className="form-input" id="eventName" type="text" value={inputName} onChange={handleNameChange} placeholder="Event name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="seasonSelect">Season</label>
          <select className="form-select" id="seasonSelect" value={inputSeasonID} onChange={handleSeasonIDChange}>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>{season.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="eventDate">Date</label>
          <DatePicker
            className="form-input"
            dateFormat="yyyy-MM-dd"
            id="eventDate"
            selected={inputDate}
            onChange={(date) => setInputDate(date ?? new Date())}
          />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>Add Event</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddEvent;
