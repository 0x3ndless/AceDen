import React from 'react';
// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components 
import Page from '../components/Page';
import HeaderBreadcrumbs from '../components/HeaderBreadcrumbs';
import BetForm from './user/BetForm';

// ----------------------------------------------------------------------

export default function Bet() {
  const { themeStretch } = useSettings();


  return (
    <Page title="Create a Bet">

      <Container maxWidth={themeStretch ? false : 'lg'}>

         <HeaderBreadcrumbs
          heading="Create a Bet"
          links={[
            { name: 'Explore', href: '/explore' },
            { name: 'Create'},
          ]}
        />

        {/* <BetForm/> */}

      </Container>
    </Page>
  );
}
