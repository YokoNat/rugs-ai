import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectDashboard, { type Project } from "../components/ProjectDashboard";

const API_BASE = "http://localhost:8000";

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${API_BASE}/projects/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProject(data);
      } catch (err) {
        setError("Project not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !project) return <p className="text-red-500">{error}</p>;

  return <ProjectDashboard project={project} onBack={() => window.history.back()} />;
};

export default ProjectPage; 