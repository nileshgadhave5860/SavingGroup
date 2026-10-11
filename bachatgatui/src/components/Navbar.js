import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
}));

const UserSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const Navbar = ({ userName, userRole }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = userName || user.name || 'User';
  const role = userRole || user.role || 'Member';

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setUserDrawerOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleUserDrawerToggle = () => {
    setUserDrawerOpen(!userDrawerOpen);
  };

  const navigateToDashboard = () => {
    if (role === 'SavingGroup') {
      navigate('/saving-group-dashboard');
    } else {
      navigate('/member-dashboard');
    }
    handleDrawerClose();
  };

  const handleUserDrawerClose = () => {
    setUserDrawerOpen(false);
  };

  // Menu items from Sidebar - Admin Section
  const adminMenuItems = [
    { key: 'sabhased', label: 'सभासद', icon: <PeopleIcon />, action: () => { navigate('/members'); handleDrawerClose(); } },
    { key: 'mahina', label: 'महिना', icon: <CalendarTodayIcon />, action: () => { navigate('/months'); handleDrawerClose(); } },
    { key: 'karjWatap', label: 'कर्ज वाटप करा', icon: <LocalAtmIcon />, action: () => { navigate('/loans'); handleDrawerClose(); } },
    { key: 'savingdeposit', label: 'बचत ,कर्ज हप्ता व व्याज जमा', icon: <AccountBalanceWalletIcon />, action: () => { navigate('/saving-deposit'); handleDrawerClose(); } },
    { key: 'bankDeposit', label: 'बँक खात्यात पैसे भरा', icon: <AccountBalanceIcon />, action: () => { navigate('/bank-deposit'); handleDrawerClose(); } },
    { key: 'bankWithdraw', label: 'बँक खात्यात पैसे काढा', icon: <AccountBalanceIcon />, action: () => { navigate('/bank-withdraw'); handleDrawerClose(); } },
    { key: 'IncomeAndExpenses', label: 'खर्च आणि उत्पन्न', icon: <SavingsIcon />, action: () => { navigate('/income-expenses'); handleDrawerClose(); } },
    { key: 'bachatJama', label: 'बचत भरणा बाकी', icon: <AssessmentIcon />, action: () => { navigate('/saving-pending'); handleDrawerClose(); } },
    { key: 'karjHaptaPending', label: 'व्याज भरणा बाकी', icon: <AssessmentIcon />, action: () => { navigate('/intrest-pending'); handleDrawerClose(); } },
    { key: 'LatePaymentCharges', label: 'दंड ', icon: <AssessmentIcon />, action: () => { navigate('/late-payment-pending'); handleDrawerClose(); } },


  ];

  // Report Section
  const reportMenuItems = [
    { key: 'SavingPendingReport', label: 'बचत भरणा बाकी अहवाल', icon: <AssessmentIcon />, action: () => { navigate('/saving-pending-report'); handleDrawerClose(); } },
    { key: 'LoanPendingReport', label: 'कर्ज भरणा बाकी अहवाल', icon: <AssessmentIcon />, action: () => { navigate('/loan-pending-report'); handleDrawerClose(); } },
    { key: 'IntrestPendingReport', label: 'व्याज भरणा बाकी अहवाल', icon: <AssessmentIcon />, action: () => { navigate('/intrest-pending-report'); handleDrawerClose(); } },
    { key: 'LatePaymentPendingReport', label: 'दंड भरणा बाकी अहवाल', icon: <AssessmentIcon />, action: () => { navigate('/late-payment-pending-report'); handleDrawerClose(); } },
    { key: 'MemberReport', label: 'सभासद अहवाल', icon: <AssessmentIcon />, action: () => { navigate('/member-report'); handleDrawerClose(); } },
    { key: 'MonthDepositReport', label: 'महिन्याचा जमा अहवाल', icon: <AssessmentIcon />, action: () => { navigate('/month-deposit-report'); handleDrawerClose(); } },
    { key: 'MonthPendingReport', label: 'महिन्याचा बाकी अहवाल', icon: <AssessmentIcon />, action: () => { navigate('/month-pending-report'); handleDrawerClose(); } },
  ];

  const drawerContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: '#667eea',
            width: 48,
            height: 48,
            fontSize: '1.5rem',
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
          
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {/* Admin Section - Only for Saving Group role */}
        {role === 'SavingGroup' && (
          <>
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
              Admin
            </Typography>
            {adminMenuItems.map((item) => (
              <ListItemButton key={item.key} onClick={item.action}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
            <Divider sx={{ my: 2 }} />
          </>
        )}
        
        {/* Report Section */}
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>
          Report
        </Typography>
        {reportMenuItems.map((item) => (
          <ListItemButton key={item.key} onClick={item.action}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={navigateToDashboard}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </ListItemButton>
      </List>
    </Box>
  );

  const userDrawerContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3, mt: 2 }}>
        <Avatar
          sx={{
            bgcolor: '#667eea',
            width: 72,
            height: 72,
            fontSize: '2rem',
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {role}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        <ListItemButton onClick={() => { navigate('/profile'); handleUserDrawerClose(); }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton onClick={() => { navigate('/change-password'); handleUserDrawerClose(); }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Change Password" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          {/* Left side - Menu icon (only for Saving Group role) */}
         
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
         

          {/* Center - App title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              cursor: 'pointer',
              flexGrow: 1,
              textAlign: role === 'Saving Group' ? 'center' : 'left',
            }}
            onClick={navigateToDashboard}
          >
           {displayName}
          </Typography>

          {/* Right side - Notification and User icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              size="large"
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleUserDrawerToggle}
              size="large"
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>

          {/* Right side - User menu (desktop) - Hidden */}
          <UserSection sx={{ display: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  bgcolor: '#fff',
                  color: '#667eea',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={handleMenuClick}
              >
                {displayName.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ cursor: 'pointer' }} onClick={handleMenuClick}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {displayName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {role}
                </Typography>
              </Box>
            </Box>

            <IconButton
              color="inherit"
              onClick={handleMenuClick}
              size="small"
              sx={{ ml: 1 }}
            >
              ▼
            </IconButton>
          </UserSection>

          {/* Mobile user button */}
          <IconButton
            color="inherit"
            sx={{ display: 'none' }}
            onClick={handleDrawerToggle}
          >
            <AccountCircleIcon />
          </IconButton>
        </StyledToolbar>
      </StyledAppBar>

      {/* Desktop Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {displayName}
          </Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {role}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        {role === 'Saving Group' && (
          <>
            <MenuItem disabled>
              <Typography variant="overline" sx={{ fontWeight: 600 }}>
                Admin
              </Typography>
            </MenuItem>
            {adminMenuItems.map((item) => (
              <MenuItem key={item.key} onClick={item.action}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ fontSize: '1.2rem' }}>{item.icon}</Box>
                  <Typography>{item.label}</Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider sx={{ my: 0.5 }} />
          </>
        )}
        <MenuItem disabled>
          <Typography variant="overline" sx={{ fontWeight: 600 }}>
            Report
          </Typography>
        </MenuItem>
        {reportMenuItems.map((item) => (
          <MenuItem key={item.key} onClick={item.action}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ fontSize: '1.2rem' }}>{item.icon}</Box>
              <Typography>{item.label}</Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => { navigate('/saving-group-dashboard'); handleMenuClose(); }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceIcon sx={{ fontSize: '1.2rem' }} />
            <Typography>Saving Groups</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoutIcon sx={{ fontSize: '1.2rem' }} />
            <Typography>Sign Out</Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        {drawerContent}
      </Drawer>

      {/* User Drawer */}
      <Drawer
        anchor="right"
        open={userDrawerOpen}
        onClose={handleUserDrawerClose}
      >
        {userDrawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
