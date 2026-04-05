import { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { Team } from "../../classes/TeamClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function TeamGroup() {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const t = useT();

  useEffect(() => {
    authFetch(`${BACKENDURL}/team/all`)
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
          <span className="card-title">{t("cardAllTeams")}</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />{t("loading")}</div>}
        {error && <div className="error-state">{t("errTeams")}</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">{t("emptyTeams")}</div>}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((team: Team) => (
              <li className="data-item" key={team.id} onClick={() => setSelectedTeam(team)}>
                <div className="data-item-main">
                  <div className="data-item-primary">{team.name}</div>
                </div>
                <div className="data-item-right">
                  <span className="badge badge-neutral">#{team.id}</span>
                  <span className="chevron">›</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedTeam && (
        <div className="modal-overlay" onClick={() => setSelectedTeam(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-head-title">{selectedTeam.name}</span>
              <button className="modal-close" onClick={() => setSelectedTeam(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">{t("detailId")}</div>
                  <div className="detail-value">{selectedTeam.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailName")}</div>
                  <div className="detail-value">{selectedTeam.name}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedTeam(null)}>{t("close")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeamGroup;
