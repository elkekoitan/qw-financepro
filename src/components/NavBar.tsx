'use client';

import { AppBar, Box, Container, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { mode } = useTheme();

  return (
    <AppBar
      position="static"
      className={`${mode === 'dark' ? 'bg-dark-surface' : 'bg-white'} border-b border-gray-800`}
    >
      <Toolbar className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-grow"
        >
          <Link href="/dashboard" className="flex items-center">
            <Typography
              variant="h6"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-primary"
            >
              FinancePro
            </Typography>
          </Link>
          <div className="hidden md:flex ml-10 space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Portföy
            </Link>
            <Link
              href="/investments"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Yatırımlar
            </Link>
          </div>
        </motion.div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="contained"
            color="primary"
            className="bg-primary hover:bg-primary-dark"
          >
            Çıkış
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
} 