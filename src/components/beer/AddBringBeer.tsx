import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Beer, InputBringBeer, OpenUserBeer } from "../../classes/BeerClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { User } from "../../classes/UserClass";
import { SeasonEvent } from "../../classes/EventClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddBringBeer = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputUserBeer, setInputUserBeer] = useState(1);
  const [inputEvent, setInputEvent] = useState(0);
  const [inputUser, setInputUser] = useState(0);
  const [inputBeer, setInputBeer] = useState(0);

  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<SeasonEvent[]>([]);
  const [userBeers, setUserBeer] = useState<OpenUserBeer[]>([]);
  const [beers, setBeer] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useT();

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputUser(Number(event.target.value));
  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputEvent(Number(event.target.value));
const handleUserBeer = (event: React.ChangeEvent<HTMLSelectElement>) => setInputUserBeer(Number(event.target.value));

  const filteredUserBeer = userBeers.filter((ub) => ub.user_id === inputUser);
  const beerOptions = beers.map((b) => ({ value: b.id, label: b.name }));

  const handlePostRequest = async () => {
    try {
      const data: InputBringBeer = {
        event_id: inputEvent,
        user_id: inputUser,
        user_beer_id: inputUserBeer,
        beer_id: inputBeer,
      };
      const response = await authFetch(`${BACKENDURL}/bringbeer/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Entry added!");
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
    const fetchData = async () => {
      try {
        const [userRes, eventRes, userbeerRes, beerRes] = await Promise.all([
          authFetch(`${BACKENDURL}/user/all`),
          authFetch(`${BACKENDURL}/event/all`),
          authFetch(`${BACKENDURL}/service/all_open_beer`),
          authFetch(`${BACKENDURL}/beer/all`),
        ]);
        const usersData = await userRes.json();
        const eventData = await eventRes.json();
        const userBeerData = await userbeerRes.json();
        const beerData = await beerRes.json();
        setUsers(usersData);
        setEvents(eventData);
        setUserBeer(userBeerData);
        setBeer(beerData);
        if (usersData.length > 0) setInputUser(usersData[0].id);
        if (eventData.length > 0) setInputEvent(eventData[0].id);
        if (beerData.length > 0) setInputBeer(beerData[0].id);
        setLoading(false);
      } catch (error) {
        setError(error as never);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">{t("cardAddBringBeer")}</span></div>
        <div className="loading-state"><div className="spinner" />{t("loading")}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">{t("cardAddBringBeer")}</span></div>
        <div className="error-state">{t("errDataLoad")}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t("cardAddBringBeer")}</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="bbEvent">{t("labelEvent")}</label>
          <select className="form-select" id="bbEvent" value={inputEvent} onChange={handleEventChange}>
            {events.map((event) => (
              <option key={event.id} value={event.id}>#{event.id} — {event.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bbUser">{t("labelUser")}</label>
          <select className="form-select" id="bbUser" value={inputUser} onChange={handleUserChange}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bbFine">{t("labelFine")}</label>
          <select className="form-select" id="bbFine" value={inputUserBeer} onChange={handleUserBeer}>
            <option value={0}>— None —</option>
            {filteredUserBeer.map((ub) => (
              <option key={ub.user_beer_id} value={ub.user_beer_id}>
                {ub.user} — {ub.kind}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bbBeer">{t("labelBeer")}</label>
          <Select
            inputId="bbBeer"
            options={beerOptions}
            value={beerOptions.find((o) => o.value === inputBeer) ?? null}
            onChange={(opt) => { if (opt) setInputBeer(opt.value); }}
            placeholder={t("phSearchBeers")}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
              control: (base, state) => ({
                ...base,
                background: "var(--surface-2)",
                borderColor: state.isFocused ? "var(--primary)" : "var(--border)",
                boxShadow: state.isFocused ? "0 0 0 3px var(--primary-glow)" : "none",
                borderRadius: 8,
                fontSize: 13,
                minHeight: 36,
                "&:hover": { borderColor: "var(--border-hover)" },
              }),
              menu: (base) => ({
                ...base,
                background: "var(--surface-2)",
                border: "1px solid var(--border-hover)",
                borderRadius: 8,
                boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                zIndex: 999,
              }),
              option: (base, state) => ({
                ...base,
                background: state.isFocused ? "var(--surface-3)" : "transparent",
                color: state.isFocused ? "var(--text)" : "var(--text-muted)",
                fontSize: 13,
                cursor: "pointer",
              }),
              singleValue: (base) => ({ ...base, color: "var(--text)" }),
              input: (base) => ({ ...base, color: "var(--text)" }),
              placeholder: (base) => ({ ...base, color: "var(--text-dim)" }),
              indicatorSeparator: () => ({ display: "none" }),
              dropdownIndicator: (base) => ({ ...base, color: "var(--text-dim)", padding: "0 8px" }),
            }}
          />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>{t("btnAddEntry")}</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddBringBeer;
