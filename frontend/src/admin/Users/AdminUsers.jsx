import React, { useEffect, useState } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import toast from "react-hot-toast";
import "./adminusers.css";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    }
  }

  async function handleDelete(userId) {
    try {
      const { data } = await axios.delete(`${server}/api/user/${userId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message || "User deleted");
      fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="admin-users">
        <h1>All Users</h1>
        {loading ? (
          <p>Loading...</p>
        ) : users && users.length > 0 ? (
          <div className="users-table">
            <div className="users-header">
              <span>Name</span>
              <span>Email</span>
              <span>Subscriptions</span>
              <span>Actions</span>
            </div>
            {users.map((u) => (
              <div className="users-row" key={u._id}>
                <span>{u.name}</span>
                <span>{u.email}</span>
                <span>
                  {u.subscription && u.subscription.length > 0 ? (
                    u.subscription.map((c) => c.title).join(", ")
                  ) : (
                    "None"
                  )}
                </span>
                <span>
                  <button className="danger-btn" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </Layout>
  );
};

export default AdminUsers;


