const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for users and todos (replace with a database in production)
const users = [];
const todos = [];

// JWT secret key (use environment variable in production)
const JWT_SECRET = 'your-secret-key';

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword
    };
    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: newUser.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      userId: user.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get todos endpoint
app.get('/api/todos', authenticateToken, (req, res) => {
  const userTodos = todos.filter(todo => todo.userId === req.user.userId);
  res.json(userTodos);
});

// Add todo endpoint
app.post('/api/todos', authenticateToken, (req, res) => {
  const { title } = req.body;
  const newTodo = {
    id: todos.length + 1,
    userId: req.user.userId,
    title,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update todo endpoint
app.put('/api/todos/:id', authenticateToken, (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === todoId && t.userId === req.user.userId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    ...req.body
  };

  res.json(todos[todoIndex]);
});

// Delete todo endpoint
app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === todoId && t.userId === req.user.userId);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos.splice(todoIndex, 1);
  res.json({ message: 'Todo deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 