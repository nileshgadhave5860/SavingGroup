import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Card,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  overflowX: 'auto',
  [theme.breakpoints.down('md')]: {
    '&::-webkit-scrollbar': {
      height: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#667eea',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#5568d3',
    },
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  '& th': {
    color: 'white',
    fontWeight: 700,
    fontSize: '0.875rem',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.08)',
    transition: 'background-color 0.3s ease',
  },
}));

const emptyForm = {
  monthId: 0,
  sgId: 0,
  monthName: '',
  monthNo: '',
  yearNo: '',
};

export default function MonthPage() {
  const [months, setMonths] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  React.useEffect(() => {
    fetchMonths();
  }, []);

  async function fetchMonths() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await monthService.getMonthBySGID(sgId);
      if (data && Array.isArray(data.months)) {
        setMonths(data.months);
      }
    } catch (err) {
      console.error('Failed to fetch months', err);
      setSnackbar({ open: true, message: 'महिने लोड करण्यात अयशस्वी', severity: 'त्रुटी' });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Get the last month from the list (first item as it's sorted desc)
    let nextMonthNo = 1;
    let nextYearNo = new Date().getFullYear();
    
    if (months.length > 0) {
      const lastMonth = months[0];
      nextMonthNo = lastMonth.monthNo + 1;
      nextYearNo = lastMonth.yearNo;
      
      // If month exceeds 12, roll over to January of next year
      if (nextMonthNo > 12) {
        nextMonthNo = 1;
        nextYearNo = lastMonth.yearNo + 1;
      }
    }
    
    setForm({
      ...emptyForm,
      sgId: user.sgId || 0,
      monthNo: nextMonthNo,
      yearNo: nextYearNo,
    });
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const payload = {
      sgId: user.sgId || form.sgId,
      newMonthNo: parseInt(form.monthNo) || 0,
      newYearNo: parseInt(form.yearNo) || 0,
    };

    try {
      await monthService.createMonth(payload);
      await fetchMonths();
      setOpenDialog(false);
      setSnackbar({ open: true, message: 'महिना यशस्वीरित्या तयार झाला', severity: 'success' });
    } catch (err) {
      console.error('Failed to create month', err);
      setSnackbar({ open: true, message: 'महिना तयार करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
    }
  }

  return (
    <StyledContainer>
      <HeaderCard>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h4" fontWeight={700}>
                महिना व्यवस्थापन
              </Typography>
             
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            महिना तयार करा
          </Button>
        </Box>
      </HeaderCard>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>महिन्याचे नाव</TableCell>
                <TableCell align="center">महिना क्रमांक</TableCell>
                <TableCell align="center">वर्ष क्रमांक</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {months.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      कोणतेही महिने आढळले नाहीत.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                months.map((month, index) => (
                  <StyledTableRow key={month.monthId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {month.monthName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {month.monthNo}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {month.yearNo}
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#667eea', color: 'white', fontWeight: 700 }}>
          महिना तयार करा
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            margin="dense"
            label="महिना क्रमांक *"
            type="number"
            value={form.monthNo}
            onChange={(e) => setForm((f) => ({ ...f, monthNo: e.target.value }))}
            fullWidth
            required
            inputProps={{ min: 1, max: 12 }}
          />
          
          <TextField
            margin="dense"
            label="वर्ष क्रमांक *"
            type="number"
            value={form.yearNo}
            onChange={(e) => setForm((f) => ({ ...f, yearNo: e.target.value }))}
            fullWidth
            required
            inputProps={{ min: 2000, max: 2100 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>रद्द करा</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#667eea' }}>
            सेव्ह करा
          </Button>
        </DialogActions>
      </Dialog>

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
