import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Link,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import authService from '../services/auth';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting form data:', formData);

    try {
      const response = await authService.register(formData);
      console.log('Signup response:', response.data);
      // Redirect to login page after successful signup
      window.location.href = '/login';
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err.response?.data);
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred during sign up'
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>
          
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ minLength: 3 }}
              helperText="Username must be at least 3 characters long"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ minLength: 6 }}
              helperText="Password must be at least 6 characters long"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Typography align="center">
              Already have an account?{' '}
              <Link href="/login" underline="hover">
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default SignUp; 