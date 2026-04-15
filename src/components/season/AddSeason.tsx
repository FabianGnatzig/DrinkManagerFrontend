import React, { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { InputSeason } from "../../classes/SeasonClass";
import { Team } from "../../classes/TeamClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddSeason = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputTeamID, setInputTeamID] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useT();

  const handleTeamIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputTeamID(event.target.value);
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
        if (data.length > 0) setInputTeamID(String(data[0].id));
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
        <div className="card-header"><span className="card-title">{t("cardAddSeason")}</span></div>
        <div className="loading-state"><div className="spinner" />{t("loading")}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">{t("cardAddSeason")}</span></div>
        <div className="error-state">{t("errTeamsLoad")}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t("cardAddSeason")}</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="seasonName">{t("labelName")}</label>
          <input className="form-input" id="seasonName" type="text" value={inputName} onChange={handleNameChange} placeholder={t("phSeasonName")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="seasonTeam">{t("labelTeam")}</label>
          <select className="form-select" id="seasonTeam" value={inputTeamID} onChange={handleTeamIDChange}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>{t("btnAddSeason")}</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddSeason;
