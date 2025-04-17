import React, { useState, useEffect } from "react";
import { api_base_url } from "../helper";
import './AdminPage.css'; // Import the CSS file

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingActions, setLoadingActions] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(`${api_base_url}/admin/getUsers`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await fetch(`${api_base_url}/admin/projects?t=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    setLoadingActions(true);
    try {
      const response = await fetch(`${api_base_url}/admin/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newUserName, email: newUserEmail, username: newUserName, password: "defaultpassword" }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();
      if (result.success) {
        fetchUsers(); // Refresh the user list
        setNewUserName("");
        setNewUserEmail("");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingActions(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setLoadingActions(true);
    try {
      const response = await fetch(`${api_base_url}/admin/deleteUser/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      const result = await response.json();
      if (result.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingActions(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    setLoadingActions(true);
    try {
      const response = await fetch(`${api_base_url}/deleteProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          progId: projectId,
          userId: localStorage.getItem("userId"),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingActions(false);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {error && <p className="error-message">{error}</p>}
      {(loadingUsers || loadingProjects) && <p className="loading-message">Loading...</p>}

      <section className="admin-section">
        <h2 className="section-title">Create New User</h2>
        <form onSubmit={handleAddUser} className="admin-form">
          <div className="form-group">
            <label className="form-label">Name:</label>
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Enter name"
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              placeholder="Enter email"
              required
              className="form-input"
            />
          </div>
          <button type="submit" disabled={loadingActions} className="form-button">
            Add User
          </button>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="section-title">User Management</h2>
        {users.length ? (
          <ul className="item-list">
            {users.map((user) => (
              <li key={user._id} className="item-list-item">
                <span>
                  <strong>{user.name}</strong> (<em>{user.email}</em>)
                </span>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="action-button"
                  disabled={loadingActions}
                >
                  Delete User
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-items-message">No users available.</p>
        )}
      </section>

      <section className="admin-section">
        <h2 className="section-title">Project Management</h2>
        {projects.length ? (
          <ul className="item-list">
            {projects.map((project) => (
              <li key={project._id} className="item-list-item">
                <span>{project.title}</span>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="action-button"
                  disabled={loadingActions}
                >
                  Delete Project
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-items-message">No projects available.</p>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
