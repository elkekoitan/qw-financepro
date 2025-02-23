'use client';

import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { motion } from 'framer-motion';

const pages = ['Özellikler', 'Fiyatlandırma', 'İletişim'];
const settings = ['Profil', 'Hesap', 'Dashboard', 'Çıkış'];

export default function Header() {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(191, 164, 111, 0.1)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              noWrap
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
                letterSpacing: '.1rem',
                textDecoration: 'none',
              }}
            >
              FinancePro
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: theme.palette.primary.main }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  background: 'rgba(26,26,26,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(191, 164, 111, 0.1)',
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    '&:hover': {
                      background: 'rgba(191, 164, 111, 0.1)',
                    },
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              letterSpacing: '.1rem',
              textDecoration: 'none',
            }}
          >
            FinancePro
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2, justifyContent: 'center' }}>
            {pages.map((page) => (
              <motion.div
                key={page}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    fontWeight: 500,
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  {page}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', gap: 2, alignItems: 'center' }}>
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(191, 164, 111, 0.5)',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    background: 'rgba(191, 164, 111, 0.1)',
                  },
                }}
              >
                Giriş Yap
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
                  color: 'background.default',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #BFA46F 0%, #8B7355 100%)',
                  },
                }}
              >
                Kayıt Ol
              </Button>
            </motion.div>

            <Tooltip title="Ayarlar">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
                  }}
                >
                  U
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{
                mt: '45px',
                '& .MuiPaper-root': {
                  background: 'rgba(26,26,26,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(191, 164, 111, 0.1)',
                },
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={handleCloseUserMenu}
                  sx={{
                    '&:hover': {
                      background: 'rgba(191, 164, 111, 0.1)',
                    },
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 