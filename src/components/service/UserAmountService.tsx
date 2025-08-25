import { useEffect, useState } from "react";
import "../../App.css";
import { UserBeerAmount } from "../../classes/ServiceClass";

const BACKENDURL = import.meta.env.VITE_API_URL;

function UserBeerAmountService() {
  const [data, setData] = useState<UserBeerAmount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/service/beer_amount`)
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

  if (loading) {return <p>Loading...</p>;}

  if (error) {
    const e = error as Error;
    return <p>Error: {e.message}</p>;
  }

  if (!data) {
    return <p>not found</p>;
  }

  return (
    <div className="std-div">
      <h2>Brought Beer Amount</h2>
      <ul className="list-group">
        {data.map((user_bear_amount: UserBeerAmount) => (
          <li className="list-group-item" key={user_bear_amount.user}>
            Name: {user_bear_amount.user} / Brought beer:{" "}
            {user_bear_amount.amount} / Fine beer:{" "}
            {user_bear_amount.included_fine} / Result:{" "}
            {user_bear_amount.amount - user_bear_amount.included_fine}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserBeerAmountService;
