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

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">All Breweries</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />Loading...</div>}
        {error && <div className="error-state">Failed to load breweries</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">No breweries yet</div>}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((brewery: Brewery) => (
              <li className="data-item" key={brewery.id} onClick={() => setSelectedBrewery(brewery)}>
                <div className="data-item-main">
                  <div className="data-item-primary">{brewery.name}</div>
                  <div className="data-item-secondary">{brewery.city}, {brewery.country}</div>
                </div>
                <div className="data-item-right">
                  <span className="badge badge-neutral">{brewery.beers?.length ?? 0} beers</span>
                  <span className="chevron">›</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedBrewery && (
        <div className="modal-overlay" onClick={() => setSelectedBrewery(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-head-title">{selectedBrewery.name}</span>
              <button className="modal-close" onClick={() => setSelectedBrewery(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-section-title">Location</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">City</div>
                    <div className="detail-value">{selectedBrewery.city}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">Country</div>
                    <div className="detail-value">{selectedBrewery.country}</div>
                  </div>
                </div>
              </div>
              {selectedBrewery.beers?.length > 0 && (
                <div className="detail-section">
                  <div className="detail-section-title">Beers ({selectedBrewery.beers.length})</div>
                  {selectedBrewery.beers.map((beer: Beer) => (
                    <div key={beer.id} style={{ marginBottom: 8 }}>
                      <div className="detail-grid">
                        <div className="detail-item full">
                          <div className="detail-label">Name</div>
                          <div className="detail-value">{beer.name}</div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-label">Volume</div>
                          <div className="detail-value">{beer.volume} L</div>
                        </div>
                        <div className="detail-item">
                          <div className="detail-label">Alcohol</div>
                          <div className="detail-value">{beer.alcohol}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedBrewery(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BreweryGroup;
