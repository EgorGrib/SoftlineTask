import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://localhost:44332/api';

const TaskForm = ({ onSubmit, initialValues, onCancel }) => {
    const [name, setName] = useState(initialValues.name || '');
    const [description, setDescription] = useState(initialValues.description || '');
    const [statusId, setStatusId] = useState(initialValues.statusId || 1);
    const [statusList, setStatusList] = useState([]);

    useEffect(() => {
        const loadStatuses = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/Statuses`);
                setStatusList(response.data);
            } catch (error) {
                console.error('Error loading statuses:', error);
            }
        };

        loadStatuses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit({ name, description, statusId });
            setName('');
            setDescription('');
            setStatusId(1);
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    };

    return (
        <div className="task-form">
            <h3>{initialValues.id ? 'Edit task' : 'Add task'}</h3>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

                <label>Description:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />

                {initialValues.id && (
                    <>
                        <label>Status:</label>
                        <select value={statusId} onChange={(e) => setStatusId(Number(e.target.value))}>
                            {statusList.map((status) => (
                                <option key={status.id} value={status.id}>
                                    {status.statusName}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <button type="submit">{initialValues.id ? 'Save' : 'Add'}</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

const Tasks = ({ onEdit, onDelete }) => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/Problems`);
            setTasks(response.data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    };

    const handleEditClick = () => {
        onEdit(selectedTask);
    };

    const handleDeleteClick = async () => {
        if (!selectedTask) {
            alert('Choose task to delete');
            return;
        }

        try {
            await onDelete(selectedTask.id);
            setSelectedTask(null);
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleRowClick = (task) => {
        setSelectedTask(task);
    };

    return (
        <div className="table-container">
            <h2>Tasks</h2>
            <button onClick={() => onEdit(null)}>Add</button>
            <button onClick={handleEditClick} disabled={!selectedTask}>Edit</button>
            <button onClick={handleDeleteClick} disabled={!selectedTask}>Delete</button>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id} onClick={() => handleRowClick(task)} style={{ background: selectedTask === task ? '#eee' : 'transparent' }}>
                        <td>{task.name}</td>
                        <td>{task.description}</td>
                        <td>{task.status.statusName}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const TasksTab = () => {
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const handleEdit = (task) => {
        setFormOpen(true);
        setEditingTask(task);
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${API_BASE_URL}/Problems/${taskId}`);
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    };

    const handleFormSubmit = async (task) => {
        try {
            if (editingTask) {
                await axios.put(`${API_BASE_URL}/Problems/${editingTask.id}`, task);
            } else {
                await axios.post(`${API_BASE_URL}/Problems`, task);
            }
            setFormOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            throw error;
        }
    };

    return (
        <div>
            {isFormOpen ? (
                <TaskForm
                    onSubmit={handleFormSubmit}
                    initialValues={editingTask || {}}
                    onCancel={() => setFormOpen(false)}
                />
            ) : (
                <Tasks onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
};

const App = () => {
    return (
        <div className="app-container">
            <h1>Task tracker</h1>
            <TasksTab />
        </div>
    );
};

export default App;
