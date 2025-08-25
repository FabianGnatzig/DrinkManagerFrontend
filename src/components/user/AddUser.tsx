import React, { useEffect, useState } from "react";
import { InputUser } from "../../classes/UserClass";
import "../../App.css";
import moment from "moment";
import DatePicker from "react-datepicker";
import { Team } from "../../classes/TeamClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddUser = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputUserName, setInputUserName] = useState("username");
  const [inputFirstName, setInputFirstName] = useState("first name");
  const [inputLastName, setInputLastName] = useState("last name");
  const [inputTeamID, setInputTeamID] = useState(0);
  const [inputPassword, setInputPassword] = useState("password");
  const [inputRole, setInputRole] = useState("role");
  const [inputBirthday, setInputBirthday] = useState(new Date());

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUserName(event.target.value);
  };

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLastName(event.target.value);
  };

  const handleTeamIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputTeamID(Number(event.target.value));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputRole(event.target.value);
  };

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

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }
  if (!teams) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>Add User</h2>
      <div className="nowrap-div">
        <label className="input-label" htmlFor="UserName">
          Username
        </label>
        <input
          className="add-input"
          id="Username"
          type="text"
          value={inputUserName}
          onChange={handleUserNameChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="Firstname">
          First name
        </label>
        <input
          className="add-input"
          id="Firstname"
          type="text"
          value={inputFirstName}
          onChange={handleFirstNameChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="lastname">
          Last name
        </label>
        <input
          className="add-input"
          id="lastname"
          type="text"
          value={inputLastName}
          onChange={handleLastNameChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="team_id">
          TeamID
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

      <div className="nowrap-div">
        <label className="input-label" htmlFor="psswrd">
          Password
        </label>
        <input
          className="add-input"
          id="psswrd"
          type="text"
          value={inputPassword}
          onChange={handlePasswordChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="role">
          Role
        </label>
        <input
          className="add-input"
          id="role"
          type="text"
          value={inputRole}
          onChange={handleRoleChange}
        />
      </div>

      <div className="nowrap-div">
        <label className="input-label" htmlFor="birthday">
          Birthday
        </label>
        <DatePicker
          className="add-input"
          dateFormat="yyyy-MM-dd"
          id="date"
          selected={inputBirthday}
          onChange={(date) => setInputBirthday(date ?? new Date())}
        />
      </div>

      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddUser;
