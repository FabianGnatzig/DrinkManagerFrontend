import React, { useEffect, useState } from "react";
import { InputUser } from "../../classes/UserClass";
import "../../App.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Team } from "../../classes/TeamClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddUser = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputUserName, setInputUserName] = useState("");
  const [inputFirstName, setInputFirstName] = useState("");
  const [inputLastName, setInputLastName] = useState("");
  const [inputTeamID, setInputTeamID] = useState(0);
  const [inputPassword, setInputPassword] = useState("");
  const [inputRole, setInputRole] = useState("");
  const [inputBirthday, setInputBirthday] = useState(new Date());

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputUserName(event.target.value);
  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputFirstName(event.target.value);
  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputLastName(event.target.value);
  const handleTeamIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputTeamID(Number(event.target.value));
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputPassword(event.target.value);
  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputRole(event.target.value);

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
      const response = await fetch(`${BACKENDURL}/user/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "User added!");
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

  if (loading) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Add User</span></div>
        <div className="loading-state"><div className="spinner" />Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">Add User</span></div>
        <div className="error-state">Failed to load teams</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Add User</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="username">Username</label>
          <input className="form-input" id="username" type="text" value={inputUserName} onChange={handleUserNameChange} placeholder="username" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="firstname">First name</label>
          <input className="form-input" id="firstname" type="text" value={inputFirstName} onChange={handleFirstNameChange} placeholder="First name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="lastname">Last name</label>
          <input className="form-input" id="lastname" type="text" value={inputLastName} onChange={handleLastNameChange} placeholder="Last name" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="teamSelect">Team</label>
          <select className="form-select" id="teamSelect" value={inputTeamID} onChange={handleTeamIDChange}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input className="form-input" id="password" type="password" value={inputPassword} onChange={handlePasswordChange} placeholder="Password" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="role">Role</label>
          <input className="form-input" id="role" type="text" value={inputRole} onChange={handleRoleChange} placeholder="Role" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="birthday">Birthday</label>
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
        <button className="btn btn-primary" onClick={handlePostRequest}>Add User</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddUser;
