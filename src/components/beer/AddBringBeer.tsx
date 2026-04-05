import React, { useEffect, useState } from "react";
import { Beer, InputBringBeer, OpenUserBeer } from "../../classes/BeerClass";
import "../../App.css";
import { User } from "../../classes/UserClass";
import { SeasonEvent } from "../../classes/EventClass";

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

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputUser(Number(event.target.value));
  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputEvent(Number(event.target.value));
  const handleBeerChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputBeer(Number(event.target.value));
  const handleUserBeer = (event: React.ChangeEvent<HTMLSelectElement>) => setInputUserBeer(Number(event.target.value));

  const filteredUserBeer = userBeers.filter((ub) => ub.user_id === inputUser);

  const handlePostRequest = async () => {
    try {
      const data: InputBringBeer = {
        event_id: inputEvent,
        user_id: inputUser,
        user_beer_id: inputUserBeer,
        beer_id: inputBeer,
      };
      const response = await fetch(`${BACKENDURL}/bringbeer/add`, {
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
          fetch(`${BACKENDURL}/user/all`),
          fetch(`${BACKENDURL}/event/all`),
          fetch(`${BACKENDURL}/service/all_open_beer`),
          fetch(`${BACKENDURL}/beer/all`),
        ]);
        const usersData = await userRes.json();
        const eventData = await eventRes.json();
        const userBeerData = await userbeerRes.json();
        const beerData = await beerRes.json();
        setUsers(usersData);
        setEvents(eventData);
        setUserBeer(userBeerData);
        setBeer(beerData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetch(`${BACKENDURL}/user/all`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
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
        <div className="card-header"><span className="card-title">Add Bring Beer</span></div>
        <div className="loading-state"><div className="spinner" />Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Add Bring Beer</span></div>
        <div className="error-state">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Add Bring Beer</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="bbEvent">Event</label>
          <select className="form-select" id="bbEvent" value={inputEvent} onChange={handleEventChange}>
            {events.map((event) => (
              <option key={event.id} value={event.id}>#{event.id} — {event.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bbUser">User</label>
          <select className="form-select" id="bbUser" value={inputUser} onChange={handleUserChange}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="bbFine">Fine</label>
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
          <label className="form-label" htmlFor="bbBeer">Beer</label>
          <select className="form-select" id="bbBeer" value={inputBeer} onChange={handleBeerChange}>
            {beers.map((beer) => (
              <option key={beer.id} value={beer.id}>{beer.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>Add Entry</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddBringBeer;
