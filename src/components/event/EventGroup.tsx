import { useEffect, useState } from "react";
import "../../App.css";
import { SeasonEvent } from "../../classes/EventClass";
import moment from "moment";

const BACKENDURL = import.meta.env.VITE_API_URL;

function EventGroup() {
  const [data, setData] = useState<SeasonEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState<SeasonEvent | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/event/all`)
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }

  if (!data) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>All Events</h2>
      <ul className="list-group">
        {data.map((event: SeasonEvent) => (
          <li
            className="list-group-item"
            key={event.id}
            onClick={() => setSelectedEvent(event)}
          >
            {event.name}
          </li>
        ))}
      </ul>

      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedEvent.name}</h3>
            <div className="list-div">
              <p>Event ID: {selectedEvent.id}</p>
              <p>
                Date: {moment(selectedEvent.event_date).format("Do MMMM YYYY")}
              </p>
              <br />
            </div>
            <button onClick={() => setSelectedEvent(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventGroup;
