import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import todoService from '../services/todo';

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoService.getTodos();
      setTodos(response.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to fetch todos');
    }
  };

  const handleAddTodo = async (title) => {
    try {
      const response = await todoService.createTodo({ title });
      setTodos([...todos, response.data]);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Todos
          </Typography>
          <Button onClick={handleLogout} variant="outlined" color="primary">
            Logout
          </Button>
        </Box>
        
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <TodoForm onSubmit={handleAddTodo} />
        <TodoList todos={todos} setTodos={setTodos} />
      </Box>
    </Container>
  );
}

export default TodoPage; 