import React, { useState } from "react";
import "../../App.css";
import { InputTeam } from "../../classes/TeamClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddTeam = () => {
  const [responseMessage, setResponseMessage] = useState("");

  const [inputName, setInputName] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const handlePostRequest = async () => {
    try {
      const data: InputTeam = {
        name: inputName,
      };

      const response = await fetch(`${BACKENDURL}/team/add`, {
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

  return (
    <div className="std-div">
      <h2>Add Team</h2>
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
      <button onClick={handlePostRequest}>Post Data</button>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddTeam;
