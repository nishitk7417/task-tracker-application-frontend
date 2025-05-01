import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      alert('Please login first.');
      return;
    }
    fetchProjects();
  }, []);

  // fetching project
  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/v1/projects',{
        headers:{
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  //create project
  const handleCreateProject = async () => {
    
    if (!token) {
      alert('Please login first to create a project.');
      navigate('/login')
      return;
    }
    if (!newProjectTitle.trim()) return;
    if (projects.length >= 4) {
      alert('You can only create up to 4 projects.');
      return;
    }
    try {
      const res = await axios.post('/api/v1/projects', { title: newProjectTitle }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },});
      setProjects([...projects, res.data.data]);
      setNewProjectTitle('');
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  //delete projeect
  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`/api/v1/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="pt-24 flex flex-col items-center p-6 w-screen">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Your Projects</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Enter Project Title..."
                className="w-full  px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
            onClick={handleCreateProject}
            title='Create project'
            className="w-full"
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
