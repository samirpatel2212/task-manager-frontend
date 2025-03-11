import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTaskMutations } from '../../../hooks/useTaskMutations';
import TaskList from '../../../components/TaskList';
import { Task } from '../../../types/taskTypes';

jest.mock('../../../hooks/useTaskMutations');

const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', description: 'Description 1', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: new Date('2025-03-15'), createdAt: new Date('2025-03-20'), updatedAt: new Date('2025-03-20') },
    { id: '2', title: 'Task 2', description: 'Description 2', status: 'COMPLETED', priority: 'LOW', dueDate: new Date('2025-03-20'), createdAt: new Date('2025-03-20'), updatedAt: new Date('2025-03-20') }
];

describe('TaskList Component', () => {
    beforeAll(() => {
        global.MutationObserver = class {
            constructor() { }
            disconnect() { }
            observe() { }
            takeRecords() { return []; }
        };
    });
    beforeEach(() => {
        (useTaskMutations as jest.Mock).mockReturnValue({
            tasks: mockTasks,
            isLoading: false,
            removeTask: { mutate: jest.fn() },
            error: null,
            hasNextPage: false
        });
    });

    test('renders task list correctly', async () => {
        render(<TaskList />);
        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
        });
    });

    test('deletes a task and shows toast message', async () => {
        const removeTaskMock = jest.fn((_, { onSuccess }) => onSuccess());

        (useTaskMutations as jest.Mock).mockReturnValue({
            tasks: mockTasks,
            isLoading: false,
            removeTask: { mutate: removeTaskMock },
            error: null,
            hasNextPage: false
        });

        render(<TaskList />);

        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => expect(screen.getByText('Task delete successfully')).toBeInTheDocument());
        expect(removeTaskMock).toHaveBeenCalled();
    });

    test('displays error message when deleting a task fails', async () => {
        const removeTaskMock = jest.fn((_, { onError }) => onError());

        (useTaskMutations as jest.Mock).mockReturnValue({
            tasks: mockTasks,
            isLoading: false,
            removeTask: { mutate: removeTaskMock },
            error: null,
            hasNextPage: false
        });

        render(<TaskList />);
        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => expect(screen.getByText('Failed to delete task')).toBeInTheDocument());
    });

    test('renders loading indicator when tasks are being fetched', () => {
        (useTaskMutations as jest.Mock).mockReturnValue({
            tasks: [],
            isLoading: true,
            removeTask: { mutate: jest.fn() },
            error: null,
            hasNextPage: false
        });

        render(<TaskList />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('shows error message when task fetching fails', () => {
        (useTaskMutations as jest.Mock).mockReturnValue({
            tasks: [],
            isLoading: false,
            removeTask: { mutate: jest.fn() },
            error: { message: 'Error loading tasks' },
            hasNextPage: false
        });

        render(<TaskList />);
        expect(screen.getByText('Error loading tasks: Error loading tasks')).toBeInTheDocument();
    });
});
