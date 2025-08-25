import { useEffect, useState } from "react";
import "../../App.css";
import { Team } from "../../classes/TeamClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

function TeamGroup() {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/team/all`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
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

  if (!data) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>All Teams</h2>
      <ul className="list-group">
        {data.map((team: Team) => (
          <li
            className="list-group-item"
            key={team.id}
            onClick={() => setSelectedTeam(team)}
          >
            {team.name}
          </li>
        ))}
      </ul>

      {selectedTeam && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedTeam.name}</h3>
            <div className="list-div">
              <p>ID: {selectedTeam.id}</p>
              <br />
            </div>
            <button onClick={() => setSelectedTeam(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamGroup;
