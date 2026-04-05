import { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { Season } from "../../classes/SeasonClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function SeasonGroup() {
  const [data, setData] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const t = useT();

  useEffect(() => {
    authFetch(`${BACKENDURL}/season/all`)
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
          <span className="card-title">{t("cardAllSeasons")}</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />{t("loading")}</div>}
        {error && <div className="error-state">{t("errSeasons")}</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">{t("emptySeasons")}</div>}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((season: Season) => (
              <li className="data-item" key={season.id} onClick={() => setSelectedSeason(season)}>
                <div className="data-item-main">
                  <div className="data-item-primary">{season.name}</div>
                  <div className="data-item-secondary">{season.team?.name ?? "No team"}</div>
                </div>
                <div className="data-item-right">
                  <span className="chevron">›</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedSeason && (
        <div className="modal-overlay" onClick={() => setSelectedSeason(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-head-title">{selectedSeason.name}</span>
              <button className="modal-close" onClick={() => setSelectedSeason(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">{t("detailSeasonId")}</div>
                  <div className="detail-value">{selectedSeason.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailTeam")}</div>
                  <div className="detail-value">{selectedSeason.team?.name ?? "—"}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailTeamId")}</div>
                  <div className="detail-value">{selectedSeason.team?.id ?? "—"}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedSeason(null)}>{t("close")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SeasonGroup;
