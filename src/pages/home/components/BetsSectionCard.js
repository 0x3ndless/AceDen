import { m } from 'framer-motion';
import { useRef } from 'react';
import Slider from 'react-slick';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Card, Container, Typography } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../../components/animate';
import { CarouselArrows } from '../../../components/carousel';
import useResponsive from '../../../hooks/useResponsive';
// ----------------------------------------------------------------------

const AceDenCards = [
  {
    id: 1,
    name: 'I bet 0.1ETH, the Price of ETH will be above $2100 in next 10 hours',
  },
]

export default function BetsSectionCard() {
  const carouselRef = useRef(null);
  const isDesktop = useResponsive('up', 'lg');

  const theme = useTheme();

  const settings = {
    arrows: false,
    slidesToShow: 4,
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

function FeatureCard({item}) {

  return (
    <Card key={item.id} sx={{ p: 1, position: 'relative' }}>
    <Typography variant="subtitle1" sx={{ mt: 2, mb: 2 }}>
      {item.name}
    </Typography>
    <Button variant='outlined' sx={{mb: 2}}>Oppose this Bet</Button>
  </Card>
  );
}
