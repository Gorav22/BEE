import React, { useState, useEffect } from "react";
import { api_base_url } from "../helper";
import { Link } from "react-router-dom";

const PublicProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api_base_url}/public/projects`);
      if (!response.ok) {
        throw new Error("Failed to fetch public projects");
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Public Projects</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {loading && <p className="text-center mb-4">Loading...</p>}

      {projects.length ? (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <Link to={`/editior/${project._id}`}>
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
              </Link>
              <p className="text-gray-400">{project.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No public projects available.</p>
      )}
    </div>
  );
};

export default PublicProjectsPage;
