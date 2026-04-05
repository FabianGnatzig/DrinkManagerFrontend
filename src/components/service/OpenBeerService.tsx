import { useEffect, useState } from "react";
import "../../App.css";
import { OpenBeerClass } from "../../classes/ServiceClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

function OpenBeerService() {
  const [data, setData] = useState<OpenBeerClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/service/all_open_beer`)
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

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Open Fine Beers</span>
        {!loading && !error && (
          <span className="card-count">{data.length}</span>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          Loading...
        </div>
      )}

      {error && (
        <div className="error-state">
          Failed to load open beers
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="empty-state">No open fines</div>
      )}

      {!loading && !error && data.length > 0 && (
        <ul className="data-list">
          {data.map((item: OpenBeerClass) => (
            <li className="data-item" key={`${item.user_id}-${item.user_beer_id}`} style={{ cursor: "default" }}>
              <div className="data-item-main">
                <div className="data-item-primary">{item.user}</div>
                <div className="data-item-secondary">{item.kind}</div>
              </div>
              <div className="data-item-right">
                <span className="badge badge-open">Open</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OpenBeerService;
