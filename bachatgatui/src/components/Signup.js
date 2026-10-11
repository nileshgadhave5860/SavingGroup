import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  TextField,
  Button,
  Link,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Divider,
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

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
}));

const steps = ['गटाची माहिती', 'संपर्क माहिती', 'आर्थिक सेटिंग्ज'];

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    sgName: '',
    sgAddress: '',
    sgMobileNo: '',
    sgEmailId: '',
    sgPassword: '',
    monthStartDate: '',
    monthEndDate: '',
    monthlySavingAmount: '',
    interestEarned: '',
    latePaymentCharges_PerDay: '',
    monthNo: new Date().getMonth() + 1,
    yearNo: new Date().getFullYear(),
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'https://localhost:5001/api').replace(/\/$/, '') + '/';
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Group Details
        if (!formData.sgName.trim()) {
          setError('गटाचे नाव आवश्यक आहे');
          return false;
        }
        if (!formData.sgAddress.trim()) {
          setError('पत्ता आवश्यक आहे');
          return false;
        }
        return true;
      case 1: // Contact Information
        if (!formData.sgMobileNo.trim()) {
          setError('मोबाइल नंबर आवश्यक आहे');
          return false;
        }
        if (!/^\d{10}$/.test(formData.sgMobileNo)) {
          setError('मोबाइल नंबर १० अंकी असावा');
          return false;
        }
        if (!formData.sgEmailId.trim()) {
          setError('ईमेल आवश्यक आहे');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sgEmailId)) {
          setError('कृपया वैध ईमेल एंटर करा');
          return false;
        }
        if (!formData.sgPassword.trim()) {
          setError('पासवर्ड आवश्यक आहे');
          return false;
        }
        if (formData.sgPassword.length < 4) {
          setError('पासवर्ड कमीत कमी ४ वर्णांचा असावा');
          return false;
        }
        if (formData.sgPassword !== confirmPassword) {
          setError('पासवर्ड जुळत नाहीत');
          return false;
        }
        return true;
      case 2: // Financial Settings
        if (!formData.monthStartDate) {
          setError('महिना सुरू होण्याची तारीख आवश्यक आहे');
          return false;
        }
        if (!formData.monthEndDate) {
          setError('महिना संपण्याची तारीख आवश्यक आहे');
          return false;
        }
        if (!formData.monthlySavingAmount || formData.monthlySavingAmount <= 0) {
          setError('मासिक बचत रक्कम ० पेक्षा जास्त असावी');
          return false;
        }
        if (!formData.interestEarned || formData.interestEarned < 0) {
          setError('व्याज रक्कम आवश्यक आहे');
          return false;
        }
        if (!formData.latePaymentCharges_PerDay || formData.latePaymentCharges_PerDay < 0) {
          setError('उशीरा भरणा दंड (प्रतिदिन) आवश्यक आहे');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateStep(activeStep)) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        sgName: formData.sgName,
        sgAddress: formData.sgAddress,
        sgMobileNo: formData.sgMobileNo,
        sgEmailId: formData.sgEmailId,
        sgPassword: formData.sgPassword,
        monthStartDate: parseInt(formData.monthStartDate),
        monthEndDate: parseInt(formData.monthEndDate),
        monthlySavingAmount: parseFloat(formData.monthlySavingAmount),
        interestEarned: parseFloat(formData.interestEarned),
        latePaymentCharges_PerDay: parseFloat(formData.latePaymentCharges_PerDay),
        monthNo: parseInt(formData.monthNo),
        yearNo: parseInt(formData.yearNo),
      };

      const response = await axios.post(`${API_BASE}SavingGroup/register`,
        payload
      );

      setSuccess('नोंदणी यशस्वी! लॉगिन वर पुनर्निर्देशित करत आहे...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'नोंदणी अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              बचत गट माहिती
            </Typography>
            <StyledTextField
              fullWidth
              label="बचत गटाचे नाव"
              name="sgName"
              value={formData.sgName}
              onChange={handleInputChange}
              placeholder="गटाचे नाव एंटर करा"
              disabled={loading}
            />
            <StyledTextField
              fullWidth
              label="पत्ता"
              name="sgAddress"
              value={formData.sgAddress}
              onChange={handleInputChange}
              placeholder="गटाचा पत्ता एंटर करा"
              multiline
              rows={3}
              disabled={loading}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              संपर्क आणि सुरक्षा माहिती
            </Typography>
            <StyledTextField
              fullWidth
              label="मोबाइल नंबर"
              name="sgMobileNo"
              value={formData.sgMobileNo}
              onChange={handleInputChange}
              placeholder="१० अंकी मोबाइल नंबर एंटर करा"
              type="tel"
              disabled={loading}
            />
            <StyledTextField
              fullWidth
              label="ईमेल पत्ता"
              name="sgEmailId"
              value={formData.sgEmailId}
              onChange={handleInputChange}
              placeholder="ईमेल पत्ता एंटर करा"
              type="email"
              disabled={loading}
            />
            <StyledTextField
              fullWidth
              label="पासवर्ड"
              name="sgPassword"
              value={formData.sgPassword}
              onChange={handleInputChange}
              type="password"
              placeholder="पासवर्ड एंटर करा (किमान ४ वर्ण)"
              disabled={loading}
            />
            <StyledTextField
              fullWidth
              label="पासवर्ड पुष्टी करा"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="आपला पासवर्ड पुष्टी करा"
              disabled={loading}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              आर्थिक सेटिंग्ज
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="महिना सुरू होण्याची तारीख"
                  name="monthStartDate"
                  type="number"
                  value={formData.monthStartDate}
                  onChange={handleInputChange}
                  inputProps={{ min: '1', max: '31' }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="महिना संपण्याची तारीख"
                  name="monthEndDate"
                  type="number"
                  value={formData.monthEndDate}
                  onChange={handleInputChange}
                  inputProps={{ min: '1', max: '31' }}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="मासिक बचत रक्कम"
                  name="monthlySavingAmount"
                  type="number"
                  value={formData.monthlySavingAmount}
                  onChange={handleInputChange}
                  inputProps={{ step: '0.01', min: '0' }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="व्याज मिळणे"
                  name="interestEarned"
                  type="number"
                  value={formData.interestEarned}
                  onChange={handleInputChange}
                  inputProps={{ step: '0.01', min: '0' }}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="उशीरा भरणा दंड (प्रतिदिन)"
                  name="latePaymentCharges_PerDay"
                  type="number"
                  value={formData.latePaymentCharges_PerDay}
                  onChange={handleInputChange}
                  inputProps={{ step: '0.01', min: '0' }}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  fullWidth
                  label="महिना क्रमांक"
                  name="monthNo"
                  type="number"
                  value={formData.monthNo}
                  onChange={handleInputChange}
                  inputProps={{ min: '1', max: '12' }}
                  disabled={loading}
                />
              </Grid>
            </Grid>
            <StyledTextField
              fullWidth
              label="वर्ष क्रमांक"
              name="yearNo"
              type="number"
              value={formData.yearNo}
              onChange={handleInputChange}
              inputProps={{ min: new Date().getFullYear() }}
              disabled={loading}
            />
          </Box>
        );
      default:
        return 'अज्ञात स्टेप';
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledCard>
        <Typography variant="h4" align="center" sx={{ mb: 1, fontWeight: 700 }}>
          बचत गट तयार करा
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="textSecondary"
          sx={{ mb: 3 }}
        >
          आपला बचत गट नोंदणी करा आणि सुरुवात करा
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ minHeight: '350px', mb: 3 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            मागे
          </Button>
          <StyledButton
            variant="contained"
            onClick={handleNext}
            disabled={loading}
            sx={{ flex: 1 }}
            endIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'प्रक्रिया सुरू आहे...' : activeStep === steps.length - 1 ? 'नोंदणी पूर्ण करा' : 'पुढे'}
          </StyledButton>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            आधीपासूनच खाते आहे?{' '}
            <Link
              component="span"
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                color: '#667eea',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              येथे लॉगिन करा
            </Link>
          </Typography>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
};

export default Signup;
