import { useEffect, useState } from "react";
import "../../App.css";
import { Team } from "../../classes/TeamClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

function TeamGroup() {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/team/all`)
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
          <span className="card-title">All Teams</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />Loading...</div>}
        {error && <div className="error-state">Failed to load teams</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">No teams yet</div>}
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
                  <div className="detail-label">ID</div>
                  <div className="detail-value">{selectedTeam.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Name</div>
                  <div className="detail-value">{selectedTeam.name}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedTeam(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeamGroup;
