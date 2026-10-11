import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
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
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2pdf from 'html2pdf.js';
import reportService from '../../services/reportService';
import monthService from '../../services/monthService';
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
  backgroundColor: '#667eea',
  '& th': {
    color: 'white',
    fontWeight: 700,
    fontSize: '0.875rem',
    borderBottom: '2px solid #5568d3',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: 'white',
  '&:nth-of-type(even)': {
    backgroundColor: '#f9fafb',
  },
  '& td': {
    borderBottom: '1px solid #e5e7eb',
  },
}));

export default function MonthDepositReport() {
  const [reportData, setReportData] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonthName, setSelectedMonthName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const pdfRef = useRef();

  useEffect(() => {
    fetchMonths();
  }, []);

  const fetchMonths = async () => {
    try {
      const response = await reportService.getMonths();
      const data = response || [];
      setMonths(data);
      
      // Auto-select last month (current month) if available
      if (data.length > 0) {
        const lastMonth = data[data.length - 1];
        setSelectedMonth(lastMonth.monthId);
        setSelectedMonthName(lastMonth.monthName);
        fetchReportData(lastMonth.monthId);
      }
    } catch (error) {
      console.error('Error fetching months:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to fetch months',
        severity: 'error',
      });
    }
  };

  const fetchReportData = async (monthId) => {
    if (!monthId) return;
    
    setLoading(true);
    try {
      const response = await reportService.getMonthDepositReport(monthId);
      const data = response || [];
      setReportData(data);
    } catch (error) {
      console.error('Error fetching month deposit report:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to fetch report',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (event) => {
    const monthId = event.target.value;
    const month = months.find(m => m.monthId === monthId);
    
    setSelectedMonth(monthId);
    setSelectedMonthName(month?.monthName || '');
    fetchReportData(monthId);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateTotalSavingDeposit = () => {
    return reportData.reduce((sum, item) => sum + (item.savingDeposit || 0), 0);
  };

  const calculateTotalLoanDeposit = () => {
    return reportData.reduce((sum, item) => sum + (item.loanDeposit || 0), 0);
  };

  const calculateTotalIntrestDeposit = () => {
    return reportData.reduce((sum, item) => sum + (item.intrestDeposit || 0), 0);
  };

  const calculateTotalLatePaymentDeposit = () => {
    return reportData.reduce((sum, item) => sum + (item.latePaymentDeposit || 0), 0);
  };

  const handleExportPDF = () => {
    try {
      const element = pdfRef.current;
      
      const opt = {
        margin: 10,
        filename: `Month_Deposit_Report_${selectedMonthName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };
      
      html2pdf().set(opt).from(element).save().then(() => {
        setSnackbar({
          open: true,
          message: 'PDF downloaded successfully!',
          severity: 'success',
        });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({
        open: true,
        message: 'Failed to generate PDF: ' + error.message,
        severity: 'error',
      });
    }
  };

  return (
    <StyledContainer>
      {/* Header Section */}
      <HeaderCard>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }, 
          justifyContent: 'space-between', 
          gap: 2 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssessmentIcon sx={{ fontSize: { xs: 36, sm: 48 } }} />
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '2.125rem' }
              }}>
                Month Deposit Report
              </Typography>
            </Box>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2, 
            alignItems: { xs: 'stretch', sm: 'center' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <FormControl sx={{ 
              minWidth: { xs: '100%', sm: 150 }, 
              bgcolor: 'white', 
              borderRadius: 2 
            }}>
              <InputLabel>महिना निवडा / Select Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                label="महिना निवडा / Select Month"
              >
                {months.map((month) => (
                  <MenuItem key={month.monthId} value={month.monthId}>
                    {month.monthName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon sx={{ display: { xs: 'none', sm: 'inline' } }} />}
              onClick={handleExportPDF}
              disabled={!selectedMonth || reportData.length === 0}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Export PDF
            </Button>
          </Box>
        </Box>
      </HeaderCard>

      <div ref={pdfRef}>
        {/* PDF Header - Only visible in PDF */}
        <Box sx={{ 
          mb: 3, 
          textAlign: 'center', 
          borderBottom: '2px solid #667eea', 
          pb: 2,
          display: 'none',
          '@media print': {
            display: 'block'
          }
        }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 1 }}>
            महिन्याचा जमा अहवाल- {selectedMonthName}
          </Typography>
          
        </Box>

      {/* Table Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : !selectedMonth ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              कृपया महिना निवडा
            </Typography>
          </Box>
        ) : reportData.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              कोणताही डेटा नाही
            </Typography>
          </Box>
        ) : (
          <>
            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {reportData.map((row, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    bgcolor: index % 2 === 0 ? 'white' : '#f9fafb',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#667eea' }}>
                    {row.memberName}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>बचत जमा</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#4caf50' }}>
                      ₹{row.savingDeposit?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>कर्ज जमा</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2196f3' }}>
                      ₹{row.loanDeposit?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>व्याज जमा</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#ff9800' }}>
                      ₹{row.intrestDeposit?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>दंड जमा</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#9c27b0' }}>
                      ₹{row.latePaymentDeposit?.toLocaleString() || 0}
                    </Typography>
                  </Box>
                </Card>
              ))}
              
              {/* Mobile Total Card */}
              <Card
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: '#667eea',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>एकूण / Total</Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2">बचत जमा</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ₹{calculateTotalSavingDeposit().toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2">कर्ज जमा</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ₹{calculateTotalLoanDeposit().toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2">व्याज जमा</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ₹{calculateTotalIntrestDeposit().toLocaleString()}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">दंड जमा</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ₹{calculateTotalLatePaymentDeposit().toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            </Box>

            {/* Desktop Table View */}
            <StyledTableContainer component={Paper} elevation={0} sx={{ bgcolor: 'white', display: { xs: 'none', md: 'block' } }}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell sx={{ 
                      minWidth: 200,
                      fontSize: '0.875rem',
                      padding: '16px'
                    }}>
                      सभासदाचे नाव
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      minWidth: 120,
                      fontSize: '0.875rem',
                      padding: '16px'
                    }}>
                      बचत जमा (₹)
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      minWidth: 120,
                      fontSize: '0.875rem',
                      padding: '16px'
                    }}>
                      कर्ज जमा (₹)
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      minWidth: 120,
                      fontSize: '0.875rem',
                      padding: '16px'
                    }}>
                      व्याज जमा (₹)
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      minWidth: 120,
                      fontSize: '0.875rem',
                      padding: '16px'
                    }}>
                      दंड जमा (₹)
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {reportData.map((row, index) => (
                    <StyledTableRow key={index}>
                      <TableCell sx={{ padding: '16px' }}>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          wordBreak: 'break-word'
                        }}>
                          {row.memberName}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ padding: '16px' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: '#4caf50',
                            fontSize: '0.875rem'
                          }}
                        >
                          ₹{row.savingDeposit?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ padding: '16px' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: '#2196f3',
                            fontSize: '0.875rem'
                          }}
                        >
                          ₹{row.loanDeposit?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ padding: '16px' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: '#ff9800',
                            fontSize: '0.875rem'
                          }}
                        >
                          ₹{row.intrestDeposit?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ padding: '16px' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: '#9c27b0',
                            fontSize: '0.875rem'
                          }}
                        >
                          ₹{row.latePaymentDeposit?.toLocaleString() || 0}
                        </Typography>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                  {/* Total Row */}
                  <TableRow sx={{ bgcolor: '#f3f4f6', borderTop: '2px solid #667eea' }}>
                    <TableCell colSpan={1} align="right" sx={{ padding: '16px' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
                        एकूण / Total:
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#4caf50',
                        }}
                      >
                        ₹{calculateTotalSavingDeposit().toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#2196f3',
                        }}
                      >
                        ₹{calculateTotalLoanDeposit().toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#ff9800',
                        }}
                      >
                        ₹{calculateTotalIntrestDeposit().toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ padding: '16px' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#9c27b0',
                        }}
                      >
                        ₹{calculateTotalLatePaymentDeposit().toLocaleString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </StyledTableContainer>
          </>
        )}
      </div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
}
