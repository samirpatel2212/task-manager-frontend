import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../../../components/TaskItem';
import { Task } from '../../../types/taskTypes';
import { priorityMap, statusMap } from '../../../common/constants';
import { dateToString } from '../../../common/utils';

describe('TaskItem Component', () => {
  const mockEditTask = jest.fn();
  const mockRemoveTask = jest.fn();

  const task: Task = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: new Date('2025-03-10'),
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-03-10'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task details correctly', () => {
    render(<TaskItem task={task} editTask={mockEditTask} removeTask={mockRemoveTask} />);

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(screen.getByText(task.description ?? '')).toBeInTheDocument();
    expect(screen.getByText(statusMap[task.status])).toBeInTheDocument();
    expect(screen.getByText(priorityMap[task.priority])).toBeInTheDocument();
    expect(screen.getByText(dateToString(task.dueDate))).toBeInTheDocument();
  });

  test('calls editTask function when Edit button is clicked', () => {
    render(<TaskItem task={task} editTask={mockEditTask} removeTask={mockRemoveTask} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(mockEditTask).toHaveBeenCalledTimes(1);
    expect(mockEditTask).toHaveBeenCalledWith(task);
  });

  test('calls removeTask function when Delete button is clicked', () => {
    render(<TaskItem task={task} editTask={mockEditTask} removeTask={mockRemoveTask} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockRemoveTask).toHaveBeenCalledTimes(1);
    expect(mockRemoveTask).toHaveBeenCalledWith(task.id);
  });
});
