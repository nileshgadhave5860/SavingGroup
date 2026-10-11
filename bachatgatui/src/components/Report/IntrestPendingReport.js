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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2pdf from 'html2pdf.js';
import reportService from '../../services/reportService';

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

export default function IntrestPendingReport() {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const pdfRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await reportService.getIntrestPendingReport();
        const data = response || [];
          
        setReportData(data);
      } catch (error) {
        console.error('Error fetching interest pending report:', error);
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Failed to fetch report',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculateTotalPending = () => {
    return reportData.reduce((sum, item) => sum + (item.intrestPending || 0), 0);
  };

  const handleExportPDF = () => {
    try {
      const element = pdfRef.current;
      
      // Determine orientation based on screen size
      const isSmallScreen = window.innerWidth < 600;
      
      const opt = {
        margin: isSmallScreen ? 5 : 10,
        filename: 'Interest_Pending_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: isSmallScreen ? 1.5 : 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
                व्याज भरणा बाकी अहवाल
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
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
      </HeaderCard>

      <div ref={pdfRef}>
        {/* PDF Header - Only visible in PDF */}
        <Box sx={{ 
          mb: 3, 
          textAlign: 'center', 
          borderBottom: '2px solid #667eea', 
          pb: 2,
          px: { xs: 2, sm: 0 }
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: '#667eea', 
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2.125rem' }
          }}>
            व्याज भरणा बाकी अहवाल
          </Typography>
          <Typography variant="body2" sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}>
            दिनांक: {new Date().toLocaleDateString('mr-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

      {/* Table Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress size={60} />
          </Box>
        ) : reportData.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              कोणतीही बाकी नाही
            </Typography>
          </Box>
        ) : (
          <StyledTableContainer component={Paper} elevation={0} sx={{ bgcolor: 'white' }}>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell sx={{ 
                    minWidth: { xs: 120, sm: 200 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '8px 4px', sm: '16px' }
                  }}>
                    सभासदाचे नाव
                  </TableCell>
                  <TableCell sx={{ 
                    minWidth: { xs: 80, sm: 150 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '8px 4px', sm: '16px' }
                  }}>
                    बाकी महिने
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    minWidth: { xs: 80, sm: 120 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '8px 4px', sm: '16px' }
                  }}>
                    व्याज बाकी (₹)
                  </TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {reportData.map((row, index) => (
                  <StyledTableRow key={index}>
                    <TableCell sx={{ 
                      padding: { xs: '8px 4px', sm: '16px' }
                    }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        wordBreak: 'break-word'
                      }}>
                        {row.memberName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ 
                      padding: { xs: '8px 4px', sm: '16px' }
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: 'text.secondary',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}>
                        {row.pendingMonths}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      padding: { xs: '8px 4px', sm: '16px' }
                    }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: row.intrestPending > 0 ? '#f44336' : '#4caf50',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' }
                        }}
                      >
                        ₹{row.intrestPending?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                  </StyledTableRow>
                ))}
                {/* Total Row */}
                <TableRow sx={{ bgcolor: '#f3f4f6', borderTop: '2px solid #667eea' }}>
                  <TableCell colSpan={2} align="right" sx={{ 
                    padding: { xs: '8px 4px', sm: '16px' }
                  }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 700, 
                      fontSize: { xs: '0.875rem', sm: '1.1rem' }
                    }}>
                      एकूण / Total:
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ 
                    padding: { xs: '8px 4px', sm: '16px' }
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '0.875rem', sm: '1.1rem' },
                        color: '#667eea',
                      }}
                    >
                      ₹{calculateTotalPending().toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </StyledTableContainer>
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
