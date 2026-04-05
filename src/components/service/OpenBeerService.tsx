import { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { OpenBeerClass } from "../../classes/ServiceClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function OpenBeerService() {
  const [data, setData] = useState<OpenBeerClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useT();

  useEffect(() => {
    authFetch(`${BACKENDURL}/service/all_open_beer`)
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
    <div className="card">
      <div className="card-header">
        <span className="card-title">{t("cardOpenFines")}</span>
        {!loading && !error && (
          <span className="card-count">{data.length}</span>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          {t("loading")}
        </div>
      )}

      {error && (
        <div className="error-state">
          {t("errOpenFines")}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="empty-state">{t("emptyOpenFines")}</div>
      )}

      {!loading && !error && data.length > 0 && (
        <ul className="data-list">
          {data.map((item: OpenBeerClass) => (
            <li className="data-item" key={`${item.user_id}-${item.user_beer_id}`} style={{ cursor: "default" }}>
              <div className="data-item-main">
                <div className="data-item-primary">{item.user}</div>
                <div className="data-item-secondary">{item.kind}</div>
              </div>
              <div className="data-item-right">
                <span className="badge badge-open">{t("open")}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OpenBeerService;
