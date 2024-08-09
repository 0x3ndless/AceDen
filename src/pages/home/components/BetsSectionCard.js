import { m } from 'framer-motion';
import { useRef } from 'react';
import Slider from 'react-slick';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Card, Container, Typography, Link, Divider, Grid, Tooltip } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../../components/animate';
import { CarouselArrows } from '../../../components/carousel';
import useResponsive from '../../../hooks/useResponsive';
import Iconify from '../../../components/Iconify';
// ----------------------------------------------------------------------

const AceDenCards = [
  {
    id: 1,
    name: 'I bet that the price of ETH will be above $2500 in the next 10 hours',
  },
]

export default function BetsSectionCard() {
  const carouselRef = useRef(null);
  const isDesktop = useResponsive('up', 'lg');

  const theme = useTheme();

  const settings = {
    arrows: false,
    slidesToShow: 3,
    infinite: false,
    centerPadding: '0px',
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1279,
        settings: { slidesToShow: 3.5 },
      },
      {
        breakpoint: 959,
        settings: { slidesToShow: 2.5 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1.5 },
      },
    ],
  };

  const handlePrevious = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <Container component={MotionViewport} sx={{ pb: 10, textAlign: 'center' }}>

      <m.div variants={varFade().inUp}>
        <Typography variant="h3" sx={{mb: 2}}>🎰 <span className="title_keyword2">Open Bets</span></Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <Typography sx={{ mx: 'auto', maxWidth: 630, color: (theme) => (theme.palette.mode === 'light' ? 'text.secondary' : 'common.white'), }} >
        Explore the latest bets and counter with your own speculation!
        </Typography>
      </m.div>

      <Box sx={{ position: 'relative' }}>
      {isDesktop ?
      <CarouselArrows filled onNext={handleNext} onPrevious={handlePrevious}>
          <Slider ref={carouselRef} {...settings}>
            {AceDenCards.map((item) => (
              <Box key={item.id} component={m.div} variants={varFade().in} sx={{ px: 1.5, mt: 5, mb: 7 }}>
              <FeatureCard item={item}  />
              </Box>
            ))}
          </Slider>
       </CarouselArrows>
       :
          <Slider ref={carouselRef} {...settings}>
            {AceDenCards.map((item) => (
              <Box key={item.id} component={m.div} variants={varFade().in} sx={{ px: 1.5, mt: 5, mb: 7 }}>
              <FeatureCard item={item}  />
              </Box>
            ))}
          </Slider>       
      }
      </Box>

      <Button variant='outlined' size='large'>View All</Button>
    </Container>
  );
}

// ----------------------------------------------------------------------

function FeatureCard() {

  return (
    <Card
      key={1}
      sx={{
        boxShadow: 3,
        p: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '300px', // Set a fixed width for layout consistency
      }}
    >
      <Avatar
        sx={{
          border: '0.5px dotted',
          borderColor: 'text.secondary',
          background: 'transparent',
          width: 56,
          height: 56,
        }}
      >
        <Iconify icon={'flat-color-icons:bullish'} width={40} height={40} />
      </Avatar>
    
      <Typography variant="subtitle2" sx={{ mt: 2, textAlign: 'center' }}>
      <Tooltip title="Creator" placement="right">
        <Link
          href={`https://sepolia.basescan.org/address`}
          target="_blank"
          rel="noopener"
          style={{ textDecoration: 'none', fontWeight: 'bold', color: 'none' }}
        >
          0x3a...2H3J <Iconify icon={'majesticons:open'} sx={{ verticalAlign: 'middle', ml: 0 }} />
        </Link>
        </Tooltip>
      </Typography>
      
      <Typography sx={{ mt: 1, mb: 2, textAlign: 'center' }}>
        I bet that the price of <span style={{ fontWeight: 'bold' }}>ETH</span> will be above{' '}
        <span style={{ fontWeight: 'bold' }}>$2500</span> in the next <span style={{ fontWeight: 'bold' }}>10 hours</span>
      </Typography>

      <Divider sx={{ width: '100%', mb: 2 }} />

      <Grid container sx={{ width: '100%', mb: 2 }}>
        <Grid item xs={6} sx={{ textAlign: 'left' }}>
          <Typography variant="subtitle1" >
            Bet Amount
          </Typography>
          <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', mt: 0.5, }} > <Iconify icon={'cryptocurrency-color:eth'} height={16} width={16} sx={{ mr: 0.5 }} /> 0.01 ETH </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Join Until
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 0.5, }}>10 hours</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ width: '100%', mb: 2 }} />

      <Button startIcon={<Iconify icon="streamline-emojis:thumbs-down-2" />} variant="outlined" sx={{ mb: 2 }}>
        Oppose this Bet
      </Button>
    </Card>
  );
}
