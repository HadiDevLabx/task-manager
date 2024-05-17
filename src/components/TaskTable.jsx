import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Checkbox, IconButton, TablePagination, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, MenuItem, Select,
  FormControl, InputLabel, Box, Typography
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import TaskForm from './TaskForm';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';
import axios from './axiosSetup';

const TaskTable = () => {
  const theme = useTheme();

  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editTask, setEditTask] = useState(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [viewTask, setViewTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [page, rowsPerPage, filterStatus]);

  const fetchTasks = async () => {
    try {
      const response = await axios.post('/getTasks', {
        page: page + 1,
        limit: rowsPerPage,
        status: filterStatus,
      });
      setTasks(response.data.tasks);
      setTotalTasks(response.data.count);
    } catch (error) {
      toast.error('Failed to fetch tasks', {
        style: { background: theme.palette.primary.main, color: 'white' }
      });
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelectedTasks = tasks.map((task) => task._id);
      setSelectedTasks(newSelectedTasks);
      return;
    }
    setSelectedTasks([]);
  };

  const handleSelect = (event, id) => {
    const selectedIndex = selectedTasks.indexOf(id);
    let newSelectedTasks = [];

    if (selectedIndex === -1) {
      newSelectedTasks = newSelectedTasks.concat(selectedTasks, id);
    } else if (selectedIndex === 0) {
      newSelectedTasks = newSelectedTasks.concat(selectedTasks.slice(1));
    } else if (selectedIndex === selectedTasks.length - 1) {
      newSelectedTasks = newSelectedTasks.concat(selectedTasks.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedTasks = newSelectedTasks.concat(
        selectedTasks.slice(0, selectedIndex),
        selectedTasks.slice(selectedIndex + 1)
      );
    }

    setSelectedTasks(newSelectedTasks);
  };

  const handleDelete = (id) => {
    setTaskToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/deleteTask?id=${taskToDelete}`);
      setConfirmOpen(false);
      setTaskToDelete(null);
      fetchTasks();
      toast.success('Task deleted successfully', {
        style: { background: theme.palette.primary.main, color: 'white' }
      });
    } catch (error) {
      toast.error('Failed to delete task', {
        style: { background: theme.palette.primary.main, color: 'white' }
      });
    }
  };

  const handleBulkDelete = () => {
    setConfirmBulkOpen(true);
  };

  const handleConfirmBulkDelete = async () => {
    const idsQuery = selectedTasks.map(id => `id=${id}`).join('&');
    try {
      await axios.delete(`/deleteTask?${idsQuery}`);
      setSelectedTasks([]);
      setConfirmBulkOpen(false);
      fetchTasks();
      toast.success('Selected tasks deleted successfully', {
        style: { background: theme.palette.primary.main, color: 'white' }
      });
    } catch (error) {
      toast.error('Failed to delete selected tasks', {
        style: { background: theme.palette.primary.main, color: 'white' }
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEdit = (task) => {
    task.dueDate = new Date(task.dueDate).toISOString().split('T')[0];
    setEditTask(task);
  };

  const handleView = (task) => {
    setViewTask(task);
  };

  const handleFormClose = (success) => {
    setEditTask(null);
    if (success) {
      fetchTasks();
      toast.success('Task updated successfully', {
        style: { background: theme.palette.primary.main, color: 'white' }
      });
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
    setPage(0);
  };

  return (
    <Paper>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Button variant="contained" color="primary" onClick={() => setEditTask({})}>
          Create Task
        </Button>
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBulkDelete}
            disabled={selectedTasks.length === 0}
            style={{ marginRight: '16px' }}
          >
            Delete Selected
          </Button>
          <FormControl margin="dense" style={{ minWidth: 150 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="InProgress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
                  checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id} selected={selectedTasks.indexOf(task._id) !== -1}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedTasks.indexOf(task._id) !== -1}
                    onChange={(event) => handleSelect(event, task._id)}
                  />
                </TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell style={{ 
                  maxWidth: 200, 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}>
                  {task.description}
                </TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(task)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleView(task)}>
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalTasks}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {editTask && <TaskForm task={editTask} onClose={handleFormClose} />}
      {viewTask && (
        <Dialog open={true} onClose={() => setViewTask(null)}>
          <DialogTitle>Task Details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant="h6" gutterBottom>
                Title: {viewTask.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Description: {viewTask.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Due Date: {new Date(viewTask.dueDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Status: {viewTask.status}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewTask(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this task?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmBulkOpen} onClose={() => setConfirmBulkOpen(false)}>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete the selected tasks?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmBulkOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmBulkDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default TaskTable;
