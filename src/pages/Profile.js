import React, { useState, useEffect } from 'react';
// @mui
import { Tab, Container, Grid, Stack, Chip, Divider, Card } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import EmptyContent from '../components/EmptyContent';
// redux
import { useSelector, useDispatch } from 'react-redux';
// profile scomponent
import ProfileDetailsCard from './user/components/ProfileDetailsCard';
import { getActiveBetsUser, getCompletedBetsUser } from '../redux/features/contractSlice';
import SkeletonCard from '../components/SkeletonCard';
import Label from '../components/Label';



// ----------------------------------------------------------------------

export default function Profile() {

  const { themeStretch } = useSettings();

  const dispatch = useDispatch();
  const { userData, userBetDataActive, loadingUserBet, userBetDataCompleted } = useSelector((state) => ({...state.app}));

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchData = () => {
    dispatch(getActiveBetsUser());
    dispatch(getCompletedBetsUser());
  }

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <Page title="Profile">
       
       <Container maxWidth={themeStretch ? false : 'lg'}>

       <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileDetailsCard userData={userData && userData[0]} />
        </Grid>

        <Grid item xs={12} md={8}>
        <Stack>
          <TabContext value={value}>
            <TabList onChange={handleChange} sx={{ position: 'relative', '& .MuiTabs-indicator': { display: 'none' }  }} allowScrollButtonsMobile variant="scrollable" scrollButtons="auto" >
              <Tab disableRipple label={ <Chip label={<span>Active {userBetDataActive && userBetDataActive[0]?.length > 0 ? <>&nbsp;{<Label color={"info"}>{userBetDataActive[0]?.length}</Label>}</> : <>{<Label color={"info"}>0</Label>}</>}</span>} variant='outlined' clickable sx={ value === '1' ? {color: '#2065D1', borderColor: '#2065D1'} : {} } /> } value="1"  />
              <Tab disableRipple label={ <Chip label={<span>Completed {userBetDataCompleted && userBetDataCompleted[0]?.length > 0 ? <>&nbsp;{<Label color={"info"}>{userBetDataCompleted[0]?.length}</Label>}</> : <>{<Label color={"info"}>0</Label>}</>}</span>} variant='outlined' clickable sx={ value === '2' ? {color: '#2065D1', borderColor: '#2065D1'} : {} } /> } value="2"  sx={{ minWidth: 0, ml: -3.5 }} />
            </TabList>

          <Divider sx={{mb: 2, mt: 0.5}} />
      
          <TabPanel value="1">

            {userBetDataActive && userBetDataActive[0] && userBetDataActive[0].length > 0 ? 
              <>
                {loadingUserBet ? 
                <>
                  {[...Array(12)].map((i, index) => 
                    <SkeletonCard key={index}/>
                  )}
                </>
                :
                <></>
                }
              </>

               :  
               
              <Card>
              <EmptyContent
                      title="It's empty!"
                      description={`Give it some life by placing your first bet!`}
                      sx={{
                        '& span.MuiBox-root': { height: 160 },
              }}/>
              </Card>
              }
          </TabPanel>

          <TabPanel value="2">
          {userBetDataCompleted && userBetDataCompleted[0] && userBetDataCompleted[0].length > 0 ? 
              <>
                {loadingUserBet ? 
                <>
                  {[...Array(12)].map((i, index) => 
                    <SkeletonCard key={index}/>
                  )}
                </>
                :
                <></>
                }
              </>

               :  
               
              <Card>
              <EmptyContent
                      title="It's empty!"
                      description={`Give it some life by placing your first bet!`}
                      sx={{
                        '& span.MuiBox-root': { height: 160 },
              }}/>
              </Card>
              }
          </TabPanel>

        </TabContext>
        </Stack>
        </Grid>
      </Grid>



       </Container>

    </Page>
  );
}
