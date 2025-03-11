import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { Task } from '../types/taskTypes';
import { fetchTasks, addTask, updateTask, deleteTask } from '../api/taskApi';


export const useTaskMutations = (page: number, onRemoveTask?: () => void) => {

    const queryClient = useQueryClient();

    const { data: tasks=[], error, isLoading } = useQuery({
        queryKey: ['tasks', page],
        queryFn: () => fetchTasks(page),
        placeholderData: keepPreviousData
    })

    const createTask = useMutation({
        mutationFn: addTask,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', page]})
    });

    const editTask = useMutation({
        mutationFn: ({id, updatedFields}: {id: string; updatedFields: Partial<Task>}) => updateTask(id, updatedFields),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', page]})
    });

    const removeTask = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', page]});
            onRemoveTask?.();
        }
    });

    const hasNextPage = tasks && tasks.length > 0;

    return { tasks, createTask, editTask, removeTask, isLoading, error, hasNextPage };
}
