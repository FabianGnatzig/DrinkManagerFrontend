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

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputUser(Number(event.target.value));
  };

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputEvent(Number(event.target.value));
  };

  const handleBeerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputBeer(Number(event.target.value));
  };

  const handleUserBeer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputUserBeer(Number(event.target.value));
  };

  const filteredUserBeer = userBeers.filter(
    (userBeers) => userBeers.user_id === inputUser,
  );

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
    return <p>Loading...</p>;
  }
  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }
  if (!users) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>Add Bring Beer</h2>
      <div className="nowrap-div">
        <label className="input-label" htmlFor="EventID">
          Event
        </label>
        <select
          className="add-input"
          id="event"
          value={inputEvent}
          onChange={handleEventChange}
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.id} / {event.name}
            </option>
          ))}
        </select>
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="User">
          User
        </label>
        <select
          className="add-input"
          id="userSelect"
          value={inputUser}
          onChange={handleUserChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="UserBeer">
          Fine
        </label>
        {inputUser && (
          <select
            className="add-input"
            id="userBeer"
            value={inputUserBeer}
            onChange={handleUserBeer}
          >
            <option value={0}>-- None --</option>
            {filteredUserBeer.map((userBeer) => (
              <option key={userBeer.user_beer_id} value={userBeer.user_beer_id}>
                {userBeer.user} - {userBeer.kind}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="Beer">
          Beer
        </label>
        <select
          className="add-input"
          id="beer"
          value={inputBeer}
          onChange={handleBeerChange}
        >
          {beers.map((beer) => (
            <option key={beer.id} value={beer.id}>
              {beer.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddBringBeer;
