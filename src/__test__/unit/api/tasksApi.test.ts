import { CreateTask, UpdateTask } from '../../../types/taskTypes';
import { fetchTasks, addTask, updateTask, deleteTask, API_URL } from '../../../api/taskApi';

// Mock fetch
global.fetch = jest.fn();
const fetchMock = global.fetch as jest.Mock;

describe('Task API Functions', () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully for a given page', async () => {

      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date('2025-04-15'),
          createdAt: new Date('2025-03-01'),
          updatedAt: new Date('2025-03-01')
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          dueDate: new Date('2025-04-20'),
          createdAt: new Date('2025-03-05'),
          updatedAt: new Date('2025-03-07')
        }
      ];

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockTasks)
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await fetchTasks(1);

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}?page=1`);
      expect(result).toEqual(mockTasks);
    });

    it('should handle error when fetching tasks fails', async () => {

      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: jest.fn().mockResolvedValueOnce('Server error'),
        url: `${API_URL}?page=1`
      };

      fetchMock.mockResolvedValueOnce(mockResponse);
      console.error = jest.fn();

      await expect(fetchTasks(1)).rejects.toThrow('Fetch Task failed: 500 Internal Server Error');
      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}?page=1`);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('addTask', () => {
    it('should add a task successfully', async () => {

      const newTask: CreateTask = {
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2025-05-01')
      };

      const createdTask = {
        id: '3',
        ...newTask,
        createdAt: new Date('2025-03-10'),
        updatedAt: new Date('2025-03-10')
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(createdTask)
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await addTask(newTask);

      expect(fetchMock).toHaveBeenCalledWith(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      expect(result).toEqual(createdTask);
    });

    it('should handle error when adding a task fails', async () => {

      const newTask: CreateTask = {
        title: 'New Task',
        description: 'New Description',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2025-05-01')
      };

      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: jest.fn().mockResolvedValueOnce('Invalid task data'),
        url: API_URL
      };

      fetchMock.mockResolvedValueOnce(mockResponse);
      console.error = jest.fn();

      await expect(addTask(newTask)).rejects.toThrow('Add Task failed: 400 Bad Request');
      expect(fetchMock).toHaveBeenCalledWith(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {

      const taskId = '1';
      const updateFields: UpdateTask = {
        title: 'Updated Task',
        status: 'COMPLETED',
        priority: 'LOW'
      };

      const updatedTask = {
        id: taskId,
        title: 'Updated Task',
        description: 'Original Description',
        status: 'COMPLETED',
        priority: 'LOW',
        dueDate: new Date('2025-04-15'),
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-03-11')
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValueOnce(updatedTask)
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      const result = await updateTask(taskId, updateFields);

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateFields)
      });
      expect(result).toEqual(updatedTask);
    });

    it('should handle error when updating a task fails', async () => {

      const taskId = '1';
      const updateFields: UpdateTask = {
        status: 'COMPLETED',
        dueDate: new Date('2025-03-20')
      };

      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: jest.fn().mockResolvedValueOnce('Task not found'),
        url: `${API_URL}/${taskId}`
      };

      fetchMock.mockResolvedValueOnce(mockResponse);
      console.error = jest.fn();

      await expect(updateTask(taskId, updateFields)).rejects.toThrow('Update Task failed: 404 Not Found');
      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateFields)
      });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {

      const taskId = '1';
      const mockResponse = {
        ok: true
      };

      fetchMock.mockResolvedValueOnce(mockResponse);

      await deleteTask(taskId);

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/${taskId}`, { 
        method: 'DELETE' 
      });
    });

    it('should handle error when deleting a task fails', async () => {

      const taskId = '1';
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: jest.fn().mockResolvedValueOnce('Task not found'),
        url: `${API_URL}/${taskId}`
      };

      fetchMock.mockResolvedValueOnce(mockResponse);
      console.error = jest.fn();

      await expect(deleteTask(taskId)).rejects.toThrow('Delete Task failed: 404 Not Found');
      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/${taskId}`, { 
        method: 'DELETE' 
      });
      expect(console.error).toHaveBeenCalled();
    });
  });
});