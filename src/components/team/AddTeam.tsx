import React, { useState } from "react";
import "../../App.css";
import { InputTeam } from "../../classes/TeamClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddTeam = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputName, setInputName] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputName(event.target.value);

  const handlePostRequest = async () => {
    try {
      const data: InputTeam = { name: inputName };
      const response = await fetch(`${BACKENDURL}/team/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Team added!");
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

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Add Team</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="teamName">Name</label>
          <input className="form-input" id="teamName" type="text" value={inputName} onChange={handleNameChange} placeholder="Team name" />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>Add Team</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddTeam;
