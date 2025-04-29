import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import Navbar from '../components/Navbar';

function Home() {
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/v1/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) return;
    if (projects.length >= 4) {
      alert('You can only create up to 4 projects.');
      return;
    }
    try {
      const res = await axios.post('/api/v1/projects', { title: newProjectTitle });
      setProjects([...projects, res.data.data]);
      setNewProjectTitle('');
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/v1/projects/${projectId}`);
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="home pt-24 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Your Projects</h1>
        <div className="create-project flex flex-col sm:flex-row items-center gap-4 mb-8">
            <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Enter project title..."
                className="w-full sm:w-2/3 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
            onClick={handleCreateProject}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-300"
            >
            Create Project
            </button>
        </div>

        <div className="projects-list grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onDelete={handleDeleteProject} />
            ))}
        </div>
    </div>

    </>
  );
}

export default Home;
