import React, { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { InputRecurringEvent } from "../../classes/EventClass";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Season } from "../../classes/SeasonClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddRecurringEvent = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputDate, setInputDate] = useState(new Date());
  const [inputSeasonID, setInputSeasonID] = useState(0);
  const [inputWeeks, setInputWeeks] = useState(1);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useT();

  const handlePostRequest = async () => {
    try {
      const data: InputRecurringEvent = {
        name: inputName,
        season_id: inputSeasonID,
        event_date: moment(inputDate).format("YYYY-MM-DD"),
        weeks: inputWeeks,
      };
      const response = await authFetch(`${BACKENDURL}/event/add-recursive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Events created!");
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
    authFetch(`${BACKENDURL}/season/all`)
      .then((response) => response.json())
      .then((data) => {
        setSeasons(data);
        if (data.length > 0) setInputSeasonID(data[0].id);
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
        <div className="card-header"><span className="card-title">{t("cardAddRecurringEvent")}</span></div>
        <div className="loading-state"><div className="spinner" />{t("loading")}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">{t("cardAddRecurringEvent")}</span></div>
        <div className="error-state">{t("errSeasonsLoad")}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t("cardAddRecurringEvent")}</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="recEventName">{t("labelName")}</label>
          <input
            className="form-input"
            id="recEventName"
            type="text"
            value={inputName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputName(e.target.value)}
            placeholder={t("phEventName")}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="recSeasonSelect">{t("labelSeason")}</label>
          <select
            className="form-select"
            id="recSeasonSelect"
            value={inputSeasonID}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInputSeasonID(Number(e.target.value))}
          >
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>{season.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="recEventDate">{t("labelStartDate")}</label>
          <DatePicker
            className="form-input"
            dateFormat="yyyy-MM-dd"
            id="recEventDate"
            selected={inputDate}
            onChange={(date) => setInputDate(date ?? new Date())}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="recWeeks">{t("labelWeeks")}</label>
          <input
            className="form-input"
            id="recWeeks"
            type="number"
            min={1}
            value={inputWeeks}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputWeeks(Math.max(1, Number(e.target.value)))}
          />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>{t("btnAddRecurringEvent")}</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddRecurringEvent;
