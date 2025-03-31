import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import todoService from '../services/todo';

function TodoList({ todos, setTodos }) {
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const handleToggle = async (todoId) => {
    try {
      const todo = todos.find(t => t.id === todoId);
      await todoService.updateTodo(todoId, { completed: !todo.completed });
      setTodos(todos.map(t => 
        t.id === todoId ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      await todoService.deleteTodo(todoId);
      setTodos(todos.filter(t => t.id !== todoId));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setEditedTitle(todo.title);
  };

  const handleEditClose = () => {
    setEditingTodo(null);
    setEditedTitle('');
  };

  const handleEditSave = async () => {
    if (!editedTitle.trim()) return;
    try {
      await todoService.updateTodo(editingTodo.id, { title: editedTitle });
      setTodos(todos.map(t =>
        t.id === editingTodo.id ? { ...t, title: editedTitle } : t
      ));
      handleEditClose();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  if (todos.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          No todos yet. Add one to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              bgcolor: 'background.paper',
              mb: 1,
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Checkbox
              edge="start"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
              color="primary"
            />
            <ListItemText
              primary={todo.title}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary',
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditClick(todo)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={!!editingTodo} onClose={handleEditClose}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Todo Title"
            fullWidth
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TodoList; 