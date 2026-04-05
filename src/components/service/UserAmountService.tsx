import { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { UserBeerAmount } from "../../classes/ServiceClass";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function UserBeerAmountService() {
  const [data, setData] = useState<UserBeerAmount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = useT();

  useEffect(() => {
    authFetch(`${BACKENDURL}/service/beer_amount`)
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
        <span className="card-title">{t("cardScoreboard")}</span>
        {!loading && !error && (
          <span className="card-count">{data.length} {t("users")}</span>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          {t("loading")}
        </div>
      )}

      {error && (
        <div className="error-state">{t("errAmounts")}</div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="empty-state">{t("emptyScoreboard")}</div>
      )}

      {!loading && !error && data.length > 0 && (
        <ul className="data-list">
          {data.map((item: UserBeerAmount) => (
            <li className="stat-item" key={item.user} style={{ listStyle: "none" }}>
              <div>
                <div className="stat-user">{item.user}</div>
              </div>
              <div className="stat-chips">
                <div className="stat-chip">
                  <div className="stat-chip-value">{item.amount}</div>
                  <div className="stat-chip-label">{t("statBrought")}</div>
                </div>
                <div className="stat-chip">
                  <div className="stat-chip-value">{item.included_fine}</div>
                  <div className="stat-chip-label">{t("statFines")}</div>
                </div>
                <div className={`stat-chip ${item.amount - item.included_fine >= 0 ? "positive" : "negative"}`}>
                  <div className="stat-chip-value">
                    {item.amount - item.included_fine}
                  </div>
                  <div className="stat-chip-label">{t("statBalance")}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserBeerAmountService;
