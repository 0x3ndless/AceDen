import React, { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components 
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
//--------------------Redux---------------------------------
import { useDispatch, useSelector } from 'react-redux';
import { getLeaderBoardData } from '../redux/features/contractSlice';
import LeaderboardList from './leaderboard/LeaderboardList';
import SkeletonItem from '../components/SkeletonItem';

// ----------------------------------------------------------------------

export default function Leaderboard() {
  const { themeStretch } = useSettings();
  
  const dispatch = useDispatch();
  const { loadingLeaderBoard, leaderBoardData } = useSelector((state) => ({...state.app}));

  const fetchLeaderBoard = () => {
    dispatch(getLeaderBoardData());
  }

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  return (
    <Page title="🏆 Leaderboard">

      <Container maxWidth={themeStretch ? false : 'lg'}>

         <HeaderBreadcrumbs
          heading="🏆 Leaderboard"
          links={[
            { name: 'Home', href: '/' },
            { name: 'Leaderboard'},
          ]}
        />

      {loadingLeaderBoard ? 
      <SkeletonItem/> 
        :
      <LeaderboardList leaderBoardData={leaderBoardData && leaderBoardData[0]}/>
      }
      
      </Container>
    </Page>
  );
}
