import { useEffect, useState } from "react";
import { UserBeer } from "../../classes/BeerClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function UserBeerGroup() {
  const [data, setData] = useState<UserBeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<UserBeer | null>(null);
  const t = useT();

  useEffect(() => {
    authFetch(`${BACKENDURL}/userbeer/all`)
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
          <span className="card-title">{t("cardAllFineBeers")}</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />{t("loading")}</div>}
        {error && <div className="error-state">{t("errFineBeers")}</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">{t("emptyFineBeers")}</div>}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((beer: UserBeer) => (
              <li className="data-item" key={beer.id} onClick={() => setSelectedBeer(beer)}>
                <div className="data-item-main">
                  <div className="data-item-primary">{beer.kind}</div>
                  <div className="data-item-secondary">User #{beer.user_id}</div>
                </div>
                <div className="data-item-right">
                  <span className="badge badge-open">{t("fine")}</span>
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
              <span className="modal-head-title">{selectedBeer.kind}</span>
              <button className="modal-close" onClick={() => setSelectedBeer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">{t("detailId")}</div>
                  <div className="detail-value">{selectedBeer.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailUserId")}</div>
                  <div className="detail-value">{selectedBeer.user_id}</div>
                </div>
                <div className="detail-item full">
                  <div className="detail-label">{t("labelType")}</div>
                  <div className="detail-value">{selectedBeer.kind}</div>
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

export default UserBeerGroup;
