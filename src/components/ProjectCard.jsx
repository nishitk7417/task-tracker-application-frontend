import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProjectCard({ project, onDelete }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedStatus, setEditedStatus] = useState('pending');

  //fetching tasks
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


  //adding tasks
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

  //deleting tasks
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/v1/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  //editing tasks
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedStatus(task.status);
  };
  
  const handleSaveEdit = async (taskId) => {
    try {
      const res = await axios.put(`/api/v1/tasks/${taskId}`, {
        title: editedTitle,
        status: editedStatus,
      });
  
      setTasks(tasks.map((task) =>
        task._id === taskId ? { ...task, ...res.data.data } : task
      ));
  
      setEditingTaskId(null);
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };
  

  return (
    <div className="bg-gray-800 flex flex-col gap-5 text-white p-6 rounded-lg shadow-md">
      <div className='flex justify-between items-center'>
        <h3 className="text-2xl text-blue-400 font-semibold">{project.title}</h3>
        <span
          onClick={() => onDelete(project._id)}
          title='Project delete'
          className="bg-[#1a1a1a] hover:bg-red-500 px-4 py-2 rounded-md cursor-pointer"
        >
          <svg className='w-4 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
        </span>
      </div>

      {/*add task section*/}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New Task Title..."
          className="flex-1 px-3 py-1 rounded border border-gray-600 bg-gray-900 text-white"
        />
        <button
           onClick={handleAddTask}
           title='Add task'
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1 rounded"
        >
          Add Task
        </button>
      </div>

      {/*task render here*/}
      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-medium">Tasks</h4>
        <ul className="space-y-1 flex flex-col items-center">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex flex-col sm:flex-row items-center justify-between w-full bg-gray-700 p-2 rounded gap-2"
            >
              {editingTaskId === task._id ? (
                <div className="w-full flex flex-col  sm:items-center gap-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="p-1 rounded bg-gray-800 text-white border border-gray-600"
                  />
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="p-1 rounded bg-gray-800 text-white border border-gray-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleSaveEdit(task._id)}
                      className="text-blue-400 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className="text-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{task.title} - {task.status}</span>
                  <div className="space-x-2 flex items-center">
                    <span
                      onClick={() => startEditing(task)}
                      className="bg-[#1a1a1a] hover:bg-yellow-500 px-4 py-2 rounded-md cursor-pointer flex justify-center items-center"
                    >
                      <svg className='w-4 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg>
                    </span>
                    <span
                      onClick={() => handleDeleteTask(task._id)}
                      title='Delete task'
                      className="bg-[#1a1a1a] hover:bg-red-500 px-4 py-2 rounded-md cursor-pointer flex justify-center items-center"
                    >
                      <svg className='w-4 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    </span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
}

export default ProjectCard;
