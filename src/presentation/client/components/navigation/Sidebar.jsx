import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as InvestmentIcon,
  Analytics as AnalysisIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';

const menuItems = [
  {
    title: 'Ana Sayfa',
    path: '/',
    icon: <DashboardIcon />,
  },
  {
    title: 'Yatırım Profili',
    path: '/investment-profile',
    icon: <InvestmentIcon />,
  },
  {
    title: 'Analiz',
    path: '/analysis',
    icon: <AnalysisIcon />,
  },
  {
    title: 'Raporlar',
    path: '/reports',
    icon: <ReportsIcon />,
  },
  {
    title: 'Profil',
    path: '/profile',
    icon: <ProfileIcon />,
  },
  {
    title: 'Ayarlar',
    path: '/settings',
    icon: <SettingsIcon />,
  },
];

function Sidebar({ drawerWidth, isOpen, onClose }) {
  const theme = useTheme();
  const location = useLocation();

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo ve Başlık */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <img
          src="/assets/logo.png"
          alt="FinancialPro Logo"
          style={{ width: 40, height: 40, marginRight: 12 }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          FinancialPro
        </Typography>
      </Box>

      {/* Ana Menü */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Alt Bilgi */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          © 2024 FinancialPro
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Mobil Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Masaüstü Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar; 