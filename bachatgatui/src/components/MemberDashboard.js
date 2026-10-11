import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Card,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import PeopleIcon from '@mui/icons-material/People';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import savingGroupService from '../services/savingGroupService';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(4),
  paddingLeft: 0,
  paddingRight: 0,
  background: '#f5f5f5',
  paddingTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(3),
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StatCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})(({ theme, bgColor }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  background: bgColor || '#fff',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const MemberDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  // Parse user data once and memoize
  const user = React.useMemo(() => {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }, []);

  const sgId = user.sgId || 1001;
  const memberId = user.memberId || 1;

  useEffect(() => {
    // Prevent multiple calls (especially in React StrictMode during development)
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching dashboard data for sgId:', sgId, 'memberId:', memberId);
        const response = await savingGroupService.getMemberDashboardData(sgId, memberId);
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
  }, [sgId, memberId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      hasFetchedRef.current = false; // Reset for manual retry
      const response = await savingGroupService.getMemberDashboardData(sgId, memberId);
      setDashboardData(response);
      hasFetchedRef.current = true;
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'डॅशबोर्ड डेटा मिळवण्यात अयशस्वी');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

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
      {/* Bachat Gat Info Card */}
      <Box px={{ xs: 2, sm: 3 }} pt={2} pb={1}>
        <Card
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            mb: 3,
          }}
        >
          <Box p={{ xs: 2, sm: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#fff',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <PeopleIcon sx={{ fontSize: 32 }} />
              {dashboardData?.savingGroupDetails?.sgName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
              गट आयडी: {dashboardData?.savingGroupDetails?.sgId}
            </Typography>
            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  एकूण सदस्य
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  {dashboardData?.savingGroupDetails?.totalMembers}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  एकूण बचत
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  ₹{dashboardData?.savingGroupDetails?.totalSavings?.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  एकूण कर्जे
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  ₹{dashboardData?.savingGroupDetails?.totalLoans?.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  रोख शिल्लक
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#fff' }}>
                  ₹{dashboardData?.savingGroupDetails?.cashBalance?.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Box>
      
      {/* Member Personal Stats */}
   
      <Grid container rowSpacing={3} columnSpacing={3} justifyContent='center' alignItems='center'  >
       <Grid item xs={6} sm={6} md={6}>
          <StatCard bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
                  एकूण बचत
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: 1, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, minWidth: '80px' }}>
                  ₹{dashboardData?.totalSavings?.toLocaleString()}
                </Typography>
                 <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  -
                </Typography>
              </Box>
              <AccountBalanceWalletIcon sx={{ fontSize: { xs: 32, sm: 36 }, color: '#fff', opacity: 0.3 }} />
            </Box>
          </StatCard>
        </Grid>



        <Grid item xs={6} sm={6} md={6}>
          <StatCard bgColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
                  एकूण कर्ज
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: 1, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, minWidth: '80px' }}>
                  ₹{dashboardData?.totalLoan?.toLocaleString()}
                </Typography>
                 <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  -
                </Typography>
              </Box>
              <MoneyOffIcon sx={{ fontSize: { xs: 32, sm: 36 }, color: '#fff', opacity: 0.3 }} />
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <StatCard bgColor="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
                  बचत प्रलंबित
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: 1, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, minWidth: '80px' }}>
                  ₹{dashboardData?.savingPendingAmount?.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  {dashboardData?.savingPendingMonthsCount} महिने
                </Typography>
              </Box>
              <WarningIcon sx={{ fontSize: { xs: 32, sm: 36 }, color: '#fff', opacity: 0.3 }} />
            </Box>
          </StatCard>
        </Grid>

        <Grid item xs={6} sm={6} md={6}>
          <StatCard bgColor="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" sx={{ color: '#fff', opacity: 0.9 }}>
                  व्याज प्रलंबित
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mt: 1, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' }, minWidth: '80px' }}>
                  ₹{dashboardData?.intrestPendingAmount?.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#fff', opacity: 0.8 }}>
                  {dashboardData?.intrestPendingMonthsCount} महिने
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: { xs: 32, sm: 36 }, color: '#fff', opacity: 0.3 }} />
            </Box>
          </StatCard>
        </Grid>
      </Grid>

      {/* Saving Group Details */}
     
   <br/>
      <Grid container spacing={3} mb={4} justifyContent='center'>
        <Grid item xs={12} md={8}>
          <StyledCard>
            <Typography variant="h6" fontWeight={600} mb={2}>
              बचत गट सारांश
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    एकूण सदस्य
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    <PeopleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {dashboardData?.savingGroupDetails?.totalMembers}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    एकूण बचत
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    ₹{dashboardData?.savingGroupDetails?.totalSavings?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    बचत शिल्लक
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="primary">
                    ₹{dashboardData?.savingGroupDetails?.savingsBalance?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    एकूण कर्जे
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    ₹{dashboardData?.savingGroupDetails?.totalLoans?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    व्याज मिळणे
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.dark">
                    ₹{dashboardData?.savingGroupDetails?.totalInterestEarned?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    रोख शिल्लक
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    ₹{dashboardData?.savingGroupDetails?.cashBalance?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    बँक शिल्लक
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    ₹{dashboardData?.savingGroupDetails?.bankBalance?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    एकूण उत्पन्न
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    ₹{dashboardData?.savingGroupDetails?.totalIncome?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    एकूण खर्ज
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    ₹{dashboardData?.savingGroupDetails?.totalExpenses?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} mb={2}>
              प्रलंबित पेमेंट्स आढावा
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    बचत प्रलंबित
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="warning.main">
                    {dashboardData?.savingGroupDetails?.savingPendingMembersCount} सदस्य
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="warning.dark">
                    ₹{dashboardData?.savingGroupDetails?.savingPendingAmount?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    व्याज प्रलंबित
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="warning.main">
                    {dashboardData?.savingGroupDetails?.intrestPendingMembersCount} सदस्य
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="warning.dark">
                    ₹{dashboardData?.savingGroupDetails?.intrestPendingAmount?.toLocaleString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    उशीरा भरणा दंड प्रलंबित
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="warning.main">
                    {dashboardData?.savingGroupDetails?.lateFeesPendingMembersCount} सदस्य
                  </Typography>
                  <Typography variant="h6" fontWeight={600} color="warning.dark">
                    ₹{dashboardData?.savingGroupDetails?.lateFeesPendingAmount?.toLocaleString()}
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

export default MemberDashboard;
