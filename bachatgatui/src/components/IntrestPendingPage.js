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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import intrestTransactionService from '../services/intrestTransactionService';

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

export default function IntrestPendingPage() {
  const [intrestPending, setIntrestPending] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Popup states
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [pendingDetails, setPendingDetails] = React.useState([]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [paymentType, setPaymentType] = React.useState('');
  const [popupLoading, setPopupLoading] = React.useState(false);

  React.useEffect(() => {
    fetchIntrestPending();
  }, []);

  async function fetchIntrestPending() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await intrestTransactionService.getIntrestPendingBySGID(sgId);
      if (data && Array.isArray(data)) {
        setIntrestPending(data);
      }
    } catch (err) {
      console.error('Failed to fetch interest pending', err);
      setSnackbar({ open: true, message: 'व्याज प्रलंबित लोड करण्यात अयशस्वी', severity: 'त्रुटी' });
    } finally {
      setLoading(false);
    }
  }

  function handleIntrestDeposit(member) {
    console.log('Interest Deposit for:', member);
    setSelectedMember(member);
    setOpenPopup(true);
    fetchPendingDetails(member.memberId);
  }

  async function fetchPendingDetails(memberId) {
    setPopupLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await intrestTransactionService.getIntrestPendingByMemberID(sgId, memberId);
      if (data && Array.isArray(data)) {
        setPendingDetails(data);
        setSelectedRows(data.map((row) => row.itId));
        setPaymentType('Cash');
      }
    } catch (err) {
      console.error('Failed to fetch pending details', err);
      setSnackbar({ open: true, message: 'प्रलंबित तपशील लोड करण्यात अयशस्वी', severity: 'त्रुटी' });
    } finally {
      setPopupLoading(false);
    }
  }

  function handleCheckboxChange(itId) {
    setSelectedRows((prev) => {
      if (prev.includes(itId)) {
        return prev.filter((id) => id !== itId);
      } else {
        return [...prev, itId];
      }
    });
  }

  function handleSelectAll(event) {
    if (event.target.checked) {
      setSelectedRows(pendingDetails.map((row) => row.itId));
    } else {
      setSelectedRows([]);
    }
  }

  function calculateTotalAmount() {
    return pendingDetails
      .filter((row) => selectedRows.includes(row.itId))
      .reduce((sum, row) => sum + row.intrestPending, 0);
  }

  function handleClosePopup() {
    setOpenPopup(false);
    setSelectedMember(null);
    setPendingDetails([]);
    setSelectedRows([]);
    setPaymentType('');
  }

  async function handleSubmit() {
    if (selectedRows.length === 0) {
      setSnackbar({ open: true, message: 'कृपया किमान एक महिना निवडा', severity: 'warning' });
      return;
    }
    if (!paymentType) {
      setSnackbar({ open: true, message: 'कृपया पेमेंट प्रकार निवडा', severity: 'warning' });
      return;
    }

    setPopupLoading(true);
    try {
      // Prepare data for API
      const paymentTypeMap = { 'Cash': 1, 'Bank': 2 };
      const requestData = selectedRows.map((itId) => {
        const row = pendingDetails.find((r) => r.itId === itId);
        return {
          itId: itId,
          paymentType: paymentTypeMap[paymentType],
          depositIntrestAmount: row?.intrestPending || 0,
        };
      });

      await intrestTransactionService.UpdateIntrestTrasaction(requestData);
      
      setSnackbar({ open: true, message: 'पेमेंट यशस्वीरित्या सदर केले!', severity: 'success' });
      handleClosePopup();
      fetchIntrestPending(); // Refresh the main table
    } catch (err) {
      console.error('Failed to submit payment', err);
      setSnackbar({ open: true, message: 'पेमेंट सदर करण्यात अयशस्वी', severity: 'त्रुटी' });
    } finally {
      setPopupLoading(false);
    }
  }

  const filteredIntrestPending = React.useMemo(() => {
    return intrestPending.filter((member) => {
      const searchLower = searchTerm.toLowerCase();
      return member.memberName?.toLowerCase().includes(searchLower);
    });
  }, [intrestPending, searchTerm]);

  return (
    <StyledContainer>
      <HeaderCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              व्याज थकबाकी
            </Typography>
           
          </Box>
        </Box>
      </HeaderCard>

      <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <TextField
          size="small"
          placeholder="सदस्याच्या नावाने शोधा..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{ width: '100%' }}
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
                <TableCell>सदस्याचे नाव</TableCell>
                <TableCell align="center">महिन्यांची संख्या</TableCell>
                <TableCell align="right">व्याज प्रलंबित</TableCell>
                <TableCell align="center">कृती</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredIntrestPending.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'आपल्या शोधाशी कोणतेही सदस्य जुळत नाहीत.' : 'कोणतेही प्रलंबित व्याज आढळले नाही.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIntrestPending.map((member, index) => (
                  <StyledTableRow key={member.memberId}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {member.memberName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {member.noOfMonth}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="error.main" fontWeight={600}>
                        ₹{member.intrestPending?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="व्याज जमा करा">
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AccountBalanceWalletIcon />}
                          onClick={() => handleIntrestDeposit(member)}
                          sx={{
                            bgcolor: '#667eea',
                            '&:hover': {
                              bgcolor: '#5568d3',
                            },
                          }}
                        >
                          व्याज जमा
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

      {/* Interest Deposit Popup */}
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
              व्याज जमा
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          {selectedMember && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f7fa', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={600} color="primary">
                सदस्य: {selectedMember.memberName}
              </Typography>
            </Box>
          )}

          {popupLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#667eea' }}>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                          indeterminate={selectedRows.length > 0 && selectedRows.length < pendingDetails.length}
                          checked={pendingDetails.length > 0 && selectedRows.length === pendingDetails.length}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>महिन्याचे नाव</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 600 }}>व्याज प्रलंबित</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingDetails.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">कोणतेही प्रलंबित व्याज आढळले नाही</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingDetails.map((row) => (
                        <TableRow 
                          key={row.itId}
                          hover
                          sx={{ 
                            '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.08)' },
                            bgcolor: selectedRows.includes(row.itId) ? 'rgba(102, 126, 234, 0.05)' : 'inherit'
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.includes(row.itId)}
                              onChange={() => handleCheckboxChange(row.itId)}
                              sx={{ 
                                color: '#667eea', 
                                '&.Mui-checked': { color: '#667eea' } 
                              }}
                            />
                          </TableCell>
                          <TableCell>{row.monthName}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600} color="error.main">
                              ₹{row.intrestPending?.toLocaleString('en-IN') || 0}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  एकूण रक्कम: ₹{calculateTotalAmount().toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({selectedRows.length} {selectedRows.length === 1 ? 'महिना' : 'महिने'} निवडले)
                </Typography>
              </Box>

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
            disabled={popupLoading || selectedRows.length === 0 || !paymentType}
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
