import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Chip,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import savingGroupService from '../services/savingGroupService';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningIcon from '@mui/icons-material/Warning';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  background: '#f5f5f5',
  paddingTop: theme.spacing(2),
  maxWidth: '1400px !important',
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(2.5),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const StatCard = styled(Card)(({ theme, bgColor }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 12,
  background: bgColor || '#fff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '130px',
  maxHeight: '130px',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minHeight: '120px',
    maxHeight: '120px',
    borderRadius: 8,
  },
}));


const SavingGroupDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  // Parse user data once and memoize
  const user = React.useMemo(() => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }, []);

  const sgId = localStorage.getItem('sgId') || user.sgId || 1001;

  useEffect(() => {
    // Prevent multiple calls (especially in React StrictMode during development)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard data for sgId:', sgId);
        const response = await savingGroupService.getDashboardData(sgId);
        console.log('Dashboard data received:', response);
        setDashboardData(response);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'डॅशबोर्ड डेटा मिळवण्यात अयशस्वी');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [sgId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      hasFetchedRef.current = false; // Reset for manual retry
      const response = await savingGroupService.getDashboardData(sgId);
      setDashboardData(response);
      hasFetchedRef.current = true;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'डॅशबोर्ड डेटा मिळवण्यात अयशस्वी');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (v) => (v === null || v === undefined ? '0' : Number(v).toLocaleString());

  if (loading) {
    return (
      <StyledContainer maxWidth={false} disableGutters>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth={false} disableGutters>
        <Box p={3}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchDashboardData} sx={{ mt: 2 }}>
            पुन्हा प्रयत्न करा
          </Button>
        </Box>
      </StyledContainer>
    );
  }

  if (!dashboardData) {
    return (
      <StyledContainer maxWidth={false} disableGutters>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} />
        </Box>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth={false} disableGutters>
      {/* Header Section */}
      <Box textAlign="center" mb={{ xs: 1.5, sm: 2.5 }} px={{ xs: 0, sm: 0 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#555', 
            fontSize: { xs: '0.95rem', sm: '1.25rem', md: '1.5rem' },
            fontWeight: 600,
          }}
        >
          बचत गट अँप स्वागत आहे
        </Typography>
      </Box>

      {/* Key Metrics Section */}
     
     
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>


       <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex', width: '100%' }}>
          <StatCard bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    lineHeight: 1.2,
                  }}
                >
                  SGID
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#fff', 
                    mt: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                    wordBreak: 'break-word',
                    lineHeight: 1.1,
                    minWidth: '90px',
                  }}
                >
                {sgId}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.85,
                    mt: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    lineHeight: 1.3,
                  }}
                >
                  {dashboardData?.sgName || 'बचत गट'}
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>



        <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    lineHeight: 1.2,
                  }}
                >
                  एकूण सदस्य
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#fff', 
                    mt: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                    wordBreak: 'break-word',
                    lineHeight: 1.1,
                    minWidth: '90px',
                  }}
                >
                  {fmt(dashboardData?.totalMembers)}
                </Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    lineHeight: 1.2,
                  }}
                >
                  एकूण बचत
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#fff', 
                    mt: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                    wordBreak: 'break-word',
                    lineHeight: 1.1,
                    minWidth: '90px',
                  }}
                >
                  ₹{fmt(dashboardData?.totalSavings)}
                </Typography>
              </Box>
              <AccountBalanceWalletIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    opacity: 0.9,
                    fontSize: { xs: '0.7rem', sm: '0.875rem' },
                    lineHeight: 1.2,
                  }}
                >
                  एकूण कर्ज
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#fff', 
                    mt: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                    wordBreak: 'break-word',
                    lineHeight: 1.1,
                    minWidth: '90px',
                  }}
                >
                  ₹{fmt(dashboardData?.totalLoans)}
                </Typography>
              </Box>
              <MoneyOffIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                  व्याज मिळणे
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, wordBreak: 'break-word', lineHeight: 1.1, minWidth: '90px' }}>
                  ₹{fmt(dashboardData?.totalInterestEarned)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>


<Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #af7b44ff 0%, #38f9d7 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                   एकूण उत्पन्न
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, wordBreak: 'break-word', lineHeight: 1.1, minWidth: '90px' }}>
                   ₹{fmt(dashboardData?.totalIncome)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #e2121cff 0%, #38f9d7 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                   एकूण खर्ज
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, wordBreak: 'break-word', lineHeight: 1.1, minWidth: '90px' }}>
                   ₹{fmt(dashboardData?.totalExpenses)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>
 <Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #844b56ff 0%, #38f9d7 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                    दंड जमा
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, wordBreak: 'break-word', lineHeight: 1.1, minWidth: '90px' }}>
                    ₹{fmt(dashboardData?.totalLateFeesCollected)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>

<Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #444bafff 0%, #38f9d7 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                  बचत शिल्लक
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, wordBreak: 'break-word', lineHeight: 1.1, minWidth: '90px' }}>
                  ₹{fmt(dashboardData?.savingsBalance)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>

<Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #af7b44ff 0%, #38f9d7 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                   रोख शिल्लक
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, wordBreak: 'break-word', lineHeight: 1.1, minWidth: '90px' }}>
                   ₹{fmt(dashboardData?.cashBalance)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>


<Grid item xs={6} sm={6} md={3} sx={{ display: 'flex' }}>
          <StatCard bgColor="linear-gradient(135deg, #af7b44ff 0%, #38f9d7 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ flex: 1, minWidth: 0, pr: { xs: 0.5, sm: 1 } }}>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9, fontSize: { xs: '0.7rem', sm: '0.875rem' }, lineHeight: 1.2 }}>
                   बँक शिल्लक
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: { xs: 0.5, sm: 1 }, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, wordBreak: 'break-word', lineHeight: 1.1, minWidth: '90px' }}>
                   ₹{fmt(dashboardData?.bankBalance)}
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 48 }, color: '#fff', opacity: 0.3, flexShrink: 0 }} />
            </Box>
          </StatCard>
        </Grid>



      </Grid>
      </Box>


      <Grid container spacing={{ xs: 2, sm: 2 }} mt={{ xs: 1, sm: 1.5 }} mb={{ xs: 1.5, sm: 2 }}>
        <Grid item xs={12} md={12}>
          <StyledCard>
            <Typography 
              variant="h6" 
              fontWeight={600} 
              mb={2}
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              पेमेंट स्थिती तपशील
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'warning.lighter', borderRadius: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    mb={1}
                    sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                  >
                    <WarningIcon sx={{ fontSize: { xs: 16, sm: 16 }, mr: 0.5, verticalAlign: 'middle', color: 'warning.main' }} />
                    बचत प्रलंबित
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight={600} 
                    color="warning.main"
                    sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}
                  >
                    {fmt(dashboardData?.savingPendingMembersCount)} सदस्य
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight={700} 
                    color="warning.dark" 
                    mt={1}
                    sx={{ 
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    ₹{fmt(dashboardData?.savingPendingAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'warning.lighter', borderRadius: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    mb={1}
                    sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                  >
                    <WarningIcon sx={{ fontSize: { xs: 16, sm: 16 }, mr: 0.5, verticalAlign: 'middle', color: 'warning.main' }} />
                    व्याज प्रलंबित
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight={600} 
                    color="warning.main"
                    sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}
                  >
                    {fmt(dashboardData?.intrestPendingMembersCount)} सदस्य
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight={700} 
                    color="warning.dark" 
                    mt={1}
                    sx={{ 
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    ₹{fmt(dashboardData?.intrestPendingAmount)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: 'error.lighter', borderRadius: 2 }}>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    mb={1}
                    sx={{ fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}
                  >
                    <WarningIcon sx={{ fontSize: { xs: 16, sm: 16 }, mr: 0.5, verticalAlign: 'middle', color: 'error.main' }} />
                    उशीरा भरणा दंड प्रलंबित
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight={600} 
                    color="error.main"
                    sx={{ fontSize: { xs: '0.9375rem', sm: '1rem' } }}
                  >
                    {fmt(dashboardData?.lateFeesPendingMembersCount)} सदस्य
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight={700} 
                    color="error.dark" 
                    mt={1}
                    sx={{ 
                      fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      wordBreak: 'break-word',
                    }}
                  >
                    ₹{fmt(dashboardData?.lateFeesPendingAmount)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledCard>
        </Grid>
      </Grid>

    </StyledContainer>
  );
};

export default SavingGroupDashboard;
