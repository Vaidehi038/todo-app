import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function TodoForm({ onSubmit }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title);
    setTitle('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Add a new todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={!title.trim()}
      >
        Add Todo
      </Button>
    </Box>
  );
}

export default TodoForm; 