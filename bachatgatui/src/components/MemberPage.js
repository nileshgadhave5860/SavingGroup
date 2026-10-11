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
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import memberService from '../services/memberService';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  margin: 0,
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
  memberId: null,
  sgId: 0,
  fullName: '',
  address: '',
  mobileNo: '',
  email: '',
  password: '',
  totalSaving: 0,
  totalLoan: 0,
  deposit: 0,
  isActive: true,
  paymentType: 1,
  monthId: 0,
};

export default function MemberPage() {
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const sgId = user.sgId || localStorage.getItem('sgId') || 1001;
    try {
      const data = await memberService.getMembersBySGID(sgId);
      if (data && Array.isArray(data.members)) setMembers(data.members);
    } catch (err) {
      console.error('Failed to fetch members', err);
      setSnackbar({ open: true, message: 'सदस्य लोड करण्यात अयशस्वी', severity: 'त्रुटी' });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setForm({
      ...emptyForm,
      sgId: user.sgId || 0,
      monthId: user.monthId || 0,
    });
    setOpenDialog(true);
  }

  function handleOpenEdit(m) {
    setForm({ ...m });
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setForm(emptyForm);
  }

  async function handleSave() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Create member via API
    if (!form.memberId) {
      const payload = {
        sgId: user.sgId || form.sgId,
        fullName: form.fullName,
        address: form.address,
        mobileNo: form.mobileNo,
        email: form.email,
        password: form.password,
        paymentType: form.paymentType,
        deposit: form.deposit || 0,
        monthId: user.monthId || form.monthId,
      };
      
      try {
        const data = await memberService.createMember(payload);
        if (data && data.Success !== 'false') {
          setMembers((prev) => [
            ...prev,
            {
              memberId: data.MemberId || form.memberId,
              fullName: data.FullName || form.fullName,
              address: form.address,
              mobileNo: form.mobileNo,
              email: form.email,
              totalSaving: 0,
              totalLoan: 0,
              deposit: form.deposit || 0,
              isActive: true,
              paymentType: form.paymentType,
            },
          ]);
          setOpenDialog(false);
          setSnackbar({ open: true, message: data.Message || 'सदस्य यशस्वीरित्या तयार झाला', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: data.Message || 'सदस्य तयार करण्यात अयशस्वी', severity: 'त्रुटी' });
        }
      } catch (err) {
        console.error('Failed to create member', err);
        setSnackbar({ open: true, message: 'सदस्य तयार करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
      }
    } else {
      // Update member via API
      const payload = {
        memberId: form.memberId,
        fullName: form.fullName,
        address: form.address,
        mobileNo: form.mobileNo,
        email: form.email,
        password: form.password,
        paymentType: form.paymentType,
        deposit: form.deposit || 0,
        monthId: user.monthId || form.monthId,
      };
      
      try {
        const data = await memberService.updateMember(payload);
        if (data && data.Success !== 'false') {
          setMembers((prev) =>
            prev.map((m) =>
              m.memberId === form.memberId
                ? {
                    ...m,
                    fullName: form.fullName,
                    address: form.address,
                    mobileNo: form.mobileNo,
                    email: form.email,
                    paymentType: form.paymentType,
                    deposit: form.deposit || 0,
                  }
                : m
            )
          );
          setOpenDialog(false);
          setSnackbar({ open: true, message: data.Message || 'सदस्य यशस्वीरित्या अपडेट झाला', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: data.Message || 'सदस्य अपडेट करण्यात अयशस्वी', severity: 'त्रुटी' });
        }
      } catch (err) {
        console.error('Failed to update member', err);
        setSnackbar({ open: true, message: 'सदस्य अपडेट करताना त्रुटी: ' + err.message, severity: 'त्रुटी' });
      }
    }
  }

  const [togglingIds, setTogglingIds] = React.useState([]);

  const filteredMembers = React.useMemo(() => {
    return members.filter((m) => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = m.fullName?.toLowerCase().includes(searchLower);
      const mobileMatch = m.mobileNo?.includes(searchTerm);
      return nameMatch || mobileMatch;
    });
  }, [members, searchTerm]);

  async function toggleActive(member) {
    const memberId = member.memberId;
    const action = member.isActive ? 'deactivate' : 'activate';

    try {
      setTogglingIds((p) => [...p, memberId]);
      const data = await memberService.toggleMemberStatus(memberId, action);

      const newIsActive = data && typeof data.isActive !== 'undefined' ? !!data.isActive : !member.isActive;
      setMembers((prev) => prev.map((m) => (m.memberId === memberId ? { ...m, isActive: newIsActive } : m)));
      setSnackbar({ open: true, message: (data && (data.message || data.Message)) || 'सदस्य स्थिती अपडेट झाली', severity: 'success' });
    } catch (err) {
      console.error('Failed to toggle member active state', err);
      const serverMsg = err.response && err.response.data ? (err.response.data.message || err.response.data.Message || JSON.stringify(err.response.data)) : err.message;
      setSnackbar({ open: true, message: 'सदस्य टॉगल करताना त्रुटी: ' + serverMsg, severity: 'त्रुटी' });
    } finally {
      setTogglingIds((p) => p.filter((id) => id !== memberId));
    }
  }

  return (
    <StyledContainer>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ 
          color: '#667eea', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2,
          fontSize: { xs: '1.5rem', sm: '2.125rem' }
        }}>
          <PeopleIcon sx={{ fontSize: { xs: 28, sm: 36 } }} />
          सभासद
        </Typography>
      </Box>

      <Card sx={{ 
        mb: 3, 
        p: { xs: 1.5, sm: 2 }, 
        borderRadius: 3, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            size="small"
            placeholder="नाव किंवा मोबाइल नंबरने शोधा..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: { xs: 0.5, sm: 1 } }} />,
            }}
            sx={{ 
              flex: 1, 
              minWidth: 0,
              width: { xs: '100%', sm: 'auto' },
              '& .MuiInputBase-input': {
                fontSize: { xs: '0.875rem', sm: '1rem' },
              },
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexShrink: 0,
            width: { xs: '100%', sm: 'auto' }
          }}>
            {searchTerm && (
              <Button
                size="small"
                onClick={() => setSearchTerm('')}
                sx={{ 
                  textTransform: 'none', 
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
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
                flex: { xs: 1, sm: '0 0 auto' },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                padding: { xs: '6px 12px', sm: '6px 16px' },
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>सदस्य तयार करा</Box>
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
          <Table size="small" sx={{ minWidth: 800 }}>
            <StyledTableHead>
              <TableRow>
                <TableCell>सदस्य माहिती</TableCell>
                <TableCell align="right">एकूण बचत</TableCell>
                <TableCell align="right">एकूण कर्ज</TableCell>
                <TableCell align="right">ठेव</TableCell>
                <TableCell align="center">कृती</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {searchTerm ? 'आपल्या शोधाशी कोणतेही सदस्य जुळत नाहीत.' : 'कोणतेही सदस्य आढळले नाहीत.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((m, idx) => (
                  <StyledTableRow key={m.memberId ?? idx}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {m.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {m.mobileNo}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="success.main" fontWeight={600}>
                        ₹{m.totalSaving?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" color="error.main" fontWeight={600}>
                        ₹{m.totalLoan?.toLocaleString('en-IN') || 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">₹{m.deposit?.toLocaleString('en-IN') || 0}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="सदस्य संपादित करा">
                        <IconButton size="small" onClick={() => handleOpenEdit(m)} aria-label="edit" color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={m.isActive ? 'सदस्य निष्क्रिय करा' : 'सदस्य सक्रिय करा'}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => toggleActive(m)}
                            aria-label="toggle"
                            disabled={togglingIds.includes(m.memberId)}
                            color={m.isActive ? 'success' : 'default'}
                          >
                            {togglingIds.includes(m.memberId) ? (
                              <CircularProgress size={20} />
                            ) : m.isActive ? (
                              <ToggleOnIcon />
                            ) : (
                              <ToggleOffIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
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
          {form.memberId ? 'सदस्य संपादित करा' : 'सदस्य तयार करा'}
        </DialogTitle>
        <DialogContent sx={{ maxHeight: '600px', overflowY: 'auto' }}>
          <TextField
            margin="dense"
            label="पूर्ण नाव"
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            fullWidth
          />
          <TextField
            margin="dense"
            label="मोबाइल"
            value={form.mobileNo}
            onChange={(e) => setForm((f) => ({ ...f, mobileNo: e.target.value }))}
            fullWidth
          />
          <TextField
            margin="dense"
            label="पत्ता"
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            fullWidth
          />
          <TextField
            margin="dense"
            label="ईमेल"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            fullWidth
          />
          {!form.memberId && (
            <TextField
              margin="dense"
              label="पासवर्ड"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              fullWidth
            />
          )}
          {form.memberId && (
            <TextField
              margin="dense"
              label="पासवर्ड (सद्यस्थिती जतन करण्यासाठी रिकामे ठेवा)"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              fullWidth
            />
          )}
          <TextField
            margin="dense"
            label="ठेव"
            type="number"
            value={form.deposit}
            onChange={(e) => setForm((f) => ({ ...f, deposit: parseFloat(e.target.value) || 0 }))}
            fullWidth
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
