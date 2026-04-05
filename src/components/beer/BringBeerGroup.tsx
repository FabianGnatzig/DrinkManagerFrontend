import { useEffect, useState } from "react";
import { BringBeer } from "../../classes/BeerClass";
import "../../App.css";

const BACKENDURL = import.meta.env.VITE_API_URL;

function BringBeerGroup() {
  const [data, setData] = useState<BringBeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<BringBeer | null>(null);

  const handleDone = async (id: number) => {
    try {
      await fetch(`${BACKENDURL}/bringbeer/done/${id}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
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

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Bring Beers</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />Loading...</div>}
        {error && <div className="error-state">Failed to load bring beers</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">No entries yet</div>}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((beer: BringBeer) => (
              <li className="data-item" key={beer.id} onClick={() => setSelectedBeer(beer)}>
                <div className="data-item-main">
                  <div className="data-item-primary">Entry #{beer.id}</div>
                  <div className="data-item-secondary">Event #{beer.event_id} · User #{beer.user_id}</div>
                </div>
                <div className="data-item-right">
                  <span className={`badge ${beer.done ? "badge-done" : "badge-open"}`}>
                    {beer.done ? "Done" : "Open"}
                  </span>
                  <span className="chevron">›</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedBeer && (
        <div className="modal-overlay" onClick={() => setSelectedBeer(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-head-title">Bring Beer #{selectedBeer.id}</span>
              <button className="modal-close" onClick={() => setSelectedBeer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">User ID</div>
                  <div className="detail-value">{selectedBeer.user_id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Event ID</div>
                  <div className="detail-value">{selectedBeer.event_id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Fine ID</div>
                  <div className="detail-value">{selectedBeer.user_beer_id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value">
                    <span className={`badge ${selectedBeer.done ? "badge-done" : "badge-open"}`}>
                      {selectedBeer.done ? "Done" : "Open"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {!selectedBeer.done && (
                <button className="btn btn-success" onClick={() => handleDone(selectedBeer.id)}>
                  Mark as Done
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setSelectedBeer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BringBeerGroup;
