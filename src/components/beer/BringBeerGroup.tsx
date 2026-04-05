import { useEffect, useState } from "react";
import { BringBeer } from "../../classes/BeerClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function BringBeerGroup() {
  const [data, setData] = useState<BringBeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<BringBeer | null>(null);
  const t = useT();

  const handleDone = async (id: number) => {
    try {
      await authFetch(`${BACKENDURL}/bringbeer/done/${id}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    authFetch(`${BACKENDURL}/bringbeer/all`)
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
          <span className="card-title">{t("cardAllBringBeers")}</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />{t("loading")}</div>}
        {error && <div className="error-state">{t("errBringBeers")}</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">{t("emptyBringBeers")}</div>}
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
                    {beer.done ? t("done") : t("open")}
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
                  <div className="detail-label">{t("detailUserId")}</div>
                  <div className="detail-value">{selectedBeer.user_id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailEventId")}</div>
                  <div className="detail-value">{selectedBeer.event_id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailFineId")}</div>
                  <div className="detail-value">{selectedBeer.user_beer_id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailStatus")}</div>
                  <div className="detail-value">
                    <span className={`badge ${selectedBeer.done ? "badge-done" : "badge-open"}`}>
                      {selectedBeer.done ? t("done") : t("open")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {!selectedBeer.done && (
                <button className="btn btn-success" onClick={() => handleDone(selectedBeer.id)}>
                  {t("btnMarkDone")}
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setSelectedBeer(null)}>{t("close")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BringBeerGroup;
