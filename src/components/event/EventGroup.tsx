import { useEffect, useState } from "react";
import "../../App.css";
import { authFetch } from "../../lib/api";
import { SeasonEvent } from "../../classes/EventClass";
import moment from "moment";
import { useT } from "../../lib/i18n";

const BACKENDURL = import.meta.env.VITE_API_URL;

function EventGroup() {
  const [data, setData] = useState<SeasonEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState<SeasonEvent | null>(null);
  const t = useT();

  useEffect(() => {
    authFetch(`${BACKENDURL}/event/all`)
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
          <span className="card-title">{t("cardAllEvents")}</span>
          {!loading && !error && <span className="card-count">{data.length}</span>}
        </div>

        {loading && <div className="loading-state"><div className="spinner" />{t("loading")}</div>}
        {error && <div className="error-state">{t("errEvents")}</div>}
        {!loading && !error && data.length === 0 && <div className="empty-state">{t("emptyEvents")}</div>}
        {!loading && !error && data.length > 0 && (
          <ul className="data-list">
            {data.map((event: SeasonEvent) => (
              <li className="data-item" key={event.id} onClick={() => setSelectedEvent(event)}>
                <div className="data-item-main">
                  <div className="data-item-primary">{event.name}</div>
                  <div className="data-item-secondary">{moment(event.event_date).format("D MMM YYYY")}</div>
                </div>
                <div className="data-item-right">
                  <span className="chevron">›</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-head-title">{selectedEvent.name}</span>
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">{t("detailEventId")}</div>
                  <div className="detail-value">{selectedEvent.id}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">{t("detailDate")}</div>
                  <div className="detail-value">{moment(selectedEvent.event_date).format("Do MMMM YYYY")}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedEvent(null)}>{t("close")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventGroup;
