import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  TextField,
  Button,
  Link,
  Typography,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: 8,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [isMemberLogin, setIsMemberLogin] = useState(true);
  const [formData, setFormData] = useState({
    groupId: '',
    sgId: 0,
    mobileNo: '',
    password: '',
    saveGroupId: true,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  // Base API URL taken from local env (create-react-app style env var)
  const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'https://localhost:5001/api').replace(/\/$/, '') + '/';
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSwitchChange = (e) => {
    setIsMemberLogin(e.target.checked);
    setFormData({
      groupId: '',
      mobileNo: '',
      password: '',
      saveGroupId: true,
    });
    setErrors({});
    setSuccessMessage('');
  };

  const handleSaveGroupIdChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      saveGroupId: e.target.checked,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (isMemberLogin) {
      if (!formData.groupId.trim()) {
        newErrors.groupId = 'गट आयडी आवश्यक आहे';
      }
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'मोबाइल नंबर आवश्यक आहे';
    } else if (!/^[0-9]{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'मोबाइल नंबर १० अंकी असावा';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'पासवर्ड आवश्यक आहे';
    } else if (formData.password.length < 4) {
      newErrors.password = 'पासवर्ड कमीत कमी ४ वर्णांचा असावा';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    debugger;
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role === 'Member') {
        navigate('/member-dashboard');
      } else {
        navigate('/saving-group-dashboard');
      }
    }

  }, []);


  const handleSignIn = async (e) => {
    debugger;
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const payload = {
        isMemberLogin: isMemberLogin,
        sgId: isMemberLogin ? parseInt(formData.groupId) : 0,
        mobileNo: formData.mobileNo,
        password: formData.password,
      };

      try {
        debugger;
        const response = await axios.post(`${API_BASE}Auth/signin`, payload);

        if (response.data.success) {
          setSuccessMessage(response.data.message || 'साइन इन यशस्वी!');
          // Store token in localStorage or context
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify({
            sgId: response.data.sgId,
            name: response.data.name,
            role: response.data.role,
            monthId: response.data.monthId,
            memberId: response.data.memberId,
          }));
          // Redirect based on role
          if (isMemberLogin) {
            navigate('/member-dashboard');
          } else {
            navigate('/saving-group-dashboard');
          }
          console.log('Login successful:', response.data);
        } else {
          setErrorMessage(response.data.message || 'साइन इन अयशस्वी. कृपया पुन्हा प्रयत्न करा.');
        }
      } catch (error) {
        console.error('Sign In error:', error);
        setErrorMessage('नेटवर्क त्रुटी. कृपया आपले कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    alert('पासवर्ड विसरलात पृष्ठावर पुनर्निर्देशित करत आहे...');
    console.log('Forgot Password clicked');
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledCard>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#333',
              marginBottom: 1,
            }}
          >
            पुन्हा स्वागत आहे
          </Typography>
          <Typography variant="body2" color="textSecondary">
            आपल्या खात्यात साइन इन करा
          </Typography>
        </Box>

        {/* Success Message */}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              marginBottom: 2,
              borderRadius: 1,
            }}
          >
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert
            severity="error"
            sx={{
              marginBottom: 2,
              borderRadius: 1,
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* Member Login Toggle */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 3,
            padding: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {isMemberLogin ? 'सदस्य लॉगिन' : 'प्रशासक लॉगिन'}
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={isMemberLogin}
                onChange={handleSwitchChange}
                color="primary"
              />
            }
            label=""
          />
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSignIn}>
          {/* Group ID Field - Only visible for Member Login */}
          {isMemberLogin && (
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="गट आयडी"
                  name="groupId"
                  value={formData.groupId}
                  onChange={handleInputChange}
                  error={!!errors.groupId}
                  helperText={errors.groupId}
                  placeholder="आपला गट आयडी एंटर करा"
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    },
                  }}
                />
              </Grid>

              {/* Save Group ID Checkbox */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.saveGroupId}
                      onChange={handleSaveGroupIdChange}
                      color="primary"
                    />
                  }
                  label="पुढील लॉगिनसाठी गट आयडी सेव्ह करा"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '0.9rem',
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Mobile Number Field */}
          <TextField
            fullWidth
            label="मोबाइल नंबर"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleInputChange}
            error={!!errors.mobileNo}
            helperText={errors.mobileNo}
            placeholder="१० अंकी मोबाइल नंबर एंटर करा"
            variant="outlined"
            size="small"
            inputMode="numeric"
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="पासवर्ड"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={!!errors.password}
            helperText={errors.password}
            placeholder="आपला पासवर्ड एंटर करा"
            variant="outlined"
            size="small"
            sx={{
              marginBottom: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />

          {/* Forgot Password Link */}
          <Box
            sx={{
              textAlign: 'right',
              marginBottom: 3,
            }}
          >
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                handleForgotPassword();
              }}
              sx={{
                cursor: 'pointer',
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              पासवर्ड विसरलात?
            </Link>
          </Box>

          {/* Sign In and Sign Up Buttons */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <StyledButton
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {loading ? 'साइन इन करत आहे...' : 'साइन इन'}
              </StyledButton>
            </Grid>

          </Grid>
        </Box>

        {/* Footer Text */}
        <Box textAlign="center" sx={{ marginTop: 3 }}>
          <Typography variant="body2" color="textSecondary">
            खाते नाही?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={handleSignUp}
              sx={{
                cursor: 'pointer',
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              येथे साइन अप करा
            </Link>
          </Typography>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
};

export default Login;
