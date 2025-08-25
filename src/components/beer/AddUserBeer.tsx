import React, { useEffect, useState } from "react";
import { InputUserBeer } from "../../classes/BeerClass";
import "../../App.css";
import { User } from "../../classes/UserClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddUserBeer = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const [inputId, setInputID] = useState(1);
  const [inputKind, setInputKind] = useState("newspaper / fine");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputID(Number(event.target.value));
  };

  const handleKindChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputKind(event.target.value);
  };

  const handlePostRequest = async () => {
    try {
      const data: InputUserBeer = {
        user_id: inputId,
        kind: inputKind,
      };

      const response = await fetch(`${BACKENDURL}/userbeer/add`, {
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
      <h2>Add fine Beer</h2>
      <div className="nowrap-div">
        <label className="input-label" htmlFor="UserID">
          User
        </label>
        <select
          className="add-input"
          id="userSelect"
          value={inputId}
          onChange={handleIDChange}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.first_name} {user.last_name}
            </option>
          ))}
        </select>
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="Kind">
          Type
        </label>
        <input
          className="add-input"
          id="Kind"
          type="text"
          value={inputKind}
          onChange={handleKindChange}
        />
      </div>

      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddUserBeer;
