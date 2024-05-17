import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Button, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import axios from './axiosSetup';  

const TaskForm = ({ task, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: task,
  });
 
 
  const onSubmit = async (data) => {
    try {
      if (task._id) {
        await axios.put(`/updateTask/${task._id}`, data);
      } else {
        await axios.post('/createTask', data);
      }
      onClose(true);  
    } catch (error) {
      console.error('Error updating/creating task:', error);
      onClose(false);  
    }
  };

  return (
    <Dialog open={Boolean(task)} onClose={() => onClose(false)}>
      <DialogTitle>{task._id ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title ? errors.title.message : ''}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          {...register('description', { required: 'Description is required' })}
          error={!!errors.description}
          helperText={errors.description ? errors.description.message : ''}
        />
        <TextField
          margin="dense"
          label="Due Date"
          type="date"
          fullWidth
          {...register('dueDate', { required: 'Due Date is required' })}
          error={!!errors.dueDate}
          helperText={errors.dueDate ? errors.dueDate.message : ''}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl margin="dense" fullWidth error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            defaultValue={task.status || ''}
            {...register('status', { required: 'Status is required' })}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
          {errors.status && <p style={{ color: 'red' }}>{errors.status.message}</p>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">
          {task._id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;