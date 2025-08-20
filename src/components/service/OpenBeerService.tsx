import { useEffect, useState } from "react";
import "../../App.css";
import { OpenBeerClass } from "../../classes/ServiceClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

function OpenBeerService() {
  const [data, setData] = useState<OpenBeerClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/service/all_open_beer`)
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

  if (loading) return <p>Loading...</p>;

  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }

  if (!data) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>Open fine Beer</h2>
      <ul className="list-group">
        {data.map((user_bear: OpenBeerClass) => (
          <li className="list-group-item" key={user_bear.user}>
            User: {user_bear.user} UserID:{user_bear.user_id} / UserBeer:{" "}
            {user_bear.user_beer_id} / {user_bear.kind}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OpenBeerService;
