import React from 'react'  
// @mui
import { styled } from '@mui/material/styles';
// components
import Page from '../components/Page';
// sections
import HomeBanner from './home/HomeBanner';
import MainFooter from '../layouts/main/MainFooter';
import BetsSection from './home/BetsSection';


// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '100vh',
}));

// ----------------------------------------------------------------------

export default function Home() {

  return (
    <Page title="P2P Betting">
     
        <ContentStyle>

          <HomeBanner />

          <BetsSection />

          <MainFooter />

        </ContentStyle>
     
    </Page>
  );
}
