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
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import latePaymentChargesService from '../services/latePaymentChargesService';

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

export default function LatePaymentPendingPage() {
  const [latePayments, setLatePayments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  
  // Popup states
  const [openPopup, setOpenPopup] = React.useState(false);
  const [selectedPayment, setSelectedPayment] = React.useState(null);
  const [depositAmount, setDepositAmount] = React.useState(0);
  const [popupLoading, setPopupLoading] = React.useState(false);

  React.useEffect(() => {
    fetchLatePaymentPending();
  }, []);

  async function fetchLatePaymentPending() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await latePaymentChargesService.getLatPaymentPendingChargesBySGID(sgId);
      if (data && Array.isArray(data)) {
        setLatePayments(data);
      }
    } catch (err) {
      console.error('Failed to fetch late payment pending', err);
      setSnackbar({ open: true, message: 'उशीरा पेमेंट प्रलंबित लोड करण्यात अयशस्वी', severity: 'त्रुटी' });
    } finally {
      setLoading(false);
    }
  }

  function handlePaymentDeposit(payment) {
    setSelectedPayment(payment);
    setDepositAmount(payment.charges - payment.chargesDeposit);
    setOpenPopup(true);
  }

  function handleClosePopup() {
    setOpenPopup(false);
    setSelectedPayment(null);
    setDepositAmount(0);
  }

  async function handleDelete(lpcId) {
    if (!window.confirm('तुम्हाला खात्री आहे की हे उशीरा पेमेंट शुल्क डिलीट करायचे आहे?')) {
      return;
    }

    try {
      await latePaymentChargesService.deleteLatePaymentCharge(lpcId);
      setSnackbar({ open: true, message: 'उशीरा पेमेंट शुल्क यशस्वीरित्या डिलीट केले', severity: 'success' });
      fetchLatePaymentPending();
    } catch (err) {
      console.error('Failed to delete late payment charge', err);
      setSnackbar({ open: true, message: 'उशीरा पेमेंट शुल्क डिलीट करण्यात अयशस्वी', severity: 'त्रुटी' });
    }
  }

  async function handleSubmitDeposit() {
    if (!depositAmount || depositAmount <= 0) {
      setSnackbar({ open: true, message: 'कृपया वैध रक्कम एंटर करा', severity: 'warning' });
      return;
    }

    setPopupLoading(true);
    try {
      const depositData = {
        lpcId: selectedPayment.lpcid,
        depositAmount: depositAmount,
      };
      
      await latePaymentChargesService.depositLatePaymentCharge(depositData);
      setSnackbar({ open: true, message: 'पेमेंट यशस्वीरित्या जमा केले', severity: 'success' });
      handleClosePopup();
      fetchLatePaymentPending();
    } catch (err) {
      console.error('जमा करण्यात अयशस्वी payment', err);
      setSnackbar({ open: true, message: 'जमा करण्यात अयशस्वी payment', severity: 'त्रुटी' });
    } finally {
      setPopupLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const totalPendingCharges = latePayments.reduce((sum, item) => sum + (item.charges - item.chargesDeposit), 0);

  return (
    <StyledContainer>
      <HeaderCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccessTimeIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              उशीरा पेमेंट शुल्क
            </Typography>
           
          </Box>
        </Box>
      </HeaderCard>

      <Card sx={{ borderRadius: 4, p: 3, mb: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#667eea' }}>
            एकूण प्रलंबित शुल्क: ₹{totalPendingCharges.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            onClick={fetchLatePaymentPending}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
            }}
          >
            रिफ्रेश करा
          </Button>
        </Box>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      ) : (
        <StyledTableContainer component={Paper}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>सदस्याचे नाव</TableCell>
                <TableCell>महिना</TableCell>
                <TableCell align="center">दिवसांची संख्या</TableCell>
                <TableCell align="right">प्रतिदिन शुल्क</TableCell>
                <TableCell align="right">एकूण शुल्क</TableCell>
                <TableCell align="right">जमा केलेले शुल्क</TableCell>
                <TableCell align="right">प्रलंबित रक्कम</TableCell>
                <TableCell align="center">कृती</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {latePayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      कोणतेही उशीरा पेमेंट शुल्क सापडले नाही
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                latePayments.map((payment) => (
                  <StyledTableRow key={payment.lpcid}>
                    <TableCell>{payment.memberName}</TableCell>
                    <TableCell>{payment.monthName}</TableCell>
                    <TableCell align="center">{payment.noOfDay}</TableCell>
                    <TableCell align="right">₹{payment.perDayCharges.toFixed(2)}</TableCell>
                    <TableCell align="right">₹{payment.charges.toFixed(2)}</TableCell>
                    <TableCell align="right">₹{payment.chargesDeposit.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: '#f44336' }}>
                      ₹{(payment.charges - payment.chargesDeposit).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="पेमेंट जमा">
                          <IconButton
                            color="primary"
                            onClick={() => handlePaymentDeposit(payment)}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #5568d3 0%, #653a8e 100%)',
                              },
                            }}
                          >
                            <PaymentIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="डिलीट करा">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(payment.lpcid)}
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              color: 'white',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
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

      {/* Payment Deposit Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaymentIcon />
            <Typography variant="h6">पेमेंट जमा</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {popupLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : selectedPayment ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="सदस्याचे नाव"
                value={selectedPayment.memberName}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="महिना"
                value={selectedPayment.monthName}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="एकूण शुल्क"
                value={selectedPayment.charges.toFixed(2)}
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
              <TextField
                label="आधीच जमा केलेले"
                value={selectedPayment.chargesDeposit.toFixed(2)}
                fullWidth
                InputProps={{
                  readOnly: true,
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
              />
              <TextField
                label="रक्कम"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                fullWidth
                required
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
                helperText={`प्रलंबित: ₹${(selectedPayment.charges - selectedPayment.chargesDeposit).toFixed(2)}`}
              />
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClosePopup} disabled={popupLoading}>
            रद्द करा
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitDeposit}
            disabled={popupLoading}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            पेमेंट सबमिट करा
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
