import { useEffect, useState } from "react";
import "../../App.css";
import { Season } from "../../classes/SeasonClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

function SeasonGroup() {
  const [data, setData] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/season/all`)
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
      <h2>All Seasons</h2>
      <ul className="list-group">
        {data.map((season: Season) => (
          <li
            className="list-group-item"
            key={season.id}
            onClick={() => setSelectedSeason(season)}
          >
            {season.name}
          </li>
        ))}
      </ul>

      {selectedSeason && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedSeason.name}</h3>
            <div className="list-div">
              <p>Season ID: {selectedSeason.id}</p>
              <h5>Team Name: {selectedSeason.team?.name ?? "None"} </h5>
              <p>Team ID: {selectedSeason.team?.id ?? "None"} </p>
              <br />
            </div>
            <button onClick={() => setSelectedSeason(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeasonGroup;
