import { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/admin/users", {
        withCredentials: true,
      })
      .then((res) => setUsers(res.data));
  }, []);

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5002/api/admin/user/${id}`, {
      withCredentials: true,
    });

    alert("User deleted");
    window.location.reload();
  };

  return (
    <div>
      <h2>👥 Users</h2>

      {users.map((u) => (
        <div key={u.id} className="card">
          <p>{u.name}</p>
          <p>{u.email}</p>
          <p>{u.role}</p>

          <button onClick={() => deleteUser(u.id)}>
            ❌ Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default ManageUsers;