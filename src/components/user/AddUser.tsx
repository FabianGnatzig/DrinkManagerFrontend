import React, { useEffect, useState } from "react";
import { InputUser } from "../../classes/UserClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Team } from "../../classes/TeamClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddUser = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputUserName, setInputUserName] = useState("");
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputTeamID, setInputTeamID] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputRole, setInputRole] = useState("user");
  const [inputBirthday, setInputBirthday] = useState(new Date());

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useT();

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputUserName(event.target.value);
  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputFirstName(event.target.value);
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputLastName(event.target.value);
  const handleTeamIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputTeamID(event.target.value);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputPassword(event.target.value);
  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputRole(event.target.value);

  const handlePostRequest = async () => {
    try {
      const data: InputUser = {
        username: inputUserName,
        first_name: inputFirstName,
        last_name: inputLastName,
        password: inputPassword,
        role: inputRole,
        team_id: inputTeamID,
        birthday: moment(inputBirthday).format("YYYY-MM-DD"),
      };
      const response = await authFetch(`${BACKENDURL}/user/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setResponseMessage("User added!");
        window.location.reload();
      } else {
        const err = await response.json().catch(() => null);
        setResponseMessage(`Error ${response.status}: ${err?.detail ?? "Unknown error"}`);
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
        <div className="card-header"><span className="card-title">{t("cardAddUser")}</span></div>
        <div className="loading-state"><div className="spinner" />{t("loading")}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">{t("cardAddUser")}</span></div>
        <div className="error-state">{t("errTeamsLoad")}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t("cardAddUser")}</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="username">{t("labelUsername")}</label>
          <input className="form-input" id="username" type="text" value={inputUserName} onChange={handleUserNameChange} placeholder={t("phUsername")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="firstname">{t("labelFirstName")}</label>
          <input className="form-input" id="firstname" type="text" value={inputFirstName} onChange={handleFirstNameChange} placeholder={t("phFirstName")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="lastname">{t("labelLastName")}</label>
          <input className="form-input" id="lastname" type="text" value={inputLastName} onChange={handleLastNameChange} placeholder={t("phLastName")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="teamSelect">{t("labelTeam")}</label>
          <select className="form-select" id="teamSelect" value={inputTeamID} onChange={handleTeamIDChange}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">{t("labelPassword")}</label>
          <input className="form-input" id="password" type="password" value={inputPassword} onChange={handlePasswordChange} placeholder={t("phPassword")} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="role">{t("labelRole")}</label>
          <select className="form-select" id="role" value={inputRole} onChange={handleRoleChange}>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="birthday">{t("labelBirthday")}</label>
          <DatePicker
            className="form-input"
            dateFormat="yyyy-MM-dd"
            id="birthday"
            selected={inputBirthday}
            onChange={(date) => setInputBirthday(date ?? new Date())}
          />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>{t("btnAddUser")}</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddUser;
