import React, { useEffect, useState } from "react";
import "../../App.css";
import { InputSeason } from "../../classes/SeasonClass";
import { Team } from "../../classes/TeamClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddSeason = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const [inputName, setInputName] = useState("");
  const [inputTeamID, setInputTeamID] = useState(0);

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTeamIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputTeamID(Number(event.target.value));
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const handlePostRequest = async () => {
    try {
      const data: InputSeason = {
        name: inputName,
        team_id: inputTeamID,
      };

      const response = await fetch(`${BACKENDURL}/season/add`, {
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
    fetch(`${BACKENDURL}/team/all`)
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
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
  if (!teams) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>Add Season</h2>
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
        <label className="input-label" htmlFor="teamid">
          Team
        </label>
        <select
          className="add-input"
          id="teamSelect"
          value={inputTeamID}
          onChange={handleTeamIDChange}
        >
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddSeason;
