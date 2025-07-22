import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  title: string;
  description?: string;
  custom_instructions?: string;
  planning?: string;
}

const API_BASE = "http://localhost:8000"; // Adjust if backend runs elsewhere

interface Props {
  onSelect?: (project: Project) => void;
}

const ProjectsSection: React.FC<Props> = ({ onSelect }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects/`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async () => {
    console.log("handleCreate called with:", { newTitle, newDescription });
    if (!newTitle.trim()) {
      console.log("No title provided, returning early");
      return;
    }
    setLoading(true);
    console.log("Making API request to create project");
    try {
      const res = await fetch(`${API_BASE}/projects/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      console.log("API response:", res.status, res.statusText);
      if (res.ok) {
        const createdProject = await res.json();
        console.log("Project created successfully:", createdProject);
        setNewTitle("");
        setNewDescription("");
        fetchProjects();
      } else {
        console.error("API request failed:", res.status, res.statusText);
      }
    } catch (err) {
      console.error("Error creating project", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await fetch(`${API_BASE}/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Projects</h2>

      {/* Create */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        className="bg-white p-4 rounded-xl shadow border border-gray-200 space-y-3"
      >
        <h3 className="font-medium">Create New Project</h3>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Project Title"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white rounded-xl shadow border border-gray-200 cursor-pointer hover:shadow-md"
            onClick={() => {
              if (onSelect) {
                onSelect(project);
              } else {
                navigate(`/projects/${project.id}`);
              }
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{project.title}</h4>
                {project.description && <p className="text-gray-600 text-sm mt-1">{project.description}</p>}
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(project.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-gray-500">No projects yet.</p>}
      </div>
    </div>
  );
};

export default ProjectsSection; 