import React, { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
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

  const handleTeamIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputTeamID(Number(event.target.value));
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputName(event.target.value);

  const handlePostRequest = async () => {
    try {
      const data: InputSeason = { name: inputName, team_id: inputTeamID };
      const response = await authFetch(`${BACKENDURL}/season/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Season added!");
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
    authFetch(`${BACKENDURL}/team/all`)
      .then((response) => response.json())
      .then((data) => {
        setTeams(data);
        if (data.length > 0) setInputTeamID(data[0].id);
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
        <div className="card-header"><span className="card-title">Add Season</span></div>
        <div className="loading-state"><div className="spinner" />Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Add Season</span></div>
        <div className="error-state">Failed to load teams</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Add Season</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="seasonName">Name</label>
          <input className="form-input" id="seasonName" type="text" value={inputName} onChange={handleNameChange} placeholder="Season name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="seasonTeam">Team</label>
          <select className="form-select" id="seasonTeam" value={inputTeamID} onChange={handleTeamIDChange}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>Add Season</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddSeason;
