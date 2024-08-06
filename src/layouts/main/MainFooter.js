import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, Link, Divider, Container, Typography, Stack } from '@mui/material';
// components
import Logo from '../../components/Logo';
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Ecosystem',
    children: [
      { name: 'Explore', href: '' },
    ],
  }, 
];

const RootStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

export default function MainFooter() {
  
  const isDesktop = useResponsive('up', 'lg');
  var currentDate = new Date();
  var currentYear = currentDate.getFullYear();


  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 5 }}>
        <Grid
          container
          justifyContent={{ xs: 'center', md: 'space-between' }}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          <Grid item xs={12} sx={{ mb: 3 }}>
            {isDesktop ? 
            <Logo sx={{ mx: { md: 'inherit' } }} />
            :

            <Typography variant="h3" gutterBottom sx={{ ml: 0 }}><span className="title_keyword2">AceDen</span></Typography>
            }
          </Grid>
          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
            A P2P Betting
            </Typography>

          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    <Link
                      to={link.href}
                      key={link.name}
                      color="inherit"
                      variant="body2"
                      component={RouterLink}
                      sx={{ display: 'block' }}
                      target="_blank" rel="noopener"
                      style={{ textDecoration: 'none' }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          component="p"
          variant="body2"
          sx={{
            mt: 7,
            pb: 5,
            fontSize: 13,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          © {currentYear} AceDen. All rights reserved
        </Typography>
      </Container>
    </RootStyle>
  );
}
