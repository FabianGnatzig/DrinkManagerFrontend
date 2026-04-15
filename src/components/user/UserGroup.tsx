import { useEffect, useState } from "react";
import { User } from "../../classes/UserClass";
import "../../App.css";
import { authFetch, isAdmin } from "../../lib/api";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function UserGroup() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const admin = isAdmin();
  const t = useT();

  const handleDelete = async (id: string) => {
    try {
      const response = await authFetch(`${BACKENDURL}/user/${id}`, { method: "DELETE" });
      if (response.ok) {
        setSelectedUser(null);
        window.location.reload();
      } else {
        const err = await response.json().catch(() => null);
        alert(`Delete failed: ${err?.detail ?? response.status}`);
      }
    } catch {
      alert("Delete failed: network error");
    }
  };

  useEffect(() => {
    authFetch(`${BACKENDURL}/user/all`)
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
          <span className="card-title">{t("cardAllUsers")}</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />{t("loading")}</div>}
        {error && <div className="error-state">{t("errUsers")}</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">{t("emptyUsers")}</div>}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((user: User) => (
              <li className="data-item" key={user.id} onClick={() => setSelectedUser(user)}>
                <div className="data-item-main">
                  <div className="data-item-primary">{user.first_name} {user.last_name}</div>
                  <div className="data-item-secondary">@{user.username}</div>
                </div>
                <div className="data-item-right">
                  <span className="badge badge-neutral">{user.role}</span>
                  <span className="chevron">›</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-head-title">{selectedUser.first_name} {selectedUser.last_name}</span>
              <button className="modal-close" onClick={() => setSelectedUser(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-section-title">{t("detailProfile")}</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-label">{t("detailId")}</div>
                    <div className="detail-value">{selectedUser.id}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailRole")}</div>
                    <div className="detail-value">{selectedUser.role}</div>
                  </div>
                  <div className="detail-item full">
                    <div className="detail-label">{t("detailUsername")}</div>
                    <div className="detail-value">@{selectedUser.username}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailTeamId")}</div>
                    <div className="detail-value">{selectedUser.team_id}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">{t("detailBirthday")}</div>
                    <div className="detail-value">{selectedUser.birthday?.toString()}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {admin && (
                <button
                  className="btn"
                  style={{ background: "var(--red-bg)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.25)", flex: 1 }}
                  onClick={() => handleDelete(selectedUser.id)}
                >
                  {t("btnDeleteUser")}
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => setSelectedUser(null)}>{t("close")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserGroup;
