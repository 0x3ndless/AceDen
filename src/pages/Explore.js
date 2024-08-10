import React, { useEffect } from 'react';
// @mui
import { Box, Container, Grid, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import ExploreCard from './home/components/ExploreCard';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { getAllBets } from '../redux/features/contractSlice';
import SkeletonCard from '../components/SkeletonCard';



const Explore = () => {

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const { allBets, loadingBet } = useSelector((state) => ({...state.app}));

  const fetchData = () => {
    dispatch(getAllBets());
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <Page title="Explore Bets">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
            <Grid item xs={12}>

            <Typography variant="h4" gutterBottom style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap',}}>
              <Iconify icon={'streamline-emojis:magnifying-glass-tilted-left'} sx={{mr: 1}} /> Explore Bets
            </Typography>

            <Box sx={{ mt: 5, display: 'grid', gap: 5, gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)', }, }} >

            {loadingBet ? <>
              {[...Array(12)].map((i, index) => 
                <SkeletonCard key={index}/>
              )}
              </> 
              : 
              <>
              {allBets && allBets[0] && allBets[0].length > 0 &&
                <>
                  {allBets[0].map((data) => (
                    <Box key={data.id}>
                      <ExploreCard data={data} />
                    </Box>
                  ))}
                </>
              }
              </>
            }

            </Box>
            </Grid>

            
          </Grid>
      </Container>
    </Page>
  )
}

export default Explore