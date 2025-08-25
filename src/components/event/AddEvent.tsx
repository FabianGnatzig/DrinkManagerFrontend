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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const handleSeasonIDChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setInputSeasonID(Number(event.target.value));
  };

  const handlePostRequest = async () => {
    try {
      const data: InputEvent = {
        name: inputName,
        season_id: inputSeasonID,
        event_date: moment(inputDate).format("YYYY-MM-DD"),
      };

      const response = await fetch(`${BACKENDURL}/event/add`, {
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

  if (loading) return <p>Loading...</p>;

  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }

  if (!seasons) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>Add Event</h2>
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
        <label className="input-label" htmlFor="name">
          Season
        </label>
        <select
          className="add-input"
          id="seasonSelect"
          value={inputSeasonID}
          onChange={handleSeasonIDChange}
        >
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="date">
          Date
        </label>
        <DatePicker
          className="add-input"
          dateFormat="yyyy-MM-dd"
          id="date"
          selected={inputDate}
          onChange={(date) => setInputDate(date ?? new Date())}
        />
      </div>
      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddEvent;
