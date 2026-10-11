import React from 'react';
import {
  Box,
  Button,
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
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import memberService from '../services/memberService';
import savingTransactionService from '../services/savingTransactionService';
import intrestTransactionService from '../services/intrestTransactionService';
import loanAccountService from '../services/loanAccountService';
import latePaymentChargesService from '../services/latePaymentChargesService';
import monthService from '../services/monthService';
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 20,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  color: 'white',
  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: 12,
  },
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

export default function SavingDepositPage() {
  const [membersPending, setMembersPending] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Popup states
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [savingPendingDetails, setSavingPendingDetails] = React.useState([]);
  const [intrestPendingDetails, setIntrestPendingDetails] = React.useState([]);
  const [loanPendingDetails, setLoanPendingDetails] = React.useState([]);
  const [latePaymentPendingDetails, setLatePaymentPendingDetails] = React.useState([]);
  const [selectedSavingRows, setSelectedSavingRows] = React.useState([]);
  const [selectedIntrestRows, setSelectedIntrestRows] = React.useState([]);
  const [selectedLoanRows, setSelectedLoanRows] = React.useState([]);
  const [selectedLatePaymentRows, setSelectedLatePaymentRows] = React.useState([]);
  const [paymentType, setPaymentType] = React.useState('');
  const [emiAmount, setEmiAmount] = React.useState(0);
  const [popupLoading, setPopupLoading] = React.useState(false);

  React.useEffect(() => {
    fetchMembersPending();
  }, []);

  async function fetchMembersPending() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await memberService.GetMemberPendingDataBySGId(sgId);
      if (data && Array.isArray(data)) {
        // Filter members with any pending amount (saving, loan, or interest)
        const membersWithPending = data.filter(member => 
          member.savingPending > 0 || member.loanPending > 0 || member.intrestPending > 0
        );
        setMembersPending(membersWithPending);
      }
    } catch (err) {
      console.error('Failed to fetch members pending data', err);
      setSnackbar({ open: true, message: 'सदस्य डेटा लोड करण्यात अयशस्वी', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  function handleSavingDeposit(member) {
    console.log('Saving Deposit for:', member);
    setSelectedMember(member);
    setEmiAmount(member.emiAmount || 0);
    setOpenPopup(true);
    fetchPendingDetails(member.memberId);
  }

  async function fetchPendingDetails(memberId) {
    setPopupLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      // Fetch saving pending details
      try {
        const savingData = await savingTransactionService.getSavingPendingByMemberID(sgId, memberId);
        if (savingData && Array.isArray(savingData)) {
          setSavingPendingDetails(savingData);
          setSelectedSavingRows(savingData.map((row) => row.stId));
        } else {
          setSavingPendingDetails([]);
          setSelectedSavingRows([]);
        }
      } catch (savingErr) {
        console.error('Failed to fetch saving pending:', savingErr);
        setSavingPendingDetails([]);
        setSelectedSavingRows([]);
      }

      // Fetch interest pending details
      try {
        const intrestData = await intrestTransactionService.getIntrestPendingByMemberID(sgId, memberId);
        if (intrestData && Array.isArray(intrestData)) {
          setIntrestPendingDetails(intrestData);
          setSelectedIntrestRows(intrestData.map((row) => row.itId));
        } else {
          setIntrestPendingDetails([]);
          setSelectedIntrestRows([]);
        }
      } catch (intrestErr) {
        console.error('Failed to fetch interest pending:', intrestErr);
        setIntrestPendingDetails([]);
        setSelectedIntrestRows([]);
      }

      // Fetch loan pending details
      try {
        const loanData = await loanAccountService.getLoansBySGID(sgId);
        if (loanData && Array.isArray(loanData)) {
          // Filter loans for the specific member with pending amount
          const memberLoans = loanData.filter(loan => 
            loan.memberId === memberId && loan.loanPendingAmount > 0
          );
          setLoanPendingDetails(memberLoans);
          setSelectedLoanRows(memberLoans.map((loan) => loan.loanId));
        } else {
          setLoanPendingDetails([]);
          setSelectedLoanRows([]);
        }
      } catch (loanErr) {
        console.error('Failed to fetch loan pending:', loanErr);
        setLoanPendingDetails([]);
        setSelectedLoanRows([]);
      }

      // Fetch late payment pending details
      try {
        const latePaymentData = await latePaymentChargesService.getPendingLatePaymentChargesByMember(sgId, memberId);
        if (latePaymentData && Array.isArray(latePaymentData)) {
          setLatePaymentPendingDetails(latePaymentData);
          setSelectedLatePaymentRows(latePaymentData.map((row) => row.lpcId));
        } else {
          setLatePaymentPendingDetails([]);
          setSelectedLatePaymentRows([]);
        }
      } catch (latePaymentErr) {
        console.error('Failed to fetch late payment pending:', latePaymentErr);
        setLatePaymentPendingDetails([]);
        setSelectedLatePaymentRows([]);
      }

      setPaymentType('Cash');
    } catch (err) {
      console.error('Failed to fetch pending details', err);
      setSnackbar({ open: true, message: 'प्रलंबित तपशील लोड करण्यात अयशस्वी', severity: 'error' });
    } finally {
      setPopupLoading(false);
    }
  }

  function handleCheckboxChange(type, id) {
    if (type === 'saving') {
      setSelectedSavingRows((prev) => {
        if (prev.includes(id)) {
          return prev.filter((rowId) => rowId !== id);
        } else {
          return [...prev, id];
        }
      });
    } else if (type === 'intrest') {
      setSelectedIntrestRows((prev) => {
        if (prev.includes(id)) {
          return prev.filter((rowId) => rowId !== id);
        } else {
          return [...prev, id];
        }
      });
    } else if (type === 'loan') {
      setSelectedLoanRows((prev) => {
        if (prev.includes(id)) {
          return prev.filter((rowId) => rowId !== id);
        } else {
          return [...prev, id];
        }
      });
    } else if (type === 'latepayment') {
      setSelectedLatePaymentRows((prev) => {
        if (prev.includes(id)) {
          return prev.filter((rowId) => rowId !== id);
        } else {
          return [...prev, id];
        }
      });
    }
  }

  function handleSelectAll(type, event) {
    if (type === 'saving') {
      if (event.target.checked) {
        setSelectedSavingRows(savingPendingDetails.map((row) => row.stId));
      } else {
        setSelectedSavingRows([]);
      }
    } else if (type === 'intrest') {
      if (event.target.checked) {
        setSelectedIntrestRows(intrestPendingDetails.map((row) => row.itId));
      } else {
        setSelectedIntrestRows([]);
      }
    } else if (type === 'loan') {
      if (event.target.checked) {
        setSelectedLoanRows(loanPendingDetails.map((loan) => loan.loanId));
      } else {
        setSelectedLoanRows([]);
      }
    } else if (type === 'latepayment') {
      if (event.target.checked) {
        setSelectedLatePaymentRows(latePaymentPendingDetails.map((row) => row.lpcId));
      } else {
        setSelectedLatePaymentRows([]);
      }
    }
  }

  function calculateTotalAmount() {
    const savingTotal = savingPendingDetails
      .filter((row) => selectedSavingRows.includes(row.stId))
      .reduce((sum, row) => sum + row.savingPending, 0);
    
    const intrestTotal = intrestPendingDetails
      .filter((row) => selectedIntrestRows.includes(row.itId))
      .reduce((sum, row) => sum + row.intrestPending, 0);
    
    const loanTotal = loanPendingDetails
      .filter((loan) => selectedLoanRows.includes(loan.loanId))
      .reduce((sum, loan) => sum + (loan.monthlyInstallment || 0), 0);
    
    const latePaymentTotal = latePaymentPendingDetails
      .filter((row) => selectedLatePaymentRows.includes(row.lpcId))
      .reduce((sum, row) => sum + row.charges, 0);
    
    return savingTotal + intrestTotal + loanTotal + latePaymentTotal;
  }

  function handleClosePopup() {
    setOpenPopup(false);
    setSelectedMember(null);
    setSavingPendingDetails([]);
    setIntrestPendingDetails([]);
    setLoanPendingDetails([]);
    setLatePaymentPendingDetails([]);
    setSelectedSavingRows([]);
    setSelectedIntrestRows([]);
    setSelectedLoanRows([]);
    setSelectedLatePaymentRows([]);
    setPaymentType('');
    setEmiAmount(0);
  }

  async function handleSubmit() {
    if (selectedSavingRows.length === 0 && selectedIntrestRows.length === 0 && selectedLoanRows.length === 0 && selectedLatePaymentRows.length === 0) {
      setSnackbar({ open: true, message: 'कृपया किमान एक आयटम निवडा', severity: 'warning' });
      return;
    }
    if (!paymentType) {
      setSnackbar({ open: true, message: 'कृपया पेमेंट प्रकार निवडा', severity: 'warning' });
      return;
    }

    setPopupLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
     // const monthId = user.monthId || localStorage.getItem('monthId') || 1;
      const monthId = await monthService.getCurrentMonthIdBySGID(sgId);
      const paymentTypeMap = { 'Cash': 1, 'Bank': 2 };
      const paymentTypeValue = paymentTypeMap[paymentType];

      // Prepare data for PendingDeposit API
      const depositData = {
        sgId: sgId,
        memberId: selectedMember.memberId,
        monthId: monthId,
        stIds: selectedSavingRows,
        itId: selectedIntrestRows,
        lpcId: selectedLatePaymentRows,
        emiAmount: emiAmount || 0,
        paymentType: paymentTypeValue
      };

      console.log('Submitting deposit data:', depositData);
      const response = await savingTransactionService.PendingDeposit(depositData);
      console.log('Deposit response:', response);
      
      setSnackbar({ open: true, message: 'पेमेंट यशस्वीरित्या सदर केले!', severity: 'success' });
      handleClosePopup();
      fetchMembersPending(); // Refresh the main table
    } catch (err) {
      console.error('Failed to submit payment - Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      let errorMessage = 'पेमेंट सदर करण्यात अयशस्वी';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage += ': ' + err.message;
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setPopupLoading(false);
    }
  }

  const filteredMembersPending = React.useMemo(() => {
    return membersPending.filter((member) => {
      const searchLower = searchTerm.toLowerCase();
      return member.memberName?.toLowerCase().includes(searchLower);
    });
  }, [membersPending, searchTerm]);

  return (
    <StyledContainer>
      <HeaderCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SavingsIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              बचत जमा 
            </Typography>
           
          </Box>
        </Box>
      </HeaderCard>

      <Card sx={{ 
        mb: 3, 
        p: { xs: 1.5, sm: 2 }, 
        borderRadius: 3, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <TextField
          size="small"
          placeholder="सदस्याच्या नावाने शोधा..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: { xs: 0.5, sm: 1 } }} />,
          }}
          sx={{ 
            width: '100%',
            '& .MuiInputBase-input': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
            },
          }}
        />
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>सदस्याचे नाव</TableCell>
                <TableCell align="right" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>बचत प्रलंबित</TableCell>
                <TableCell align="right" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>कर्ज प्रलंबित</TableCell>
                <TableCell align="right" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>व्याज प्रलंबित</TableCell>
                <TableCell align="right" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>विलंब शुल्क</TableCell>
                <TableCell align="right" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>EMI रक्कम</TableCell>
                <TableCell align="center" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  padding: { xs: '8px 4px', sm: '16px' }
                }}>कृती</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredMembersPending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'आपल्या शोधाशी कोणतेही सदस्य जुळत नाहीत.' : 'कोणतीही प्रलंबित बचत आढळली नाही.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembersPending.map((member, index) => (
                  <StyledTableRow key={member.memberId}>
                    <TableCell sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <Typography variant="body2" fontWeight={600} sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        wordBreak: 'break-word'
                      }}>
                        {member.memberName}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <Typography variant="body2" color="error.main" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        ₹{member.savingPending?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <Typography variant="body2" color="warning.main" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        ₹{member.loanPending?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <Typography variant="body2" color="info.main" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        ₹{member.intrestPending?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <Typography variant="body2" color="secondary.main" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        ₹{member.lateFeesPendingAmount?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <Typography variant="body2" color="success.main" fontWeight={600} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        ₹{member.emiAmount?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ padding: { xs: '8px 4px', sm: '16px' } }}>
                      <Tooltip title="पेमेंट जमा करा">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AccountBalanceWalletIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                          onClick={() => handleSavingDeposit(member)}
                          disabled={member.savingPending === 0 && member.intrestPending === 0 && member.loanPending === 0}
                          sx={{
                            bgcolor: '#667eea',
                            '&:hover': {
                              bgcolor: '#5568d3',
                            },
                            fontSize: { xs: '0.7rem', sm: '0.875rem' },
                            padding: { xs: '4px 8px', sm: '6px 16px' },
                          }}
                        >
                          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>पेमेंट जमा</Box>
                          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>जमा</Box>
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      )}

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

      {/* Saving Deposit Popup */}
      <Dialog 
        open={openPopup} 
        onClose={handleClosePopup}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWalletIcon />
            <Typography variant="h6" fontWeight={700}>
              पेमेंट जमा (Payment Deposit)
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {/* Member Selection Dropdown */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>सदस्य निवडा (Select Member)</InputLabel>
            <Select
              value={selectedMember?.memberId || ''}
              label="सदस्य निवडा (Select Member)"
              onChange={(e) => {
                const newMember = membersPending.find(m => m.memberId === e.target.value);
                if (newMember) {
                  setSelectedMember(newMember);
                  setEmiAmount(newMember.emiAmount || 0);
                  fetchPendingDetails(newMember.memberId);
                }
              }}
            >
              {membersPending.map((member) => (
                <MenuItem key={member.memberId} value={member.memberId}>
                  {member.memberName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedMember && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} color="primary">
                सदस्य: {selectedMember.memberName}
              </Typography>
              <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                <Typography variant="body2" color="error.main" fontWeight={600}>
                  बचत प्रलंबित: ₹{selectedMember.savingPending?.toLocaleString('en-IN') || 0}
                </Typography>
                <Typography variant="body2" color="info.main" fontWeight={600}>
                  व्याज प्रलंबित: ₹{selectedMember.intrestPending?.toLocaleString('en-IN') || 0}
                </Typography>
                <Typography variant="body2" color="warning.main" fontWeight={600}>
                  कर्ज प्रलंबित: ₹{selectedMember.loanPending?.toLocaleString('en-IN') || 0}
                </Typography>
                <Typography variant="body2" color="secondary.main" fontWeight={600}>
                  दंड: ₹{selectedMember.lateFeesPendingAmount?.toLocaleString('en-IN') || 0}
                </Typography>
              </Box>
            </Box>
          )}

          {selectedMember && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} color="success.main">
                एकूण रक्कम: ₹{(calculateTotalAmount() + emiAmount).toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({selectedSavingRows.length + selectedIntrestRows.length + selectedLoanRows.length + selectedLatePaymentRows.length} आयटम निवडले + EMI)
              </Typography>
            </Box>
          )}

          {popupLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Saving Pending Table */}
              {savingPendingDetails.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#667eea' }}>
                    बचत प्रलंबित (Saving Pending)
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#667eea' }}>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                              indeterminate={selectedSavingRows.length > 0 && selectedSavingRows.length < savingPendingDetails.length}
                              checked={savingPendingDetails.length > 0 && selectedSavingRows.length === savingPendingDetails.length}
                              onChange={(e) => handleSelectAll('saving', e)}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>महिन्याचे नाव</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>बचत प्रलंबित</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {savingPendingDetails.map((row) => (
                          <TableRow 
                            key={row.stId}
                            hover
                            sx={{ 
                              '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.08)' },
                              bgcolor: selectedSavingRows.includes(row.stId) ? 'rgba(102, 126, 234, 0.05)' : 'inherit'
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedSavingRows.includes(row.stId)}
                                onChange={() => handleCheckboxChange('saving', row.stId)}
                                sx={{ 
                                  color: '#667eea', 
                                  '&.Mui-checked': { color: '#667eea' } 
                                }}
                              />
                            </TableCell>
                            <TableCell>{row.monthName}</TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600} color="error.main">
                                ₹{row.savingPending?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {/* Interest Pending Table */}
              {intrestPendingDetails.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, mt: 2, color: '#764ba2' }}>
                    व्याज प्रलंबित (Interest Pending)
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#764ba2' }}>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                              indeterminate={selectedIntrestRows.length > 0 && selectedIntrestRows.length < intrestPendingDetails.length}
                              checked={intrestPendingDetails.length > 0 && selectedIntrestRows.length === intrestPendingDetails.length}
                              onChange={(e) => handleSelectAll('intrest', e)}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>महिन्याचे नाव</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>व्याज प्रलंबित</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {intrestPendingDetails.map((row) => (
                          <TableRow 
                            key={row.itId}
                            hover
                            sx={{ 
                              '&:hover': { bgcolor: 'rgba(118, 75, 162, 0.08)' },
                              bgcolor: selectedIntrestRows.includes(row.itId) ? 'rgba(118, 75, 162, 0.05)' : 'inherit'
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedIntrestRows.includes(row.itId)}
                                onChange={() => handleCheckboxChange('intrest', row.itId)}
                                sx={{ 
                                  color: '#764ba2', 
                                  '&.Mui-checked': { color: '#764ba2' } 
                                }}
                              />
                            </TableCell>
                            <TableCell>{row.monthName}</TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600} color="info.main">
                                ₹{row.intrestPending?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {/* Loan Repayment Table */}
              {loanPendingDetails.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, mt: 2, color: '#f57c00' }}>
                    कर्ज हप्ता (Loan Repayment)
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f57c00' }}>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                              indeterminate={selectedLoanRows.length > 0 && selectedLoanRows.length < loanPendingDetails.length}
                              checked={loanPendingDetails.length > 0 && selectedLoanRows.length === loanPendingDetails.length}
                              onChange={(e) => handleSelectAll('loan', e)}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>कर्ज आयडी</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>मासिक हप्ता</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>एकूण प्रलंबित</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loanPendingDetails.map((loan) => (
                          <TableRow 
                            key={loan.loanId}
                            hover
                            sx={{ 
                              '&:hover': { bgcolor: 'rgba(245, 124, 0, 0.08)' },
                              bgcolor: selectedLoanRows.includes(loan.loanId) ? 'rgba(245, 124, 0, 0.05)' : 'inherit'
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedLoanRows.includes(loan.loanId)}
                                onChange={() => handleCheckboxChange('loan', loan.loanId)}
                                sx={{ 
                                  color: '#f57c00', 
                                  '&.Mui-checked': { color: '#f57c00' } 
                                }}
                              />
                            </TableCell>
                            <TableCell>#{loan.loanId}</TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600} color="warning.main">
                                ₹{loan.monthlyInstallment?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600} color="error.main">
                                ₹{loan.loanPendingAmount?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {/* Late Payment Charges Table */}
              {latePaymentPendingDetails.length > 0 && (
                <>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, mt: 2, color: '#d32f2f' }}>
                    दंड शुल्क (Late Payment Charges)
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#d32f2f' }}>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                              indeterminate={selectedLatePaymentRows.length > 0 && selectedLatePaymentRows.length < latePaymentPendingDetails.length}
                              checked={latePaymentPendingDetails.length > 0 && selectedLatePaymentRows.length === latePaymentPendingDetails.length}
                              onChange={(e) => handleSelectAll('latepayment', e)}
                            />
                          </TableCell>
                          <TableCell sx={{ color: 'white', fontWeight: 600 }}>महिन्याचे नाव</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>दिवस</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>दररोज शुल्क</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>एकूण शुल्क</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {latePaymentPendingDetails.map((row) => (
                          <TableRow 
                            key={row.lpcId}
                            hover
                            sx={{ 
                              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' },
                              bgcolor: selectedLatePaymentRows.includes(row.lpcId) ? 'rgba(211, 47, 47, 0.05)' : 'inherit'
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedLatePaymentRows.includes(row.lpcId)}
                                onChange={() => handleCheckboxChange('latepayment', row.lpcId)}
                                sx={{ 
                                  color: '#d32f2f', 
                                  '&.Mui-checked': { color: '#d32f2f' } 
                                }}
                              />
                            </TableCell>
                            <TableCell>{row.monthName}</TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600}>
                                {row.noOfDay}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600}>
                                ₹{row.perDayCharges?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography fontWeight={600} color="error.main">
                                ₹{row.charges?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {savingPendingDetails.length === 0 && intrestPendingDetails.length === 0 && loanPendingDetails.length === 0 && latePaymentPendingDetails.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">कोणतेही प्रलंबित व्यवहार आढळले नाहीत</Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              {selectedMember && selectedMember.loanPending > 0 && (
                <TextField
                  fullWidth
                  label="EMI रक्कम (EMI Amount)"
                  type="number"
                  value={emiAmount}
                  onChange={(e) => setEmiAmount(Number(e.target.value))}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>पेमेंट प्रकार</InputLabel>
                <Select
                  value={paymentType}
                  label="पेमेंट प्रकार"
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <MenuItem value="Cash">रोख</MenuItem>
                  <MenuItem value="Bank">बँक</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleClosePopup}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            रद्द करा
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={popupLoading || (selectedSavingRows.length === 0 && selectedIntrestRows.length === 0 && selectedLoanRows.length === 0 && selectedLatePaymentRows.length === 0) || !paymentType}
            sx={{
              bgcolor: '#667eea',
              '&:hover': { bgcolor: '#5568d3' },
              borderRadius: 2,
              px: 3,
            }}
          >
            पेमेंट सदर करा
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
}
