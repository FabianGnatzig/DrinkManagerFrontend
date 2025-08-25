import { useEffect, useState } from "react";
import { UserBeer } from "../../classes/BeerClass";
import "../../App.css";

const BACKENDURL = import.meta.env.VITE_API_URL;

function UserBeerGroup() {
  const [data, setData] = useState<UserBeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<UserBeer | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/userbeer/all`)
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

  if (loading) {return <p>Loading...</p>;}

  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }

  if (!data) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>All fine Beers</h2>
      <ul className="list-group">
        {data.map((beer: UserBeer) => (
          <li
            className="list-group-item"
            key={beer.id}
            onClick={() => setSelectedBeer(beer)}
          >
            User: {beer.user_id} / {beer.kind}
          </li>
        ))}
      </ul>

      {selectedBeer && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedBeer.kind}</h3>
            <div className="list-div">
              <p>UserID: {selectedBeer.user_id}</p>
              <p>ID: {selectedBeer.id}</p>
            </div>
            <button onClick={() => setSelectedBeer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserBeerGroup;
