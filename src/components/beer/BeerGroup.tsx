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

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Beers</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            Loading...
          </div>
        )}
        {error && <div className="error-state">Failed to load beers</div>}
        {!loading && !error && data.length === 0 && (
          <div className="empty-state">No beers yet</div>
        )}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((beer: Beer) => (
              <li
                className="data-item"
                key={beer.id}
                onClick={() => setSelectedBeer(beer)}
              >
                <div className="data-item-main">
                  <div className="data-item-primary">{beer.name}</div>
                  <div className="data-item-secondary">{beer.brewery.name}</div>
                </div>
                <div className="data-item-right">
                  <span className="badge badge-neutral">{beer.alcohol}%</span>
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
              <span className="modal-head-title">{selectedBeer.name}</span>
              <button className="modal-close" onClick={() => setSelectedBeer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-section-title">Beer details</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">ID</div>
                    <div className="detail-value">{selectedBeer.id}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Code</div>
                    <div className="detail-value">{selectedBeer.beer_code}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Volume</div>
                    <div className="detail-value">{selectedBeer.volume} L</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Alcohol</div>
                    <div className="detail-value">{selectedBeer.alcohol}%</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Times brought</div>
                    <div className="detail-value">{selectedBeer.bring_beer?.length ?? 0}</div>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-section-title">Brewery</div>
                <div className="detail-grid">
                  <div className="detail-item full">
                    <div className="detail-label">Name</div>
                    <div className="detail-value">{selectedBeer.brewery?.name ?? "—"}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">City</div>
                    <div className="detail-value">{selectedBeer.brewery?.city ?? "—"}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Country</div>
                    <div className="detail-value">{selectedBeer.brewery?.country ?? "—"}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedBeer(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BeerGroup;
