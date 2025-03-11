import { CreateTask, Task, UpdateTask } from '../types/taskTypes';

export const API_URL = 'http://localhost:3001/tasks';

const handleResponseError = async (response: Response, method: string, message: string) => {
    const errorText = await response.text();
    const { url, status, statusText } = response;

    console.error(`${message}:`, {
    url,
    method,
    status,
    statusText,
    responseBody: errorText,
    timeStamp: new Date().toISOString(),
    });

    throw new Error(`${message}: ${status} ${statusText}`);
  };
  

export const fetchTasks = async (page: number): Promise<Task[]> => {
    const response = await fetch(`${API_URL}?page=${page}`);
    if(!response.ok) await handleResponseError(response, 'GET', 'Fetch Task failed');
    return response.json();
}

export const addTask = async (task: CreateTask): Promise<Task> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
    });
    if (!response.ok) await handleResponseError(response, 'POST', 'Add Task failed');
    return response.json();
}

export const updateTask = async (id: string, updatedFields: UpdateTask) : Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
    });
    if (!response.ok) await handleResponseError(response, 'PUT', 'Update Task failed');
    return response.json();
}

export const deleteTask = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if(!response.ok) await handleResponseError(response, 'DELETE', 'Delete Task failed');
}