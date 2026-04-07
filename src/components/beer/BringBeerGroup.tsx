import { useEffect, useState } from "react";
import { Beer, BringBeer } from "../../classes/BeerClass";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function BringBeerGroup() {
  const [data, setData] = useState<BringBeer[]>([]);
  const [beerMap, setBeerMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBeer, setSelectedBeer] = useState<BringBeer | null>(null);
  const [search, setSearch] = useState("");
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
    Promise.all([
      authFetch(`${BACKENDURL}/bringbeer/all`).then((r) => r.json()),
      authFetch(`${BACKENDURL}/beer/all`).then((r) => r.json()),
    ])
      .then(([bringBeers, beers]) => {
        setData(bringBeers);
        const map: Record<number, string> = {};
        (beers as Beer[]).forEach((b) => { map[b.id] = b.name; });
        setBeerMap(map);
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
          <>
            <div className="card-search">
              <input
                className="card-search-input"
                type="text"
                placeholder={t("phSearchBeers")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {(() => {
              const filtered = data.filter((b) =>
                (beerMap[b.beer_id] ?? "").toLowerCase().includes(search.toLowerCase())
              );
              return filtered.length === 0 ? (
                <div className="empty-state">{t("searchNoResults")}</div>
              ) : (
                <ul className="data-list">
                  {filtered.map((beer: BringBeer) => (
                    <li className="data-item" key={beer.id} onClick={() => setSelectedBeer(beer)}>
                      <div className="data-item-main">
                        <div className="data-item-primary">{beerMap[beer.beer_id] ?? `Beer #${beer.beer_id}`}</div>
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
              );
            })()}
          </>
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
