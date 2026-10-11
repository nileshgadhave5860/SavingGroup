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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SavingsIcon from '@mui/icons-material/Savings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

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
    handleMenuClose();
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Menu items from Sidebar
  const menuItems = [
    { key: 'sabhased', label: 'सभासद', icon: <PeopleIcon />, action: () => { navigate('/members'); handleDrawerClose(); } },
    { key: 'mahina', label: 'महिना', icon: <CalendarTodayIcon />, action: () => { navigate('/months'); handleDrawerClose(); } },
    { key: 'karjWatap', label: 'कर्ज वाटप करा', icon: <LocalAtmIcon />, action: () => { navigate('/loans'); handleDrawerClose(); } },
    { key: 'bachatJama', label: 'बचत भरणा बाकी', icon: <SavingsIcon />, action: () => { navigate('/saving-pending'); handleDrawerClose(); } },
    { key: 'karjHaptaPending', label: 'व्याज भरणा बाकी', icon: <SavingsIcon />, action: () => { navigate('/intrest-pending'); handleDrawerClose(); } },
    { key: 'savingdeposit', label: 'बचत ,कर्ज हप्ता व व्याज जमा', icon: <AccountBalanceWalletIcon />, action: () => { navigate('/saving-deposit'); handleDrawerClose(); } },
    { key: 'bankDeposit', label: 'बँक खात्यात पैसे भरा', icon: <AccountBalanceIcon />, action: () => { navigate('/bank-deposit'); handleDrawerClose(); } },
    { key: 'bankWithdraw', label: 'बँक खात्यात पैसे काढा', icon: <AccountBalanceIcon />, action: () => { navigate('/bank-withdraw'); handleDrawerClose(); } },
    { key: 'IncomeAndExpenses', label: 'खर्च आणि उत्पन्न', icon: <SavingsIcon />, action: () => { navigate('/income-expenses'); handleDrawerClose(); } },
    { key: 'LatePaymentCharges', label: 'दंड ', icon: <SavingsIcon />, action: () => { navigate('/late-payment-pending'); handleDrawerClose(); } },
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
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {role}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItemButton key={item.key} onClick={item.action}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={() => { navigate('/saving-group-dashboard'); handleDrawerClose(); }}>
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Saving Groups" />
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

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          {/* Left side - App title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            Bachat Gat
          </Typography>

          {/* Mobile menu icon */}
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

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
        {menuItems.map((item) => (
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
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
