import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../../../components/TaskForm';
import { useTaskMutations } from '../../../hooks/useTaskMutations';
import { Task } from '../../../types/taskTypes';

// Mock the useTaskMutations hook
jest.mock('../../../hooks/useTaskMutations');

describe('TaskForm Component', () => {
  let createTaskMock: { mutate: jest.Mock };
  let editTaskMock: { mutate: jest.Mock };
  let resetTaskMock: jest.Mock;
  let onErrorMock: jest.Mock;
  let onSuccessMock: jest.Mock;

  beforeEach(() => {
    createTaskMock = { mutate: jest.fn() };
    editTaskMock = { mutate: jest.fn() };
    resetTaskMock = jest.fn();
    onErrorMock = jest.fn();
    onSuccessMock = jest.fn();

    (useTaskMutations as jest.Mock).mockReturnValue({
      createTask: createTaskMock,
      editTask: editTaskMock,
    });
  });

  test('renders form with all input fields', () => {
    render(
      <TaskForm
        task={null}
        resetTask={resetTaskMock}
        onError={onErrorMock}
        onSuccess={onSuccessMock}
        page={1}
      />
    );

    expect(screen.getByLabelText(/Title\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Due date\*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  test('displays validation errors for empty title and due date', () => {
    render(
      <TaskForm
        task={null}
        resetTask={resetTaskMock}
        onError={onErrorMock}
        onSuccess={onSuccessMock}
        page={1}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

    expect(screen.getByText('Task title is required')).toBeInTheDocument();
    expect(screen.getByText('Due date is required')).toBeInTheDocument();
  });

  test('calls createTask mutation on submit when adding a new task', () => {
    render(
      <TaskForm
        task={null}
        resetTask={resetTaskMock}
        onError={onErrorMock}
        onSuccess={onSuccessMock}
        page={1}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title\*/), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByLabelText(/Description/), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText(/Status\*/), { target: { value: 'IN_PROGRESS' } });
    fireEvent.change(screen.getByLabelText(/Priority\*/), { target: { value: 'HIGH' } });
    fireEvent.change(screen.getByLabelText(/Due date\*/), { target: { value: '2025-03-08' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Task/i }));

    expect(createTaskMock.mutate).toHaveBeenCalledWith(
      {
        title: 'New Task',
        description: 'Test Description',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: new Date('2025-03-08'),
      },
      expect.any(Object)
    );
  });

  test('calls editTask mutation when updating an existing task', () => {
    const mockTask: Task = {
      id: '123',
      title: 'Existing Task',
      description: 'Existing Description',
      priority: 'MEDIUM',
      status: 'TODO',
      dueDate: new Date('2025-03-10'),
      createdAt: new Date('2025-03-10'),
      updatedAt: new Date('2025-03-10'),
    };

    render(
      <TaskForm
        task={mockTask}
        resetTask={resetTaskMock}
        onError={onErrorMock}
        onSuccess={onSuccessMock}
        page={1}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title\*/), { target: { value: 'Updated Task' } });
    fireEvent.change(screen.getByLabelText(/Due date\*/), { target: { value: '2025-03-15' } });

    fireEvent.click(screen.getByRole('button', { name: /Update Task/i }));

    expect(editTaskMock.mutate).toHaveBeenCalledWith(
      {
        id: '123',
        updatedFields: {
          title: 'Updated Task',
          description: 'Existing Description',
          priority: 'MEDIUM',
          status: 'TODO',
          dueDate: new Date('2025-03-15'),
        },
      },
      expect.any(Object)
    );
  });

  test('resets form when reset button is clicked', () => {
    render(
      <TaskForm
        task={null}
        resetTask={resetTaskMock}
        onError={onErrorMock}
        onSuccess={onSuccessMock}
        page={1}
      />
    );

    fireEvent.change(screen.getByLabelText(/Title\*/), { target: { value: 'Task to Reset' } });

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

    expect(screen.getByLabelText(/Title\*/)).toHaveValue('');
    expect(resetTaskMock).toHaveBeenCalled();
  });
});
