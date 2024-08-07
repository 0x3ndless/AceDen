import React, { useEffect, useState } from 'react'
import { useAccount, useConnect } from 'wagmi';
//---------------Mui Dialog -----------------
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Avatar, Divider, Snackbar, Stack, Grid, Link, Typography} from "@mui/material";
//MUI Alert
import MuiAlert from '@mui/material/Alert';

import useResponsive from '../../hooks/useResponsive';
import Iconify from '../../components/Iconify';
import Label from '../../components/Label';
import Lottie from 'react-lottie';
import loadingAnimation from '../../animations/loading.json';

//Alert
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Connect = () => {

  //--------------------------------------------------------------
  const loadingAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };


  const { isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();
  const isDesktop = useResponsive('up', 'md');

  const [open, setOpen] = useState(false);

  //---------------Snack state---------------------
  const [openSnack, setOpenSnack] = useState(false);
  
  const handleCloseSnack = () => {
    setOpenSnack(false);
  };
  //----------------------------------------------

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    if (error !== null) {
      setOpenSnack(true);
    }
  }, [error]);


  return (
    <>
      <Dialog open={open} onClose={handleClose} sx={{ minWidth: isDesktop ? '340px' : null}}>

      <Snackbar open={openSnack} autoHideDuration={3500} onClose={handleCloseSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} style={{ zIndex: 1200 }}>
        <Alert onClose={handleCloseSnack} severity="info" sx={{ width: '100%'}}>
          {error && "Connection request reset. Please try again."}
        </Alert>
      </Snackbar>
      
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <>
              {isLoading && pendingConnector?.name ? pendingConnector.name : "Connect"}
            <Button onClick={handleClose} sx={{ minWidth: 0 }}>
              <Iconify icon="ic:sharp-close" sx={{ color: 'text.disabled' }} height={22} width={22} />
            </Button> 
            </>
        </DialogTitle>

        <DialogContent sx={{ minWidth: isDesktop ? '340px' : '300px'}}>
        <>
            <Stack sx={{ p: 1 }}>

                {isLoading && pendingConnector?.name ?

                <>

                <Lottie options={loadingAnimationOptions} height={80} width={80} />

                 <Typography variant="body1" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                  Awaiting Confirmation
                 </Typography>

                 <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'text.secondary' }}>
                  Accept the connection request in your wallet
                </Typography>
                 
                </>
    
                 :

                <>

                {connectors.map((connector) => (
                <>
                {!connector.ready && connector.id === 'metaMask' ? 
                 <>
                 {isDesktop &&
                <Button key={connector.id} sx={{mb: 1.5, justifyContent: 'flex-start', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.02)', },}} startIcon={
                    <Avatar
                      alt={connector.name}
                      variant="rounded"
                      sx={{ mr: 1 }}
                    >
                      <img
                        src={connector.name === 'MetaMask' ? "/icons/metamask.svg" : connector.name === 'WalletConnect' ? "/icons/walletconnect.svg" : connector.name === 'Coinbase Wallet' ? "/icons/coinbase.svg" : null}
                        alt={connector.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/icons/wallet_default.svg";
                        }}
                      />
                    </Avatar>} fullWidth size='large' href="https://metamask.io/download/"target="_blank"rel="noopener">
                 {connector.name} <Label sx={{ml: 0.8}} color='success'>Download</Label>
                </Button> }
                </>
                
                :
                <>
             
              <Button onClick={() => connect({ connector })} key={connector.id} sx={{mb: 1.5, justifyContent: 'flex-start', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.02)', },}} startIcon={
                <Avatar
                  alt={connector.name}
                  variant="rounded"
                  sx={{ mr: 1 }}
                >
                  <img
                    src={connector.name === 'MetaMask' ? "/icons/metamask.svg" : connector.name === 'WalletConnect' ? "/icons/walletconnect.svg" : connector.name === 'Coinbase Wallet' ? "/icons/coinbase.svg" : null}
                    alt={connector.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/icons/wallet_default.svg";
                    }}
                  />
                </Avatar>}
                
                fullWidth size='large'>
                
                {connector.name}
                </Button>
              </>
              }
                </>
              ))}

              </>
              }

              <Divider sx={{m: 0.5}}/>

              <Grid container alignItems="center" sx={{ mt: 1.5 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ textAlign: 'left', color: 'text.secondary' }}>
                    New to wallets?
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" component={Link} href='https://ethereum.org/en/wallets/' target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                    Get started
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </>
        </DialogContent>

      </Dialog>


      {!isConnected && (
        <Button variant="outlined" startIcon={<Iconify icon="mdi:login" />} onClick={handleClickOpen}>
          Connect
        </Button>
      )}
    </>
  );
};

export default Connect;