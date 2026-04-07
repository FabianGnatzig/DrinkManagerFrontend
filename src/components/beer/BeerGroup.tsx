import { useEffect, useState } from "react";
import { Beer } from "../../classes/BeerClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function BeerGroup() {
  const [data, setData] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<Beer | null>(null);
  const [search, setSearch] = useState("");
  const t = useT();

  useEffect(() => {
    authFetch(`${BACKENDURL}/beer/all`)
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
          <span className="card-title">{t("cardAllBeers")}</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner" />
            {t("loading")}
          </div>
        )}
        {error && <div className="error-state">{t("errBeers")}</div>}
        {!loading && !error && data.length > 0 && (
          <div className="card-search">
            <input
              className="card-search-input"
              type="text"
              placeholder={t("phSearchBeers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
        {!loading && !error && data.length === 0 && (
          <div className="empty-state">{t("emptyBeers")}</div>
        )}
        {!loading && !error && data.length > 0 && (() => {
          const filtered = data.filter((b) =>
            b.name.toLowerCase().includes(search.toLowerCase())
          );
          return filtered.length === 0 ? (
            <div className="empty-state">{t("searchNoResults")}</div>
          ) : (
          <ul className="data-list">
            {filtered.map((beer: Beer) => (
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
          );
        })()}
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
                <div className="detail-section-title">{t("detailBeerDetails")}</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">{t("detailId")}</div>
                    <div className="detail-value">{selectedBeer.id}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailCode")}</div>
                    <div className="detail-value">{selectedBeer.beer_code}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailVolume")}</div>
                    <div className="detail-value">{selectedBeer.volume} L</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailAlcohol")}</div>
                    <div className="detail-value">{selectedBeer.alcohol}%</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailTimesBrought")}</div>
                    <div className="detail-value">{selectedBeer.bring_beer?.length ?? 0}</div>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-section-title">{t("detailBrewery")}</div>
                <div className="detail-grid">
                  <div className="detail-item full">
                    <div className="detail-label">{t("detailName")}</div>
                    <div className="detail-value">{selectedBeer.brewery?.name ?? "—"}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailCity")}</div>
                    <div className="detail-value">{selectedBeer.brewery?.city ?? "—"}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailCountry")}</div>
                    <div className="detail-value">{selectedBeer.brewery?.country ?? "—"}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedBeer(null)}>{t("close")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BeerGroup;
