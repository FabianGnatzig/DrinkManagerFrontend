import { useEffect, useState } from "react";
import { BringBeer } from "../../classes/BeerClass";
import "../../App.css";

type DoneProp = {
  value: boolean;
};

function Done({ value }: DoneProp) {
  return value ? "Done" : "Open";
}

function BringBeerGroup() {
  const BACKENDURL = import.meta.env.VITE_API_URL;
  
  const [data, setData] = useState<BringBeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<BringBeer | null>(null);

  const handleDone = async (id: number) => {
    try {
      await fetch(`${BACKENDURL}/bringbeer/done/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch(`${BACKENDURL}/bringbeer/all`)
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

  // Handle loading state
  if (loading) return <p>Loading...</p>;

  // Handle error state
  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }

  if (!data) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>All Bring Beers</h2>
      <ul className="list-group">
        {data.map((beer: BringBeer) => (
          <li
            className="list-group-item"
            key={beer.id}
            onClick={() => setSelectedBeer(beer)}
          >
            {beer.id} / {beer.event_id} / <Done value={beer.done} />
          </li>
        ))}
      </ul>

      {selectedBeer && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedBeer.id}</h3>
            <div className="list-div">
              <p>UserID: {selectedBeer.user_id}</p>
              <p>FineID: {selectedBeer.user_beer_id}</p>
              <p>EventID: {selectedBeer.event_id}</p>
              <p>
                <Done value={selectedBeer.done} />
              </p>
              <br />
            </div>
            <button onClick={() => handleDone(selectedBeer.id)}>Done</button>
            <button onClick={() => setSelectedBeer(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BringBeerGroup;
