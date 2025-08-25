import { useEffect, useState } from "react";
import { User } from "../../classes/UserClass";
import "../../App.css";

const BACKENDURL = import.meta.env.VITE_API_URL;

function UserGroup() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${BACKENDURL}/user/all`)
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
      <h2>All Users</h2>
      <ul className="list-group">
        {data.map((user: User) => (
          <li
            className="list-group-item"
            key={user.id}
            onClick={() => setSelectedUser(user)}
          >
            {user.first_name} {user.last_name}
          </li>
        ))}
      </ul>

      {selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              {selectedUser.first_name} {selectedUser.last_name}
            </h3>
            <div className="list-div">
              <p>ID: {selectedUser.id}</p>
              <p>Username: {selectedUser.username}</p>
              <p>TeamID: {selectedUser.team_id}</p>
              <p>Role: {selectedUser.role}</p>
              <p>Birthday: {selectedUser.birthday.toString()}</p>
              <br />
            </div>
            <button onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserGroup;
