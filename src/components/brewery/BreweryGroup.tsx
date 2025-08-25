import { useEffect, useState } from "react";
import { Beer } from "../../classes/BeerClass";
import "../../App.css";
import { Brewery } from "../../classes/BreweryClasses";

const BACKENDURL = import.meta.env.VITE_API_URL;

function BreweryGroup() {
  const [data, setData] = useState<Brewery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrewery, setSelectedBrewery] = useState<Brewery | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/brewery/all`)
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
      <h2>All Brewerys</h2>
      <ul className="list-group">
        {data.map((brewery: Brewery) => (
          <li
            className="list-group-item"
            key={brewery.id}
            onClick={() => setSelectedBrewery(brewery)}
          >
            {brewery.name}
          </li>
        ))}
      </ul>

      {selectedBrewery && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedBrewery.name}</h3>
            <div className="list-div">
              <p>City: {selectedBrewery.city}</p>
              <p>Country: {selectedBrewery.country}</p>
              <br />
            </div>
            <div className="list-div">
              {selectedBrewery.beers.map((beer: Beer) => (
                <div key={beer.id}>
                  <h5>{beer.name}</h5>
                  <p>Code: {beer.beer_code}</p>
                  <p>Vol: {beer.volume}</p>
                  <p>Alc: {beer.alcohol}</p>
                  <br />
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedBrewery(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BreweryGroup;
