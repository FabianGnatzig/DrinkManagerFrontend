import { useEffect, useState } from "react";
import { Beer } from "../../classes/BeerClass";
import "../../App.css";

const BACKENDURL = import.meta.env.VITE_API_URL;

function BeerGroup() {
  const [data, setData] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/beer/all`)
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
      <h2>All Beers</h2>
      <ul className="list-group">
        {data.map((beer: Beer) => (
          <li
            className="list-group-item"
            key={beer.id}
            onClick={() => setSelectedBeer(beer)}
          >
            {beer.name} / {beer.brewery.name}
          </li>
        ))}
      </ul>

      {selectedBeer && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedBeer.name}</h3>
            <div className="list-div">
              <p>ID: {selectedBeer.id}</p>
              <p>Code: {selectedBeer.beer_code}</p>
              <p>Vol: {selectedBeer.volume}</p>
              <p>Alc: {selectedBeer.alcohol}</p>
              <p>Count: {selectedBeer.bring_beer?.length ?? "0"}</p>
              <br />
            </div>
            <h5>{selectedBeer.brewery?.name ?? "None"}</h5>
            <div className="list-div">
              <p>City: {selectedBeer.brewery?.city ?? "None"}</p>
              <p>Country: {selectedBeer.brewery?.country ?? "None"}</p>
              <br />
            </div>
            <button onClick={() => setSelectedBeer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BeerGroup;
