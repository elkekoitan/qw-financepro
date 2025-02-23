'use client';

import { Box, Container, Grid, Typography, IconButton, Link as MuiLink, Button } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, ArrowUpward } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';

const footerLinks = {
  platform: ['Özellikler', 'Fiyatlandırma', 'Entegrasyonlar', 'API'],
  şirket: ['Hakkımızda', 'Blog', 'Kariyer', 'Basın'],
  destek: ['Yardım Merkezi', 'SSS', 'İletişim', 'Güvenlik'],
  yasal: ['Gizlilik Politikası', 'Kullanım Koşulları', 'KVKK', 'Çerez Politikası'],
};

const socialLinks = [
  { icon: <Facebook />, url: '#', label: 'Facebook' },
  { icon: <Twitter />, url: '#', label: 'Twitter' },
  { icon: <Instagram />, url: '#', label: 'Instagram' },
  { icon: <LinkedIn />, url: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        background: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.95), rgba(0, 0, 0, 0.98))',
        borderTop: '1px solid rgba(191, 164, 111, 0.1)',
        backdropFilter: 'blur(10px)',
        pt: 12,
        pb: 6,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top center, rgba(191, 164, 111, 0.1), transparent 70%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Progress Bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(to right, #BFA46F, #FFD700)',
          transformOrigin: '0%',
          scaleX,
          zIndex: 1000,
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Logo ve Sosyal Medya */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                sx={{
                  mb: 3,
                  background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                FinancePro
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxWidth: '300px',
                  lineHeight: 1.8,
                }}
              >
                Premium finans yönetim platformu ile finansal geleceğinizi
                şekillendirin.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      component={MuiLink}
                      href={social.url}
                      target="_blank"
                      aria-label={social.label}
                      sx={{
                        color: 'rgba(191, 164, 111, 0.8)',
                        background: 'rgba(191, 164, 111, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#FFD700',
                          background: 'rgba(191, 164, 111, 0.2)',
                          boxShadow: '0 0 20px rgba(191, 164, 111, 0.3)',
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Footer Linkleri */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <Grid item xs={6} sm={3} md={2} key={category}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 3,
                    color: '#FFD700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                  }}
                >
                  {category}
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    p: 0,
                    m: 0,
                  }}
                >
                  {links.map((link) => (
                    <Box
                      component="li"
                      key={link}
                      sx={{ mb: 2 }}
                    >
                      <motion.div
                        whileHover={{ x: 6 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Link
                          href="#"
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            position: 'relative',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#FFD700';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                          }}
                        >
                          {link}
                        </Link>
                      </motion.div>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Alt Footer */}
        <Box
          sx={{
            mt: 8,
            pt: 4,
            borderTop: '1px solid rgba(191, 164, 111, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            © {new Date().getFullYear()} FinancePro. Tüm hakları saklıdır.
          </Typography>

          {/* Scroll to Top Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute',
              right: '0',
              top: '-24px',
            }}
          >
            <IconButton
              onClick={scrollToTop}
              sx={{
                background: 'linear-gradient(135deg, #FFD700 0%, #BFA46F 100%)',
                color: '#000',
                '&:hover': {
                  background: 'linear-gradient(135deg, #BFA46F 0%, #8B7355 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(191, 164, 111, 0.2)',
                },
              }}
            >
              <ArrowUpward />
            </IconButton>
          </motion.div>

          <Box
            sx={{
              display: 'flex',
              gap: 4,
              justifyContent: { xs: 'center', sm: 'flex-end' },
            }}
          >
            {['Gizlilik', 'Güvenlik', 'Koşullar'].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  href="#"
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 