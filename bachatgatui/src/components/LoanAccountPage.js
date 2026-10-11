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
  Card,
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import apiService from '../services/apiService';
import loanAccountService from '../services/loanAccountService';
import loanTransactionService from '../services/loanTransactionService';
import memberService from '../services/memberService';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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
  loanId: 0,
  sgId: 0,
  monthId: 0,
  memberId: '',
  memberName: '',
  paymentType: 1,
  loanAmount: 0,
  interestRate: 1,
  termInMonths: 0,
  monthlyInstallment: 0,
};

export default function LoanAccountPage() {
  const [loans, setLoans] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openRepaymentDialog, setOpenRepaymentDialog] = React.useState(false);
  const [selectedLoan, setSelectedLoan] = React.useState(null);
  const [repaymentAmount, setRepaymentAmount] = React.useState(0);
  const [repaymentPaymentType, setRepaymentPaymentType] = React.useState(1);
  const [openTransactionsDialog, setOpenTransactionsDialog] = React.useState(false);
  const [transactions, setTransactions] = React.useState([]);
  const [transactionsLoading, setTransactionsLoading] = React.useState(false);

  React.useEffect(() => {
    fetchLoans();
    fetchMembers();
  }, []);

  async function fetchLoans() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const response = await apiService.get(`LoansAccount/GetLoanAccounts/${sgId}`, {
        timeout: 30000, // 30 seconds timeout
      });
      console.log('Loan API Response:', response);
      const data = response;
      
      // Handle if data is directly an array
      if (Array.isArray(data)) {
        setLoans(data);
      } 
      // Handle if data is wrapped in an object with a loans/data property
      else if (data && data.loans && Array.isArray(data.loans)) {
        setLoans(data.loans);
      }
      // Handle if the response is empty or null
      else if (data === null || data === undefined) {
        setLoans([]);
      }
      // If none of the above, assume empty
      else {
        console.warn('Unexpected loan data format:', data);
        setLoans([]);
      }
    } catch (err) {
      console.error('Failed to fetch loans', err);
      let errorMessage = 'कर्जे लोड करण्यात अयशस्वी';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'विनंती कालबाह्य - सर्व्हर प्रतिसाद देण्यासाठी बराच वेळ घेत आहे';
      } else if (err.message?.includes('Network Error')) {
        errorMessage = 'नेटवर्क त्रुटी - API सर्व्हर चालू आहे का तपासा';
      } else if (err.response?.status) {
        errorMessage = `त्रुटी ${err.response.status}: ${err.response.statusText}`;
      }
      setSnackbar({ open: true, message: errorMessage, severity: 'त्रुटी' });
      setLoans([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMembers() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await loanAccountService.getLoanMembersBySGID(sgId);
      if (data && Array.isArray(data)) setMembers(data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  }

  const filteredLoans = React.useMemo(() => {
    return loans.filter((loan) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = loan.memberName?.toLowerCase().includes(searchLower);
      const loanIdMatch = loan.loanId?.toString().includes(searchTerm);
      return nameMatch || loanIdMatch;
    });
  }, [loans, searchTerm]);

  function handleOpenCreate() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setForm({
      ...emptyForm,
      sgId: user.sgId || 0,
      monthId: user.monthId || 0,
    });
    setOpenDialog(true);
  }

  function handleOpenEdit(loan) {
    setForm({ ...loan });
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setForm(emptyForm);
  }

  function handleLoanRepayment(loan) {
    console.log('Loan Repayment for:', loan);
    setSelectedLoan(loan);
    setRepaymentAmount(loan.monthlyInstallment || 0);
    setRepaymentPaymentType(1); // Default to Cash
    setOpenRepaymentDialog(true);
  }

  async function handleViewTransaction(loan) {
    console.log('View Transaction for:', loan);
    setSelectedLoan(loan);
    setOpenTransactionsDialog(true);
    setTransactionsLoading(true);
    try {
      const response = await loanTransactionService.getLoanTransactions(loan.loanId);
      console.log('Transactions response:', response);
      if (response && response.loanTrasactions) {
        setTransactions(response.loanTrasactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
      setSnackbar({ open: true, message: 'व्यवहार लोड करण्यात अयशस्वी', severity: 'त्रुटी' });
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }

  function handleCloseTransactionsDialog() {
    setOpenTransactionsDialog(false);
    setSelectedLoan(null);
    setTransactions([]);
  }

  async function handleDeleteTransaction(ltId) {
    if (!window.confirm('तुम्ही हा व्यवहार हटवू इच्छिता का?')) {
      return;
    }

    try {
      await loanTransactionService.deleteLoanTransaction(ltId);
      setSnackbar({ open: true, message: 'व्यवहार यशस्वीरित्या हटवला!', severity: 'success' });
      // Refresh transactions list
      if (selectedLoan) {
        handleViewTransaction(selectedLoan);
      }
      fetchLoans(); // Refresh loans list
    } catch (err) {
      console.error('Failed to delete transaction', err);
      setSnackbar({ open: true, message: 'व्यवहार हटवताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
    }
  }

  function handleCloseRepaymentDialog() {
    setOpenRepaymentDialog(false);
    setSelectedLoan(null);
    setRepaymentAmount(0);
    setRepaymentPaymentType(1);
  }

  async function handleRepaymentSubmit() {
    if (!selectedLoan) return;

    if (!repaymentAmount || repaymentAmount <= 0) {
      setSnackbar({ open: true, message: 'कृपया वैध परतावा रक्कम एंटर करा', severity: 'warning' });
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const repaymentData = {
        sgId: user.sgId || localStorage.getItem('sgId') || selectedLoan.sgId || 0,
        monthId: user.monthId || selectedLoan.monthId || 0,
        memberId: selectedLoan.memberId,
        loanId: selectedLoan.loanId,
        paymentType: repaymentPaymentType,
        repaidLoanAmount: parseFloat(repaymentAmount),
      };
      
      console.log('Processing repayment:', repaymentData);
      await loanTransactionService.createLoanTransaction(repaymentData);
      
      setSnackbar({ open: true, message: 'कर्ज परतावा यशस्वीरित्या सदर केला!', severity: 'success' });
      handleCloseRepaymentDialog();
      fetchLoans(); // Refresh the loans list
    } catch (err) {
      console.error('Failed to process repayment', err);
      setSnackbar({ open: true, message: 'परतावा प्रक्रिया करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
    }
  }

  function handleMemberChange(memberId) {
    const selectedMember = members.find(m => m.memberId === memberId);
    if (selectedMember) {
      setForm(f => ({
        ...f,
        memberId: memberId,
        memberName: selectedMember.memberName,
      }));
    }
  }

  async function handleSave() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const payload = {
      loanId: form.loanId || 0,
      sgId: user.sgId || form.sgId,
      monthId: user.monthId || form.monthId,
      memberId: form.memberId,
      memberName: form.memberName,
      paymentType: form.paymentType,
      loanAmount: parseFloat(form.loanAmount) || 0,
      interestRate: parseFloat(form.interestRate) || 1,
      termInMonths: parseInt(form.termInMonths) || 0,
      monthlyInstallment: parseFloat(form.monthlyInstallment) || 0,
    };

    try {
      if (!form.loanId) {
        // Create loan
        await apiService.post('LoansAccount/create', payload);
        await fetchLoans();
        await fetchMembers();
        setOpenDialog(false);
        setSnackbar({ open: true, message: 'कर्ज यशस्वीरित्या तयार केले', severity: 'success' });
      } else {
        // Update loan
        await apiService.put('LoansAccount/update', payload);
        await fetchLoans();
        await fetchMembers();
        setOpenDialog(false);
        setSnackbar({ open: true, message: 'कर्ज यशस्वीरित्या अपडेट केले', severity: 'success' });
      }
    } catch (err) {
      console.error('Failed to save loan', err);
      setSnackbar({ open: true, message: 'कर्ज सेव्ह करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
    }
  }

  return (
    <StyledContainer>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#667eea', display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccountBalanceWalletIcon sx={{ fontSize: 36 }} />
          कर्ज वाटप
        </Typography>
      </Box>

      <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <TextField
            size="small"
            placeholder="सदस्याच्या नावाने किंवा कर्ज आयडीने शोधा..."
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
                '&:hover': {
                  bgcolor: '#5568d3',
                },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>कर्ज तयार करा</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>तयार करा</Box>
            </Button>
          </Box>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table size="small" sx={{ minWidth: 1000 }}>
            <StyledTableHead>
              <TableRow>
                <TableCell>सदस्याचे नाव</TableCell>
                <TableCell align="right">कर्ज रक्कम</TableCell>
                <TableCell align="right">परतावा रक्कम</TableCell>
                <TableCell align="right">प्रलंबित रक्कम</TableCell>
                <TableCell align="right">व्याज दर (%)</TableCell>
                <TableCell align="right">कालावधी (महिने)</TableCell>
                <TableCell align="right">मासिक हप्ता</TableCell>
                <TableCell align="center">कृती</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'आपल्या शोधाशी कोणतेही कर्जे जुळत नाहीत.' : 'कोणतेही कर्जे आढळली नाहीत.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => (
                  <StyledTableRow key={loan.loanId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {loan.memberName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="primary" fontWeight={600}>
                        ₹{loan.loanAmount?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        ₹{loan.repaymentAmount?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="error.main" fontWeight={600}>
                        ₹{loan.pendingLoanAmount?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{loan.interestRate}%</TableCell>
                    <TableCell align="right">{loan.termInMonths}</TableCell>
                    <TableCell align="right">₹{loan.monthlyInstallment?.toLocaleString('en-IN') || 0}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="कर्ज संपादित करा">
                          <IconButton size="small" onClick={() => handleOpenEdit(loan)} aria-label="edit" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="कर्ज परतावा">
                          <IconButton 
                            size="small" 
                            onClick={() => handleLoanRepayment(loan)} 
                            aria-label="repayment" 
                            sx={{ color: '#10b981' }}
                          >
                            <PaymentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="व्यवहार पहा">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewTransaction(loan)} 
                            aria-label="view transaction" 
                            sx={{ color: '#f59e0b' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
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
          {form.loanId ? 'कर्ज संपादित करा' : 'कर्ज तयार करा'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, maxHeight: '600px', overflowY: 'auto' }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>सदस्य निवडा *</InputLabel>
            <Select
              value={form.memberId}
              onChange={(e) => handleMemberChange(e.target.value)}
              label="सदस्य निवडा *"
              required
              disabled={!!form.loanId}
            >
              <MenuItem value="">
                <em>सदस्य निवडा</em>
              </MenuItem>
              {members.map((member) => (
                <MenuItem key={member.memberId} value={member.memberId}>
                  {member.memberName} (आयडी: {member.memberId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {form.loanId && (
            <TextField
              margin="dense"
              label="सदस्याचे नाव"
              value={form.memberName}
              fullWidth
              disabled
              InputProps={{
                readOnly: true,
              }}
            />
          )}
          
          <TextField
            margin="dense"
            label="कर्ज रक्कम *"
            type="number"
            value={form.loanAmount}
            onChange={(e) => setForm((f) => ({ ...f, loanAmount: e.target.value }))}
            fullWidth
            required
          />
          
          <TextField
            margin="dense"
            label="व्याज दर (%) *"
            type="number"
            value={form.interestRate}
            onChange={(e) => setForm((f) => ({ ...f, interestRate: e.target.value }))}
            fullWidth
            required
          />
          
          <TextField
            margin="dense"
            label="कालावधी (महिन्यात) *"
            type="number"
            value={form.termInMonths}
            onChange={(e) => setForm((f) => ({ ...f, termInMonths: e.target.value }))}
            fullWidth
            required
          />
          
          <TextField
            margin="dense"
            label="मासिक हप्ता *"
            type="number"
            value={form.monthlyInstallment}
            onChange={(e) => setForm((f) => ({ ...f, monthlyInstallment: e.target.value }))}
            fullWidth
            required
          />
          
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>रद्द करा</Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#667eea' }}>
            सेव्ह करा
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loan Repayment Dialog */}
      <Dialog open={openRepaymentDialog} onClose={handleCloseRepaymentDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            <Typography variant="h6" fontWeight={700}>
              कर्ज परतावा
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedLoan && (
            <Box>
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 1 }}>
                  सदस्य: {selectedLoan.memberName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  कर्ज आयडी: #{selectedLoan.loanId}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  प्रलंबित कर्ज रक्कम
                </Typography>
                <Typography variant="h6" fontWeight={600} color="warning.main">
                  ₹{selectedLoan.pendingLoanAmount?.toLocaleString('en-IN') || 0}
                </Typography>
              </Box>

              <TextField
                margin="dense"
                label="परतावा रक्कम *"
                type="number"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
                fullWidth
                required
                helperText="मूलभूत: मासिक हप्ता"
              />

              <FormControl fullWidth margin="dense">
                <InputLabel>पेमेंट प्रकार</InputLabel>
                <Select
                  value={repaymentPaymentType}
                  onChange={(e) => setRepaymentPaymentType(e.target.value)}
                  label="पेमेंट प्रकार"
                >
                  <MenuItem value={1}>रोख</MenuItem>
                  <MenuItem value={2}>बँक</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseRepaymentDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            रद्द करा
          </Button>
          <Button
            onClick={handleRepaymentSubmit}
            variant="contained"
            sx={{
              bgcolor: '#10b981',
              '&:hover': { bgcolor: '#059669' },
              borderRadius: 2,
              px: 3,
            }}
          >
            पेमेंट सदर करा
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Transactions Dialog */}
      <Dialog open={openTransactionsDialog} onClose={handleCloseTransactionsDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f59e0b', color: 'white', fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VisibilityIcon />
            <Typography variant="h6" fontWeight={700}>
              कर्ज व्यवहार
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedLoan && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} color="primary">
                सदस्य: {selectedLoan.memberName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                कर्ज आयडी: #{selectedLoan.loanId}
              </Typography>
            </Box>
          )}

          {transactionsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f59e0b' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>व्यवहार आयडी</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>पेमेंट प्रकार</TableCell>
                    <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>परतावा रक्कम</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>तयार केलेली तारीख</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 600 }}>कृती</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        <Typography color="text.secondary">कोणतेही व्यवहार आढळले नाहीत</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow 
                        key={transaction.ltId}
                        hover
                        sx={{ '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.08)' } }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            #{transaction.ltId}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {transaction.trasactionId?.substring(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {transaction.paymentType === 1 ? 'रोख' : 'बँक'}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            ₹{transaction.repaidLoanAmount?.toLocaleString('en-IN') || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.createddate).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="व्यवहार हटवा">
                            <IconButton 
                              size="small" 
                              onClick={() => handleDeleteTransaction(transaction.ltId)}
                              sx={{ color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseTransactionsDialog} variant="outlined" sx={{ borderRadius: 2 }}>
            बंद करा
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
