import React, { useEffect, useState } from "react";
import { InputUserBeer } from "../../classes/BeerClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { User } from "../../classes/UserClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

const AddUserBeer = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [inputId, setInputID] = useState("");
  const [inputKind, setInputKind] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useT();

  const handleIDChange = (event: React.ChangeEvent<HTMLSelectElement>) => setInputID(event.target.value);
  const handleKindChange = (event: React.ChangeEvent<HTMLInputElement>) => setInputKind(event.target.value);

  const handlePostRequest = async () => {
    try {
      const data: InputUserBeer = { user_id: inputId, kind: inputKind };
      const response = await authFetch(`${BACKENDURL}/userbeer/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        setResponseMessage(responseData.message || "Fine beer added!");
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
    authFetch(`${BACKENDURL}/user/all`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        if (data.length > 0) setInputID(String(data[0].id));
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
        <div className="card-header"><span className="card-title">{t("cardAddFineBeer")}</span></div>
        <div className="loading-state"><div className="spinner" />{t("loading")}</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <div className="card-header"><span className="card-title">{t("cardAddFineBeer")}</span></div>
        <div className="error-state">{t("errUsersLoad")}</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t("cardAddFineBeer")}</span>
      </div>
      <div className="form-body">
        <div className="form-group">
          <label className="form-label" htmlFor="fineUser">{t("labelUser")}</label>
          <select className="form-select" id="fineUser" value={inputId} onChange={handleIDChange}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="fineKind">{t("labelType")}</label>
          <input className="form-input" id="fineKind" type="text" value={inputKind} onChange={handleKindChange} placeholder={t("phFineKind")} />
        </div>
      </div>
      <div className="form-footer">
        <button className="btn btn-primary" onClick={handlePostRequest}>{t("btnAddFineBeer")}</button>
        <p className="response-msg">{responseMessage}</p>
      </div>
    </div>
  );
};

export default AddUserBeer;
