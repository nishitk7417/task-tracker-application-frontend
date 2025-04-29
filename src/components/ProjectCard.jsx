import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectCard({ project, onDelete }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`/api/v1/tasks?projectId=${project._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(res.data.data);
      } catch (error) {
        console.error('Error fetching tasks:', error.response?.data?.message || error.message);
      }
    };
  
    fetchTasks();
  }, [project._id]);


  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      const res = await axios.post('/api/v1/tasks', {
        projectId: project._id,
        title: newTaskTitle,
      });
      setTasks([...tasks, res.data.data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`/api/v1/tasks/${taskId}`, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: res.data.data.status } : task
        )
      );
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <button
        onClick={() => onDelete(project._id)}
        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1 rounded-md mb-4"
      >
        Delete Project
      </button>

      <div className="tasks">
        <h4 className="text-lg font-medium mb-2">Tasks</h4>
        <ul className="space-y-1 mb-2">
          {tasks.map((task) => (
            <li key={task._id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <span>{task.title} - {task.status}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleUpdateTaskStatus(task._id, 'completed')}
                  className="text-green-400 text-sm"
                >
                  Complete
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="New Task Title"
            className="flex-1 px-3 py-1 rounded border border-gray-600 bg-gray-900 text-white"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>

  );
}

export default ProjectCard;
