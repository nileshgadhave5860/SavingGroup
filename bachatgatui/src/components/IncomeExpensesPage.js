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
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Card,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import incomeExpensesService from '../services/incomeExpensesService';
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
  ieId: null,
  sgId: 0,
  monthId: 0,
  particulars: '',
  paymentType: 1,
  incomeExpensesType: 1,
  amount: 0,
};

export default function IncomeExpensesPage() {
  const [incomeExpenses, setIncomeExpenses] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteConfirm, setDeleteConfirm] = React.useState({ open: false, ieId: null });

  React.useEffect(() => {
    fetchIncomeExpenses();
  }, []);

  async function fetchIncomeExpenses() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await incomeExpensesService.getIncomeExpensesBySGID(sgId);
      if (data && Array.isArray(data)) {
        setIncomeExpenses(data);
      } else if (data && data.data && Array.isArray(data.data)) {
        setIncomeExpenses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch income/expenses', err);
      setSnackbar({ open: true, message: 'उत्पन्न/खर्च लोड करण्यात अयशस्वी', severity: 'त्रुटी' });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setForm({
      ...emptyForm,
      sgId: user.sgId || 1001,
      monthId: user.monthId || 0,
    });
    setOpenDialog(true);
  }

  function handleOpenEdit(item) {
    setForm({
      ieId: item.ieId,
      sgId: item.sgId,
      monthId: item.monthId,
      particulars: item.particulars,
      paymentType: item.paymentType,
      incomeExpensesType: item.income > 0 ? 1 : 2,
      amount: item.income > 0 ? item.income : item.expenses,
    });
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || parseInt(localStorage.getItem('sgId')) || 1001;
    const monthId = monthService.getCurrentMonthIdBySGID(sgId)|| 0;
    
    // Create income/expense entry
    if (!form.ieId) {
      const payload = {
        sgId: sgId,
        monthId: monthId,
        particulars: form.particulars,
        paymentType: parseInt(form.paymentType),
        incomeExpensesType: parseInt(form.incomeExpensesType),
        amount: parseFloat(form.amount),
      };
      
      try {
        const data = await incomeExpensesService.createIncomeExpense(payload);
        if (data && data.Success !== 'false') {
          setSnackbar({ open: true, message: data.Message || 'एंट्री यशस्वीरित्या तयार केली', severity: 'success' });
          setOpenDialog(false);
          fetchIncomeExpenses(); // Refresh the list
        } else {
          setSnackbar({ open: true, message: data.Message || 'एंट्री तयार करण्यात अयशस्वी', severity: 'त्रुटी' });
        }
      } catch (err) {
        console.error('Failed to create income/expense', err);
        setSnackbar({ open: true, message: 'एंट्री तयार करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
      }
    } else {
      // Update income/expense entry
      const payload = {
        ieId: form.ieId,
        particulars: form.particulars,
        amount: form.amount,
        incomeExpensesType: form.incomeExpensesType,
      };
      
      try {
        const data = await incomeExpensesService.updateIncomeExpense(payload);
        if (data && data.Success !== 'false') {
          setSnackbar({ open: true, message: data.Message || 'एंट्री यशस्वीरित्या अपडेट केली', severity: 'success' });
          setOpenDialog(false);
          fetchIncomeExpenses(); // Refresh the list
        } else {
          setSnackbar({ open: true, message: data.Message || 'एंट्री अपडेट करण्यात अयशस्वी', severity: 'त्रुटी' });
        }
      } catch (err) {
        console.error('Failed to update income/expense', err);
        setSnackbar({ open: true, message: 'एंट्री अपडेट करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
      }
    }
  }

  function handleOpenDeleteConfirm(ieId) {
    setDeleteConfirm({ open: true, ieId });
  }

  function handleCloseDeleteConfirm() {
    setDeleteConfirm({ open: false, ieId: null });
  }

  async function handleDelete() {
    const { ieId } = deleteConfirm;
    try {
      const data = await incomeExpensesService.deleteIncomeExpense(ieId);
      setSnackbar({ open: true, message: data?.Message || 'एंट्री यशस्वीरित्या डिलीट केली', severity: 'success' });
      handleCloseDeleteConfirm();
      fetchIncomeExpenses(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete income/expense', err);
      setSnackbar({ open: true, message: 'एंट्री डिलीट करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
    }
  }

  const filteredData = React.useMemo(() => {
    return incomeExpenses.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const particularsMatch = item.particulars?.toLowerCase().includes(searchLower);
      return particularsMatch;
    });
  }, [incomeExpenses, searchTerm]);

  const totals = React.useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        income: acc.income + (item.income || 0),
        expenses: acc.expenses + (item.expenses || 0),
      }),
      { income: 0, expenses: 0 }
    );
  }, [filteredData]);

  return (
    <StyledContainer>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#667eea', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 36 }} />
          उत्पन्न आणि खर्च
        </Typography>
      </Box>

      <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1, 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          justifyContent: 'space-between', 
          mb: 2 
        }}>
          <TextField
            size="small"
            placeholder="तपशीलांनुसार शोधा..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            sx={{ flex: 1, minWidth: 0 }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {searchTerm && (
              <Button
                size="small"
                onClick={() => setSearchTerm('')}
                sx={{ textTransform: 'none', display: { xs: 'none', sm: 'inline-flex' } }}
              >
                साफ करा
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon sx={{ display: { xs: 'none', sm: 'inline' } }} />}
              onClick={handleOpenCreate}
              sx={{
                bgcolor: '#667eea',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flex: { xs: 1, sm: 'initial' },
                '&:hover': {
                  bgcolor: '#5568d3',
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>एंट्री तयार करा</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>तयार करा</Box>
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-around' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">एकूण उत्पन्न</Typography>
            <Typography variant="h6" color="success.main" fontWeight={700}>
              ₹{totals.income.toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">एकूण खर्च</Typography>
            <Typography variant="h6" color="error.main" fontWeight={700}>
              ₹{totals.expenses.toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">निव्वळ</Typography>
            <Typography variant="h6" color={totals.income - totals.expenses >= 0 ? 'success.main' : 'error.main'} fontWeight={700}>
              ₹{(totals.income - totals.expenses).toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 800 }}>
            <StyledTableHead>
              <TableRow>
                <TableCell>महिना</TableCell>
                <TableCell>तपशील</TableCell>
                <TableCell align="right">उत्पन्न</TableCell>
                <TableCell align="right">खर्च</TableCell>
                <TableCell align="center">कृती</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'तुमच्या शोधाशी कोणतीही एंट्री जुळली नाही.' : 'कोणतीही एंट्री सापडली नाही.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, idx) => (
                  <StyledTableRow key={item.ieId ?? idx}>
                    <TableCell>{item.monthName || item.monthId || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {item.particulars}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        {item.income > 0 ? `₹${item.income.toLocaleString('en-IN')}` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="error.main" fontWeight={600}>
                        {item.expenses > 0 ? `₹${item.expenses.toLocaleString('en-IN')}` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="एंट्री संपादित करा">
                        <IconButton size="small" onClick={() => handleOpenEdit(item)} aria-label="edit" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="एंट्री डिलीट करा">
                        <IconButton size="small" onClick={() => handleOpenDeleteConfirm(item.ieId)} aria-label="delete" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#667eea', color: 'white', fontWeight: 700 }}>
          {form.ieId ? 'एंट्री संपादित करा' : 'एंट्री तयार करा'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            margin="dense"
            label="तपशील"
            value={form.particulars}
            onChange={(e) => setForm((f) => ({ ...f, particulars: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="रक्कम"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
            fullWidth
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>प्रकार</InputLabel>
            <Select
              value={form.incomeExpensesType}
              onChange={(e) => setForm((f) => ({ ...f, incomeExpensesType: e.target.value }))}
              label="प्रकार"
              required
            >
              <MenuItem value={1}>उत्पन्न</MenuItem>
              <MenuItem value={2}>खर्च</MenuItem>
            </Select>
          </FormControl>
          {!form.ieId && (
            <FormControl fullWidth margin="dense">
              <InputLabel>पेमेंट प्रकार</InputLabel>
              <Select
                value={form.paymentType}
                onChange={(e) => setForm((f) => ({ ...f, paymentType: e.target.value }))}
                label="पेमेंट प्रकार"
              >
                <MenuItem value={1}>रोख</MenuItem>
                <MenuItem value={2}>बँक</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>रद्द करा</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#667eea' }}>
            सेव्ह करा
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>डिलीट पुष्टी करा</DialogTitle>
        <DialogContent>
          <Typography>तुम्हाला खात्री आहे की तुम्ही ही एंट्री डिलीट करू इच्छिता?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>रद्द करा</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            डिलीट करा
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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
