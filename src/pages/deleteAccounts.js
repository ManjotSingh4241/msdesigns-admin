import Navbar from "../components/navbar";

import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../database/firebase";
// import { deleteUser } from "firebase/auth";

function DeleteAccounts() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const listUsers = httpsCallable(functions, "listUsers");
      const res = await listUsers();
      setUsers(res.data);
    };

    fetchUsers();
  }, []);

  const handleDelete = async (uid) => {
    try {
      // You cannot delete other users from the client SDK
      // You must trigger a function that deletes the account by UID
      const deleteFn = httpsCallable(functions, "deleteUserByUid");
      await deleteFn({ uid });
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      alert("User deleted.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user.");
    }
  };

  return (
    <>
      <Navbar />

            <div className="container py-5">
              <h3 className="mb-4">Accounts...</h3>
              {users.map((user) => (
                <div
                  key={user.uid}
                  className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded"
                >
                  <div>
                    <strong>{user.displayName || "No Name"}</strong> <br />
                    {user.email}
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user.uid)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
    </>
  );
}

export default DeleteAccounts;
