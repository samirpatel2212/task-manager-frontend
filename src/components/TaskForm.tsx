import React, { FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { Task } from '../types/taskTypes';
import { dateToString } from '../common/utils';
import { Button } from '../common/styled';


const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0px 0px 20px;
    padding: 20px;
    border: 1px solid #ddd;
    max-height: 420px;
`;

const ErrorMessage = styled.span`
    color: red;
    font-size: 0.9rem;
`;

const ButtonContainer = styled.div`
  margin-top: auto;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; 
`;

interface TaskFormProps {
    task?: Task | null; // If task is provided, it's in edit mode
    page: number;
    resetTask: () => void;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, resetTask, onError, onSuccess, page }) => {
    const { createTask, editTask } = useTaskMutations(page);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'COMPLETED'>('TODO');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
    const [dueDate, setDueDate] = useState('');

    const [titleError, setTitleError] = useState<string | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
            setDueDate(dateToString(task.dueDate));
            setStatus(task.status);
            setDateError('');
            setTitleError('');
        } else {
            resetForm();
        }
    }, [task]);

    const resetForm = () => {
        resetTask();
        setTitle('');
        setDescription('');
        setStatus('TODO');
        setPriority('LOW');
        setDueDate('');
        setTitleError('');
        setDateError('');
    }

    const validateTitle = (value: string) => {
        if(!value.trim()) {
            setTitleError('Task title is required');
            return false;
        } else if (title.length < 3) {
            setTitleError('Title must be at least 3 characters');
            return false;
        } else if (title.length > 100) {
            setTitleError('Title must be less than 100 characters');
            return false;
        }
        setTitleError(null);
        return true;
    }
    const validateDueDate = (value: string) => {
        if(!value.trim()) {
            setDateError('Due date is required');
            return false;
        }
        setDateError(null);
        return true;
    }
    const vaidateForm = (): boolean => {
        const validTitle = validateTitle(title);
        const validDueDate = validateDueDate(dueDate);
        return (validTitle && validDueDate);
    }

    const handleSuccess = (message: string) => {
        resetForm();
        onSuccess(message);
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(vaidateForm()) {
            if (task) {
                editTask.mutate({
                    id:task.id, 
                    updatedFields: { 
                        title,
                        description,
                        priority,
                        status,
                        dueDate: new Date(dueDate),
                    }
                }, {
                    onSuccess: () => { handleSuccess('Task updated successfully') },
                    onError: () => { onError('Failed to update task')}
                });
                ;
            } else {
                createTask.mutate({
                    title,
                    description,
                    priority,
                    status,
                    dueDate: new Date(dueDate),
                },{
                    onSuccess: () => { handleSuccess('Task created successfully') },
                    onError: () => { onError('Failed to create task')}
                });
            }
        }
    };    
    
    return (
        <FormContainer onSubmit={handleSubmit}>
            <FormGroup>
                <label htmlFor='title'>Title*</label>
                <input
                    id='title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onBlur={e => validateTitle(e.target.value)}
                    placeholder='Title'
                />
            </FormGroup>
            {titleError && <ErrorMessage>{titleError}</ErrorMessage>}
            
            <FormGroup>
                <label htmlFor='description'>Description</label>
                <input
                    id='description'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder='Description'
                />
            </FormGroup>

            <FormGroup>
                <label htmlFor='status'>Status*</label>
                <select
                    id='status'
                    value={status}
                    onChange={e => setStatus(e.target.value as 'TODO' | 'IN_PROGRESS' | 'COMPLETED')}
                >
                    <option value='TODO'>To Do</option>
                    <option value='IN_PROGRESS'>In Progress</option>
                    <option value='COMPLETED'>Completed</option>
                </select>
            </FormGroup>

            <FormGroup>
                <label htmlFor='priority'>Priority*</label>
                <select
                    id='priority'
                    value={priority}
                    onChange={e => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                >
                    <option value='LOW'>Low</option>
                    <option value='MEDIUM'>Medium</option>
                    <option value='HIGH'>High</option>
                </select>
            </FormGroup>

            <FormGroup>
                <label htmlFor='dueDate'>Due date*</label>
                <input
                    type='date'
                    id='dueDate'
                    value={dueDate.toString()}
                    onChange={e => setDueDate(e.target.value)}
                    onBlur={e => validateDueDate(e.target.value)}
                />
            </FormGroup>
            {dateError && <ErrorMessage>{dateError}</ErrorMessage>}
            <ButtonContainer>
                <Button type='submit'>{task ? 'Update Task' : 'Add Task'}</Button>
                <Button type='reset' onClick={() => resetForm()}>Reset</Button>
            </ButtonContainer>
        </FormContainer>
    );
}

export default TaskForm;