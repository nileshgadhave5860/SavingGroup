import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import bankService from '../services/bankService';
import monthService from '../services/monthService';
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 20,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  color: 'white',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
}));

const FormCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  maxWidth: 600,
  margin: '0 auto',
}));

export default function BankDepositPage() {
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  async function handleSubmit(e) {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setSnackbar({ open: true, message: 'कृपया वैध रक्कम एंटर करा.', severity: 'चेतावणी' });
      return;
    }

    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    const monthId =await monthService.getCurrentMonthIdBySGID(sgId) || 0;

    try {
      const data = {
        sgId: sgId,
        monthId: monthId,
        amount: parseFloat(amount),
      };

      await bankService.bankDeposit(data);
      setSnackbar({ open: true, message: 'बँक ठेव यशस्वीरित्या सबमिट केली!', severity: 'यशस्वी' });
      setAmount('');
    } catch (err) {
      console.error('जमा करण्यात अयशस्वी', err);
      setSnackbar({ open: true, message: 'ठेव प्रक्रिया करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <StyledContainer>
      <HeaderCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalanceIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              बँक खात्यात पैसे जमा करा
            </Typography>
            
          </Box>
        </Box>
      </HeaderCard>

      <FormCard>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 3 }}>
            ठेव तपशील
          </Typography>

          <TextField
            label="रक्कम *"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
            }}
            helperText="बँक खात्यात जमा करण्यासाठी रक्कम एंटर करा"
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setAmount('')}
              disabled={loading}
            >
              साफ करा
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                px: 4,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'ठेव सबमिट करा'}
            </Button>
          </Box>
        </form>
      </FormCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
}
